import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../../lib/Stripe";
import supabaseAdmin from "../../../../lib/SupabaseAdminClient";

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
    if (!req.query.token) return res.status(500).json({ error: "Token is required." });

    const user = await supabaseAdmin.auth.api.getUser(req.query.token as string);
    if (!user) {
        return res.status(500).json({ error: "Unauthorized." });
    }

    const { error, data } = await supabaseAdmin.from("users").select("customer").eq("id", user.user.id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data || !data[0] || !data[0].customer || !data[0].customer.id) {
        return res.status(200).json({ error: "No customer exists." });
    }

    const customer = await stripe.customers.del(data[0].customer.id);

    res.send({ data: customer });
});

export default apiRoute;