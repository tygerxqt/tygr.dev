import axios from "axios";
import { SignJWT } from "jose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabaseAdmin from "../../../../lib/SupabaseAdminClient";
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

    const json = await client.post(`https://github.com/login/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_PIXEL_LINK_GITHUB_CLIENT_ID}&client_secret=${process.env.PIXEL_LINK_GITHUB_CLIENT_SECRET}&code=${req.query.code}`, undefined, {
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

    const { data: user } = await supabaseAdmin.from("users").select("*").eq("github->>id", gitUser.id);
    
    // const token = await new SignJWT({
    //     role: 'authenticated',
    //     someclaim : 'VaaVaaVoom'
    //   })
    //     .setProtectedHeader({ alg: 'HS256' })
    //     .setSubject(user.id)
    //     .setAudience('authenticated')
    //     .setIssuedAt()
    //     .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    res.status(200).json({ data: "bruh" });
});

export default apiRoute;