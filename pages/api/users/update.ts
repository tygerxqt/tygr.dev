import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabase from "../../../lib/SupabaseClient"
import cookieParser from "cookie-parser";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).send({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).send({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.use(cookieParser());

apiRoute.put(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body.tag) return res.status(500).send({ error: "Tag is required." });
    if (req.body.tag.length !== 4) return res.status(500).send({ error: "Tag must be exactly 4 characters." });
    if (req.body.tag === "0000") return res.status(500).send({ error: "Tag cannot be 0000." });
    if (!/^[0-9]+$/.test(req.body.tag)) return res.status(500).send({ error: "Tag must be numbers." });

    if (!req.body.username) return res.status(500).send({ error: "Username is required." });
    if (req.body.username.length <= 0) return res.status(500).send({ error: "Username cannot be empty." });

    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { data: userData, error: userError } = await supabase.from("users").select("username, tag");
    if (userError) {
        return res.status(500).send({ error: userError });
    }

    // check if the username and tag already exists
    const user = userData.find(user => user.username === req.body.username && user.tag === req.body.tag);
    if (user) {
        if (!user.username === cookie.user.user_metadata.username && user.tag === cookie.user.user_metadata.tag) {
            return res.status(500).send({ error: "Username and tag already exists." });
        }
    }

    const { error } = await supabase.from("users").update({ tag: req.body.tag, username: req.body.username }).eq("id", cookie.user.id);
    if (error) {
        return res.status(500).send({ error: `Failed to update table. ${error.message}` });
    }

    const { error: metadataError } = await supabase.auth.update({
        data: {
            username: req.body.username,
            tag: req.body.tag,
        }
    });
    if (metadataError) {
        return res.status(500).send({ error: `Failed to update metadata. ${metadataError.message}` });
    }

    res.status(200).send({
        data: `Successfully updated to ${req.body.username}#${req.body.tag}.`,
    });
});

export default apiRoute;