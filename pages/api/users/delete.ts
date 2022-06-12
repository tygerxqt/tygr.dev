import { Deta } from "deta";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../lib/Stripe";
import supabaseAdmin from "../../../lib/SupabaseAdminClient";
import supabase from "../../../lib/SupabaseClient";

const apiRoute = nextConnect({
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { data: userData, error: userError } = await supabase.from("users").select("avatar, banner").eq("id", cookie.user.id);
    if (userError) {
        return res.status(500).json({ error: userError });
    }

    if (!userData[0].avatar.includes("default")) {
        const deta = Deta(process.env.DETA_PROJECT_KEY);
        const drive = deta.Drive("avatars");
        const list = await (await drive.list()).names;
        if (!list || list.length < 1) {
            return console.log("Avatar not found. Skipping...");
        }

        const files = list.filter((name) => name.includes(cookie.user.id));
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

        const files = list.filter((name) => name.includes(cookie.user.id));
        if (!files || files.length < 1) {
            return console.log("Banner not found. Skipping...");
        }

        files.forEach(async (file) => {
            await drive.delete(file);
        });
    }

    const { error: customerError, data: customerData } = await supabase.from("users").select("customer").eq("id", cookie.user.id);
    if (customerError) {
        return res.status(500).json({ error: customerError.message });
    }

    if (!customerData || !customerData[0] || !customerData[0].customer || !customerData[0].customer.id) {
        return res.status(200).json({ error: "No customer exists." });
    }

    await stripe.customers.del(customerData[0].customer.id);

    const { error: tableErr } = await supabase.from("users").delete().match({ id: cookie.user.id });
    if (tableErr) {
        return res.status(500).json({ error: tableErr });
    }

    const { error } = await supabaseAdmin.auth.api.deleteUser(cookie.user.id);
    if (error) {
        return res.status(500).json({ error: error });
    }

    res.status(200).json({
        data: `Your account has been deleted.`,
    });
});

export default apiRoute;