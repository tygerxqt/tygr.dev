import { Deta } from "deta";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../lib/Stripe";
import supabaseAdmin from "../../../lib/SupabaseAdminClient";
import supabase from "../../../lib/SupabaseClient";
import cookieParser from "cookie-parser";

const apiRoute = nextConnect({
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.use(cookieParser());

apiRoute.delete(async (req: NextApiRequest, res: NextApiResponse) => {
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
            console.log("Avatar not found. Skipping...");
        }

        const files = list.filter((name) => name.includes(cookie.user.id));
        if (!files || files.length < 1) {
            console.log("Avatar not found. Skipping...");
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
            console.log("Banner not found. Skipping...");
        }

        const files = list.filter((name) => name.includes(cookie.user.id));
        if (!files || files.length < 1) {
            console.log("Banner not found. Skipping...");
        }

        files.forEach(async (file) => {
            await drive.delete(file);
        });
    }

    const { error: customerError, data: customerData } = await supabase.from("users").select("customer").eq("id", cookie.user.id);
    if (customerError) {
        return res.status(500).json({ error: customerError.message });
    }

    if (customerData[0].customer && !customerData[0].customer.id) {
        try {
            await stripe.customers.del(customerData[0].customer.id);
        } catch (err) {
            console.log(err);
        }
    }

    const { error: blogCommentsError } = await supabase.from("blog_comments").delete().match({ user: cookie.user.id });
    if (blogCommentsError) {
        return res.status(500).json({ error: customerError.message });
    }

    const { error: feedCommentsError } = await supabase.from("feed_comments").delete().match({ user: cookie.user.id });
    if (feedCommentsError) {
        return res.status(500).json({ error: feedCommentsError.message });
    }

    const { error: projectCommentsError } = await supabase.from("project_comments").delete().match({ user: cookie.user.id });
    if (projectCommentsError) {
        return res.status(500).json({ error: projectCommentsError.message });
    }

    const { error: projectRequestsError } = await supabase.from("project_requests").delete().match({ user: cookie.user.id });
    if (projectRequestsError) {
        return res.status(500).json({ error: projectRequestsError.message });
    }

    const { error: notificationsError } = await supabase.from("notifications").delete().match({ user: cookie.user.id });
    if (notificationsError) {
        return res.status(500).json({ error: notificationsError.message });
    }

    const { error: tableErr } = await supabase.from("users").delete().match({ id: cookie.user.id });
    if (tableErr) {
        return res.status(500).json({ error: tableErr.message });
    }

    const { error } = await supabaseAdmin.auth.api.deleteUser(cookie.user.id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({
        data: `Your account has been deleted.`,
    });
});

export default apiRoute;