import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../../lib/Stripe";
import supabaseAdmin from "../../../../lib/SupabaseAdminClient";
import supabase from "../../../../lib/SupabaseClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ message: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ message: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body) return res.status(502).json({ message: "No body provided." });
    if (!req.body.token) return res.status(502).json({ message: "Token is required." });
    if (!req.body.name) return res.status(502).json({ message: "Name is required." });
    if (!req.body.email) return res.status(502).json({ message: "Email is required." });

    const user = await supabase.auth.api.getUser(req.body.token as string);
    if (!user) {
        return res.status(502).json({ error: "Unauthorized." });
    }

    const { error: fetchError, data } = await supabaseAdmin.from("users").select("customer").eq("id", user.user.id);
    if (fetchError) {
        return res.status(502).json({ message: fetchError.message });
    }

    if (data[0].customer) return res.status(200).json({ message: "Customer already exists." });

    const customer = await stripe.customers.create({
        name: req.body.name,
        email: req.body.email,
    });

    const { error: setError } = await supabaseAdmin.from("users").update({ customer: customer.id }).eq("id", user.user.id);
    if (setError) {
        return res.status(502).json({ message: setError.message });
    }

    res.send({ data: customer.id });
});

export default apiRoute;