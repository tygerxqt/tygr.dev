import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../../lib/Stripe";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const customer = await stripe.customers.del(req.query.id as string);

    res.send({ data: `Deleted stripe customer: ${customer.id}` });
});

export default apiRoute;