import { NextApiRequest, NextApiResponse } from "next";
import { URLSearchParams } from "url";
import nextConnect from "next-connect";
import axios from "axios";
import supabase from "../../../lib/SupabaseClient";
import { DiscordUser } from "../../../types/DiscordUser";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    }
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query) return res.status(500).json({ error: "What are you doing?!" });
    if (!req.query.code) {
        if (req.query.error || req.query.error_description) {
            return res.status(500).json({ error: `${req.query.error} | ${req.query.error_description}` });
        } else {
            return res.status(500).json({ error: "Missing 'code' parameter." });
        }
    }

    const params = new URLSearchParams();
    params.append('client_id', process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', req.query.code as string);
    params.append('redirect_uri', `${process.env.NEXT_PUBLIC_URL}/api/link/discord`);
    params.append('scope', 'identify');

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

    const { error: DBerr } = await supabase.from("users").update({ discord: { id: discordUser.id, username: discordUser.username, discriminator: discordUser.discriminator } }).eq("id", discordUser.id);
    if (DBerr) return res.status(500).json({ error: "Database error. Link aborted. Maybe you're not logged in? Please try again." });
    const { error: metadataErr } = await supabase.auth.update({
        data: {
            discord: {
                id: discordUser.id,
                username: discordUser.username,
                discriminator: discordUser.discriminator,
            },
        }
    });
    if (metadataErr) return res.status(500).json({ error: "Linking failed. Maybe you're not logged in? Please try again." });

    res.status(200).json({ data: `Linked '${discordUser.username}#${discordUser.discriminator}' (${discordUser.id}) to "${supabase.auth.user().email}"` });
});

export default apiRoute;