import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabase from "../../../../lib/SupabaseClient";
import { GithubUser } from "../../../../types/GithubUser";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query) return res.status(502).json({ error: "You need to provide a 'code' query." });
    if (req.query.error) return res.status(502).json({ error: req.query.error });
    if (!req.query.code) return res.status(502).json({ error: "Missing 'code' query." });

    const client = axios.create();

    const json = await client.post(`https://github.com/login/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.query.code}`, undefined, {
        headers: {
            "Accept": "application/json",
        },
    });

    const fetchedUser = await client.get(`https://api.github.com/user`, {
        headers: {
            "Authorization": `token ${json.data.access_token}`,
        },
    });

    const gitUser: GithubUser = {
        username: fetchedUser.data.login,
        id: fetchedUser.data.id,
        avatar_url: fetchedUser.data.avatar_url,
        url: fetchedUser.data.url,
        email: fetchedUser.data.email,
    };

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }
    await supabase.auth.setAuth(cookie.token);

    const { error } = await supabase
        .from("users")
        .update({
            github: {
                username: gitUser.username,
                id: gitUser.id,
                avatar_url: gitUser.avatar_url,
                url: gitUser.url,
                email: gitUser.email,
            },
        }).eq("id", cookie.user.id);
    if (error) return res.status(502).json({ error: error.message });

    res.status(200).redirect("/profile");
});

export default apiRoute;