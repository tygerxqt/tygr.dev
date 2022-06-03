import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../../lib/Stripe";
import supabaseAdmin from "../../../../lib/SupabaseAdminClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ message: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ message: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query) return res.status(502).json({ message: "No query provided." });
    if (!req.query.token) return res.status(502).json({ message: "Token is required." });

    const user = await supabaseAdmin.auth.api.getUser(req.query.token as string);
    if (!user) {
        return res.status(502).json({ message: "Unauthorized." });
    }

    const { error, data } = await supabaseAdmin.from("users").select("customer").eq("id", user.user.id);
    if (error) {
        return res.status(502).json({ message: error.message });
    }

    if (!data[0]) {
        return res.status(200).json({ data: null });
    }

    const customer = await stripe.customers.retrieve(data[0].customer);

    res.send({ data: customer });
});

export default apiRoute;