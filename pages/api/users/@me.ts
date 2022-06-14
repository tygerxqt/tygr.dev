import cookieParser from "cookie-parser";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import supabase from "../../../lib/SupabaseClient";

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
    const cookie = await supabase.auth.api.getUserByCookie(req);
    if (!cookie || cookie.error) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const user = cookie.user;
    try {
        const { data: discordData, error: discordError } = await supabase.from("users").select("discord").eq("id", cookie.user.id);
        if (discordError) {
            res.status(500).json({ error: discordError.message });
            throw discordError;
        }

        const discord = discordData[0].discord;

        const { data: githubData, error: githubError } = await supabase.from("users").select("github").eq("id", cookie.user.id);
        if (githubError) {
            res.status(500).json({ error: githubError.message });
            throw githubError;
        }
        const github = githubData[0].github;

        const { data: badgesData, error: badgesError } = await supabase.from("users").select("badges").eq("id", cookie.user.id);
        if (badgesError) {
            res.status(500).json({ error: badgesError.message });
            throw badgesError;
        }
        const badges = badgesData[0].badges;

        const { data: avatarData, error: avatarError } = await supabase.from("users").select("avatar").eq("id", cookie.user.id);
        if (avatarError) {
            res.status(500).json({ error: avatarError.message });
            throw avatarError;
        }
        const avatar = avatarData[0].avatar;

        const { data: bannerData, error: bannerError } = await supabase.from("users").select("banner").eq("id", cookie.user.id);
        if (bannerError) {
            res.status(500).json({ error: bannerError.message });
            throw bannerError;
        }
        const banner = bannerData[0].banner;

        const { data: tagData, error: tagError } = await supabase.from("users").select("tag").eq("id", cookie.user.id);
        if (tagError) {
            res.status(500).json({ error: tagError.message });
            throw tagError;
        }
        const tag = tagData[0].tag;

        const { data: cutieData, error: cutieError } = await supabase.from("users").select("cutie").eq("id", cookie.user.id);
        if (cutieError) {
            res.status(500).json({ error: cutieError.message });
            throw cutieError;
        }
        const cutie = cutieData[0].cutie;

        const { data: pixelData, error: pixelError } = await supabase.from("users").select("pixel").eq("id", cookie.user.id);
        if (pixelError) {
            res.status(500).json({ error: pixelError.message });
            throw pixelError;
        }
        const pixel = pixelData[0].pixel;

        const { data: notificationsData, error: notificationsError } = await supabase.from("notifications").select("*").eq("user", cookie.user.id);
        if (notificationsError) {
            res.status(500).json({ error: notificationsError.message });
            throw notificationsError;
        }
        const notifications = notificationsData;

        res.status(200).json({ user, discord, github, badges, tag, avatar, banner, cutie, pixel, notifications });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default apiRoute;