import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabase from "../../../../lib/SupabaseClient";
import { DiscordUser } from "../../../../types/Identites/DiscordUser";
import cookieParser from "cookie-parser";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.use(cookieParser());

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query) return res.status(500).json({ error: "You need to provide a 'code' query." });
    if (req.query.error) {
        if (req.query.error === `access_denied`) return res.status(500).redirect("/account");
        else return res.status(500).json({ error: req.query.error });
    }
    if (!req.query.code) return res.status(500).json({ error: "Missing 'code' query." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const params = new URLSearchParams();
    params.append('client_id', process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', req.query.code as string);
    params.append('redirect_uri', `${process.env.NEXT_PUBLIC_URL}/api/auth/link/discord`);
    params.append('scope', 'identify%20email');

    const json = await (await fetch('https://discord.com/api/oauth2/token', { method: "POST", body: params })).json();

    if (!json) {
        return res.status(500).json({
            error: "Linking failed. Please try again.",
        });
    }

    const client = axios.create({
        baseURL: 'https://discord.com/api/v9'
    });

    const discordUser: DiscordUser = await (await client.get(`/users/@me`, { headers: { Authorization: `Bearer ${json.access_token}` } })).data;

    if (!discordUser) {
        return res.status(500).json({
            error: "Linking failed. Please try again.",
        });
    }

    const { data: userData } = await supabase.from("users").select("discord").eq("id", cookie.user.id);
    if (userData[0].discord.id) {
        return res.status(500).json({
            error: "You already linked your account.",
        });
    }

    const { error } = await supabase.from("users").update({
        discord: {
            id: discordUser.id,
            username: discordUser.username,
            discriminator: discordUser.discriminator,
            avatar: discordUser.avatar,
            email: discordUser.email
        }
    }).eq("id", cookie.user.id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).redirect("/account");
});

export default apiRoute;