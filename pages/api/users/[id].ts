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

    const { data: discordData, error: discordError } = await supabaseAdmin.from("users").select("discord").eq("id", user.id);
    if (discordError) {
        res.status(502).json({ error: discordError });
        throw discordError;
    }

    const discord = discordData[0].discord;

    const { data: githubData, error: githubError } = await supabaseAdmin.from("users").select("github").eq("id", user.id);
    if (githubError) {
        res.status(502).json({ error: githubError });
        throw githubError;
    }
    const github = githubData[0].github;

    const { data: badgesData, error: badgesError } = await supabaseAdmin.from("users").select("badges").eq("id", user.id);
    if (badgesError) {
        res.status(502).json({ error: badgesError });
        throw badgesError;
    }
    const badges = badgesData[0].badges;

    const { data: avatarData, error: avatarError } = await supabaseAdmin.from("users").select("avatar").eq("id", user.id);
    if (avatarError) {
        res.status(502).json({ error: avatarError });
        throw avatarError;
    }
    const avatar = avatarData[0].avatar;

    const { data: bannerData, error: bannerError } = await supabaseAdmin.from("users").select("banner").eq("id", user.id);
    if (bannerError) {
        res.status(502).json({ error: bannerError });
        throw bannerError;
    }
    const banner = bannerData[0].banner;

    const { data: cutieData, error: cutieError } = await supabaseAdmin.from("users").select("cutie").eq("id", user.id);
    if (cutieError) {
        res.status(502).json({ error: cutieError });
        throw cutieError;
    }
    const cutie = cutieData[0].cutie;

    res.status(200).json({ ...user, discord, github, badges, avatar, banner, cutie });
});

export default apiRoute;