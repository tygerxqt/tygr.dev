import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import { ApiResponse } from "../../../types/ApiResponse";
import { Deta } from "deta";
import supabase from "../../../lib/SupabaseClient";
import cookieParser from "cookie-parser";
interface NextConnectApiRequest extends NextApiRequest {
  file: Express.Multer.File;
}
type ResponseData = ApiResponse<string[], string>;

const tenMegabyteInBytes = 10000000;

const upload = multer({
  limits: { fileSize: tenMegabyteInBytes },
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const acceptFile: boolean = ["image/jpeg", "image/png"].includes(
      file.mimetype
    );
    cb(null, acceptFile);
  },
});

const apiRoute = nextConnect({
  onError(error, req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("avatar"));
apiRoute.use(cookieParser());

apiRoute.post(async (req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) => {
  if (!req.file) {
    res.status(500).json({ error: "Invalid file type!" });
  }

  if (!req.query || !req.query.id)
    return res.status(500).json({
      error: "You need to provide the User ID.",
    });

  const cookie = await supabase.auth.api.getUserByCookie(req);
  if (!cookie) {
    return res.status(500).json({
      error: "Unauthorized.",
    });
  }

  supabase.auth.setAuth(cookie.token);

  let ext = req.file.originalname.split(".").pop();
  const buffer = req.file.buffer;
  let byteArray = new Uint8Array(buffer);

  const deta = Deta(process.env.DETA_PROJECT_KEY);
  const drive = deta.Drive("avatars");
  await drive.put(`${req.query.id}.${ext}`, { data: byteArray });

  res.status(200).json({ data: [`${req.query.id}.${ext}`] });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export default apiRoute;
