import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabase from "../../../../lib/SupabaseClient";
import cookieParser from "cookie-parser";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(500).json({ error: error.message });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.use(cookieParser());

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body.project_id) return res.status(500).json({ error: "You need to provide a 'project_id' body." });
    if (!req.body.comment) return res.status(500).json({ error: "You need to provide a comment." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { data: avatar } = await supabase.from("users").select("avatar").eq("id", cookie.user.id);

    const { data, error } = await supabase.from("project_comments").insert({
        project_id: req.body.project_id,
        body: req.body.comment,
        username: cookie.user.user_metadata.username,
        tag: cookie.user.user_metadata.tag,
        avatar: avatar[0].avatar,
        user_id: cookie.user.id,
    });
    if (error) {
        res.status(500).json({ error: error });
        throw error;
    }

    res.status(200).json({ data: data });
});

export default apiRoute;