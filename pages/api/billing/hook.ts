import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../lib/Stripe";
import { buffer } from "micro";
import supabaseAdmin from "../../../lib/SupabaseAdminClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    const signature = req.headers["stripe-signature"] as string;
    const signingSecret = process.env.STRIPE_SIGNING_SECRET;
    const reqBuffer = await buffer(req);

    let event;

    try {
        event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
    } catch (error) {
        console.log(error);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
        case "customer.subscription.updated":
            await supabaseAdmin.from("users").update({
                badges: {
                    pixel: true
                }
            }).eq("customer->>id", event.data.object.customer);
            break;

        case "customer.subscription.deleted":
            await supabaseAdmin.from("users").update({
                badges: {
                    pixel: false
                }
            }).eq("customer->>id", event.data.object.customer);
            break;

    }

    console.log({ event });
    res.send({ data: true });
});

export const config = {
    api: {
        bodyParser: false,
    }
}

export default apiRoute;