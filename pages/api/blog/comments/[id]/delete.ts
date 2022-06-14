import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabase from "../../../../../lib/SupabaseClient";
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

apiRoute.delete(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.id) return res.status(500).json({ error: "You need to provide a 'id' query." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { data: commentUser, error: fetchErr } = await supabase.from("blog_comments").select("user").eq("id", req.query.id);
    if (fetchErr) {
        res.status(500).json({ error: fetchErr.message });
        throw fetchErr;
    }

    if (!commentUser[0]) {
        res.status(500).json({
            error: "Comment not found.",
        });
    }

    const { data: admin, error: userFetchError } = await supabase.from("users").select("badges->>admin").eq("id", cookie.user.id);
    if (userFetchError) {
        res.status(500).json({ error: userFetchError.message });
        throw userFetchError;
    }

    if (admin || cookie.user.id === commentUser[0].user_id) {
        const { error: delError } = await supabase.from("blog_comments").delete().eq("id", req.query.id);
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
