import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabase from "../../../lib/SupabaseClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(500).json({ error: error.message });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.delete(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.id) return res.status(500).json({ error: "You need to provide a 'ID' query." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { error: delErr } = await supabase.from("notifications").delete().eq("id", req.query.id);
    if (delErr) {
        res.status(500).json({ error: delErr.message });
        throw delErr;
    }

    res.status(200).json({ data: "Notification deleted." });
});

export default apiRoute;
