import { Deta } from "deta";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const deta = Deta(process.env.DETA_PROJECT_KEY);
    const drive = deta.Drive("banners");
    const id = req.query.id as string;
    const data = await drive.get(id);
    const buffer = await data?.arrayBuffer();
    if (buffer) {
        var img = Buffer.from(buffer)
        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": img.length
        });
        res.end(img);
    } else {
        res.status(404).send("Not found");
    }
}