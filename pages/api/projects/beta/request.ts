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
    if (!req.body.project) return res.status(500).json({ error: "You need to provide a 'project' body." });
    if (!req.body.user) return res.status(500).json({ error: "You need to provide a 'user' body." });

    const { user } = await supabaseAdmin.auth.api.getUser(req.query.token as string);

    if (!user) {
        res.status(500).json({
            error: "Unauthorized.",
        });
    }

    const { error } = await supabaseAdmin.from("project_requests").insert({
        project: req.body.project,
        user: req.body.user,
    });

    if (error) {
        res.status(500).json({ error: error.message });
        throw error;
    }

    res.status(200).json({ data: "Request sent." });
});

export default apiRoute;