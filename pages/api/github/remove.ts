import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
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

});

export default apiRoute;