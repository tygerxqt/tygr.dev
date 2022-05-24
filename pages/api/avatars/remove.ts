import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { Deta } from "deta";
import supabase from "../../../lib/SupabaseClient";
import cookieParser from "cookie-parser";

const apiRoute = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(cookieParser());

apiRoute.put(async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query || !req.query.id)
    return res.status(500).json({
      error: "You need to provide the User ID.",
    });

  if (!req.query || !req.query.token)
    return res.status(500).json({
      error: "You need to provide the User Token.",
    });

  try {
    const { user } = await supabase.auth.api.getUser(req.query.token as string);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deta = Deta(process.env.DETA_PROJECT_KEY);
    const drive = deta.Drive("avatars");
    const list = await (await drive.list()).names;
    console.log(user.id)
    console.log(list)
    console.log(list.filter((name) => name.startsWith(user.id)));
    if (!list || list.length < 1) {
      return res.status(200).json({ error: "You don't have an avatar set." });
    }

    const files = list.filter((name) => name.includes(user.id));
    if (!files || files.length < 1) {
      return res.status(200).json({ error: "You don't have an avatar set." });
    }

    files.forEach(async (file) => {
      await drive.delete(file);
    });
    const { error: dbError } = await supabase.from("users").update({ avatar: `${process.env.NEXT_PUBLIC_URL}/api/avatars/default.jpg` }).eq("id", user.id);
    if (dbError) return res.status(500).json({ error: dbError });

    const { error: metadataError } = await supabase.auth.update({
      data: {
        avatar: `${process.env.NEXT_PUBLIC_URL}/api/avatars/default.jpg`,
      }
    });
    if (metadataError) return res.status(500).json({ error: metadataError });

    res.status(200).json({ data: true });
  } catch (err) {
    res.status(502).json({ error: err });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export default apiRoute;
