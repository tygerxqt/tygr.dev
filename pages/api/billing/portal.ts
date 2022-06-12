import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../lib/Stripe";
import supabase from "../../../lib/SupabaseClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query) return res.status(500).json({ error: "No query provided." });
    if (!req.query.redirect) return res.status(500).json({ error: "Redirect is required." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { data, error } = await supabase.from("users").select("customer").eq("id", cookie.user.id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data[0]) {
        if (!data[0].customer.id) {
            return res.status(500).json({ error: "No customer found." });
        }
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: data[0].customer.id,
        return_url: `${process.env.NEXT_PUBLIC_URL}/${req.query.redirect}`,
    });

    res.send({ data: session.url });
});

export default apiRoute;