import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabaseAdmin from "../../../lib/SupabaseAdminClient";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query || !req.query.token || req.query.token === null) return res.status(502).json({ error: "You need to provide a 'TOKEN' query." });

    const { user } = await supabaseAdmin.auth.api.getUser(req.query.token as string);

    if (!user) {
        res.status(502).json({
            error: "Unauthorized.",
        });
    }

    const { data: discord, error: discordError } = await supabaseAdmin.from("users").select("discord").eq("id", user.id);
    if (discordError) {
        res.status(502).json({ error: discordError });
        throw discordError;
    }

    const { data: github, error: githubError } = await supabaseAdmin.from("users").select("github").eq("id", user.id);
    if (githubError) {
        res.status(502).json({ error: githubError });
        throw githubError;
    }

    const { data: badges, error: badgesError } = await supabaseAdmin.from("users").select("badges").eq("id", user.id);
    if (badgesError) {
        res.status(502).json({ error: badgesError });
        throw badgesError;
    }

    res.status(200).json({ ...user, discord, github, badges });
});

export default apiRoute;