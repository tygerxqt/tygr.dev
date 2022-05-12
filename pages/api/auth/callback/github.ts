import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
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

    const client = axios.create();

    const json = await client.post(`https://github.com/login/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.query.code}`, undefined, {
        headers: {
            "Accept": "application/json",
        },
    });

    const user = await client.get(`https://api.github.com/user`, {
        headers: {
            "Authorization": `token ${json.data.access_token}`,
        },
    });

    const gitUser: GithubUser = {
        login: user.data.login,
        id: user.data.id,
        avatar_url: user.data.avatar_url,
        url: user.data.url,
        email: user.data.email,
    };
    
    res.status(200).json({ data: gitUser });
});

export default apiRoute;