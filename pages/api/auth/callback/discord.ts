import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { DiscordUser } from "../../../../types/DiscordUser";
import { GithubUser } from "../../../../types/GithubUser";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.`})
    },
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query) return res.status(502).json({ error: "You need to provide a 'code' query." });
    if (req.query.error) return res.status(502).redirect("/profile").json({ error: req.query.error });
    if (!req.query.code) return res.status(502).json({ error: "Missing 'code' query." });

    const params = new URLSearchParams();
    params.append('client_id', process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', req.query.code as string);
    params.append('redirect_uri', `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/discord`);
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

    res.status(200).json({ data: discordUser });
});

export default apiRoute;