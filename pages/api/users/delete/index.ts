import { Deta } from "deta";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabaseAdmin from "../../../../lib/SupabaseAdminClient";

const apiRoute = nextConnect({
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body.token) return res.status(502).json({ error: "Token is required." });

    const user = await supabaseAdmin.auth.api.getUser(req.body.token);
    if (!user) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    const { data: userData, error: userError } = await supabaseAdmin.from("users").select("avatar, banner").eq("id", user.user.id);
    if (userError) {
        return res.status(502).json({ error: userError });
    }

    if (!userData[0].avatar.includes("default")) {
        const deta = Deta(process.env.DETA_PROJECT_KEY);
        const drive = deta.Drive("avatars");
        const list = await (await drive.list()).names;
        if (!list || list.length < 1) {
            return console.log("Avatar not found. Skipping...");
        }

        const files = list.filter((name) => name.includes(user.user.id));
        if (!files || files.length < 1) {
            return console.log("Avatar not found. Skipping...");
        }

        files.forEach(async (file) => {
            await drive.delete(file);
        });
    }

    if (!userData[0].banner.includes("default")) {
        const deta = Deta(process.env.DETA_PROJECT_KEY);
        const drive = deta.Drive("banners");
        const list = await (await drive.list()).names;
        if (!list || list.length < 1) {
            return console.log("Banner not found. Skipping...");
        }

        const files = list.filter((name) => name.includes(user.user.id));
        if (!files || files.length < 1) {
            return console.log("Banner not found. Skipping...");
        }

        files.forEach(async (file) => {
            await drive.delete(file);
        });
    }

    const { error: tableErr } = await supabaseAdmin.from("users").delete().match({ id: user.user.id });
    if (tableErr) {
        return res.status(502).json({ error: tableErr });
    }

    const { error } = await supabaseAdmin.auth.api.deleteUser(user.user.id);
    if (error) {
        return res.status(502).json({ error: error });
    }

    res.status(200).json({
        message: `Your account has been deleted.`,
    });
});

export default apiRoute;