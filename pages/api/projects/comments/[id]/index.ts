import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabaseAdmin from "../../../../../lib/SupabaseAdminClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(500).json({ error: error.message });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.token) return res.status(500).json({ error: "You need to provide a 'TOKEN' query." });
    if (!req.query.id) return res.status(500).json({ error: "You need to provide a 'id' query." });

    const { user } = await supabaseAdmin.auth.api.getUser(req.query.token as string);

    if (!user) {
        res.status(500).json({
            error: "Unauthorized.",
        });
    }

    const { data, error } = await supabaseAdmin.from("project_comments").select("*").eq("project_id", req.query.id);
    if (error) {
        res.status(500).json({ error: error.message });
        throw error;
    }

    res.status(200).json({ data: data });
});

export default apiRoute;