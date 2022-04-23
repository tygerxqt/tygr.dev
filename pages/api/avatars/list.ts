import { Deta } from "deta";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const deta = Deta(process.env.DETA_PROJECT_KEY);
    const drive = deta.Drive("avatars");
    res.status(200).json(await drive.list());
}