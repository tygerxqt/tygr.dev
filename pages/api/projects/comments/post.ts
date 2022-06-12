import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabaseAdmin from "../../../../lib/SupabaseAdminClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(500).json({ error: error.message });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.token) return res.status(500).json({ error: "You need to provide a 'TOKEN' query." });
    if (!req.body.project_id) return res.status(500).json({ error: "You need to provide a 'project_id' body." });
    if (!req.body.comment) return res.status(500).json({ error: "You need to provide a comment." });

    const { user } = await supabaseAdmin.auth.api.getUser(req.query.token as string);

    if (!user) {
        res.status(500).json({
            error: "Unauthorized.",
        });
    }

    const { data: avatar } = await supabaseAdmin.from("users").select("avatar").eq("id", user.id);

    const { data, error } = await supabaseAdmin.from("project_comments").insert({
        project_id: req.body.project_id,
        body: req.body.comment,
        username: user.user_metadata.username,
        tag: user.user_metadata.tag,
        avatar: avatar[0].avatar,
        user_id: user.id,
    });
    if (error) {
        res.status(500).json({ error: error });
        throw error;
    }

    res.status(200).json({ data: data });
});

export default apiRoute;