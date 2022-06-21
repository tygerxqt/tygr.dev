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

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.project) return res.status(500).json({ error: "You need to provide a 'project' query." });
    if (!req.query.user) return res.status(500).json({ error: "You need to provide a 'user' query." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { data, error } = await supabase.from("project_requests").select("*").eq("project", req.query.project).eq("user", req.query.user);

    if (error) {
        res.status(500).json({ error: error.message });
        throw error;
    }

    res.status(200).json({ data: data[0] });
});

export default apiRoute;