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
    if (!req.body.name) return res.status(502).json({ error: "Full name is required." });
    if (!req.body.email) return res.status(502).json({ error: "Email is required." });
    if (!req.body.username) return res.status(502).json({ error: "Username is required." });
    if (!req.body.password) return res.status(502).json({ error: "Password is required." });

    const { data: userData, error: userError } = await supabaseAdmin.from("users").select("username, tag");
    if (userError) {
        return res.status(502).json({ error: userError });
    }

    function generateTag() {
        const tag = Math.floor(Math.random() * 9999 + 1).toString();
        const tagPadded = tag.length < 4 ? tag.padStart(4, "0") : tag.substring(0, 4);
        return tagPadded;
    }

    // generate a random tag and see if someone has the username and tag already, if so then generate a new one
    let tag = generateTag();

    while (userData.find(user => user.username === req.body.username && user.tag.toString().substring(0, 4) === tag)) {
        tag = generateTag();
    }

    const { error } = await supabase.auth.signUp({ email: req.body.email, password: req.body.password }, { data: { full_name: req.body.name, username: req.body.username, tag: tag } });
    if (error) {
        return res.status(502).json({ error: error });
    }

    res.status(200).json({
        message: `Please check your email for a verification link.`,
    });
});

export default apiRoute;