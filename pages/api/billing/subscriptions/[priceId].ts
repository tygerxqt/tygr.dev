import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../../lib/Stripe";
import supabase from "../../../../lib/SupabaseClient";
import cookieParser from "cookie-parser";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.use(cookieParser());

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query) return res.status(500).json({ error: "No query provided." });

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

    if (!data || !data[0] || !data[0].customer.id) {
        return res.status(500).json({ error: "No customer found." });
    }

    const { priceId } = req.query;

    const lineItems = [{
        price: priceId as string,
        quantity: 1,
    }];

    const session = await stripe.checkout.sessions.create({
        customer: data[0].customer.id as string,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: `${process.env.NEXT_PUBLIC_URL}/pixels/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/pixels/cancel`,
    });

    res.send({ data: session.id });
});

export default apiRoute;