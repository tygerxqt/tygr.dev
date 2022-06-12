import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabaseAdmin from "../../../lib/SupabaseAdminClient";

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

    const { error: delErr } = await supabaseAdmin.from("notifications").delete().eq("id", req.query.id);
    if (delErr) {
        res.status(500).json({ error: delErr.message });
        throw delErr;
    }

    res.status(200).json({ data: "Notification deleted." });
});

export default apiRoute;
