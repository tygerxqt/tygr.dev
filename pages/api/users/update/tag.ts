import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabaseAdmin from "../../../../lib/SupabaseAdminClient";
import supabase from "../../../../lib/SupabaseClient";

const apiRoute = nextConnect({
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body.tag) return res.status(502).json({ error: "Tag is required." });
    if (req.body.tag.length !== 4) return res.status(502).json({ error: "Tag must be exactly 4 characters." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { data: userData, error: userError } = await supabaseAdmin.from("users").select("username, tag");
    if (userError) {
        return res.status(502).json({ error: userError });
    }

    // check if a user has the username and tag already
    const user = userData.find(user => user.username === req.body.username && user.tag.toString().substring(0, 4) === req.body.tag);
    if (user) {
        return res.status(502).json({ error: "Username and tag already exists." });
    }

    const { error } = await supabase.from("users").update({ tag: req.body.tag }).eq("id", cookie.user.id);
    if (error) {
        return res.status(502).json({ error: error });
    }

    res.status(200).json({
        message: `Tag updated to #${req.body.tag}`,
    });
});

export default apiRoute;