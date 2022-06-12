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

apiRoute.delete(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.token) return res.status(500).json({ error: "You need to provide a 'TOKEN' query." });
    if (!req.query.id) return res.status(500).json({ error: "You need to provide a 'ID' query." });

    const { user } = await supabaseAdmin.auth.api.getUser(req.query.token as string);

    if (!user) {
        res.status(500).json({
            error: "Unauthorized.",
        });
    }

    const { data: commentUser, error: fetchErr } = await supabaseAdmin.from("project_comments").select("user_id").eq("id", req.query.id);
    if (fetchErr) {
        res.status(500).json({ error: fetchErr.message });
        throw fetchErr;
    }

    const { data: admin, error: userFetchError } = await supabaseAdmin.from("users").select("badges->>admin").eq("id", user.id);
    if (userFetchError) {
        res.status(500).json({ error: userFetchError.message });
        throw userFetchError;
    }

    if (!commentUser[0]) {
        res.status(500).json({
            error: "Comment not found.",
        });
    }

    if (admin || user.id === commentUser[0].user_id) {
        const { error: delError } = await supabaseAdmin.from("project_comments").delete().eq("id", req.query.id);
        if (delError) {
            res.status(500).json({ error: delError.message });
            throw delError;
        }

        res.status(200).json({ data: "Comment deleted." });
    } else {
        res.status(500).json({
            error: "Missing permissions.",
        });
    }
});

export default apiRoute;
