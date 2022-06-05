import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../../lib/Stripe";
import supabaseAdmin from "../../../../lib/SupabaseAdminClient";
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
    if (!req.body) return res.status(500).json({ error: "No body provided." });
    if (!req.query.token) return res.status(500).json({ error: "Token is required." });
    if (!req.body.name) return res.status(500).json({ error: "Name is required." });
    if (!req.body.email) return res.status(500).json({ error: "Email is required." });

    const user = await supabase.auth.api.getUser(req.query.token as string);
    if (!user) {
        return res.status(500).json({ error: "Unauthorized." });
    }

    const { error: fetchError, data } = await supabaseAdmin.from("users").select("customer").eq("id", user.user.id);
    if (fetchError) {
        return res.status(500).json({ error: fetchError.message });
    }

    if (data[0].customer.id) return res.status(500).json({ error: "Customer already exists." });

    const customer = await stripe.customers.create({
        name: req.body.name,
        email: req.body.email,
    });

    const { error: setError } = await supabaseAdmin.from("users").update({ customer: { id: customer.id, name: customer.name, email: customer.email } }).eq("id", user.user.id);
    if (setError) {
        return res.status(500).json({ error: setError.message });
    }

    res.send({ data: customer.id });
});

export default apiRoute;