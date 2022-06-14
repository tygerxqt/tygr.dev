import cookieParser from "cookie-parser";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabase from "../../../../lib/SupabaseClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
}).use(cookieParser()).delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await supabase.auth.api.deleteAuthCookie(req, res, { redirectTo: "/profile" });
});

export default apiRoute;