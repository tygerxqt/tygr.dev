import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../../lib/Stripe";
import supabase from "../../../../lib/SupabaseClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.put(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body) return res.status(500).json({ error: "No body provided." });
    if (!req.body.name) return res.status(500).json({ error: "Name is required." });
    if (!req.body.email) return res.status(500).json({ error: "Email is required." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { error: fetchError, data } = await supabase.from("users").select("customer").eq("id", cookie.user.id);
    if (fetchError) {
        return res.status(500).json({ error: fetchError.message });
    }

    if (!data[0]) {
        if (!data[0].customer) {
            return res.status(200).json({ error: "Customer doesn't exist." });
        }
    }

    const customer = await stripe.customers.update(data[0].customer.id, {
        name: req.body.name,
        email: req.body.email,
    });

    const { error: setError } = await supabase.from("users").update({ customer: { id: customer.id, name: customer.name, email: customer.email } }).eq("id", cookie.user.id);
    if (setError) {
        return res.status(500).json({ error: setError.message });
    }

    res.send({ data: customer.id });
});

export default apiRoute;