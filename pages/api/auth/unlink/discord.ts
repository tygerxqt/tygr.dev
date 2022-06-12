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
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body) {
        return res.status(500).json({ error: "You need to provide a 'token' query." });
    }

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { data: userData } = await supabase.from("users").select("discord").eq("id", cookie.user.id);
    if (!userData[0].discord.id) {
        return res.status(500).json({
            error: "There is no Discord account to unlink.",
        });
    }

    const { error } = await supabase.from("users").update({ discord: {} }).eq("id", cookie.user.id);
    if (error) {
        return res.status(500).json({
            error: "Unlinking failed. Please try again.",
        });
    }

    return res.status(200).json({ data: true });
});

export default apiRoute;