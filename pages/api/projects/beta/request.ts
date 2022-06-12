import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabase from "../../../../lib/SupabaseClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(500).json({ error: error.message });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body.project) return res.status(500).json({ error: "You need to provide a 'project' body." });
    if (!req.body.user) return res.status(500).json({ error: "You need to provide a 'user' body." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { error } = await supabase.from("project_requests").insert({
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