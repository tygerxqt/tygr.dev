import { User } from "@supabase/supabase-js";
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

apiRoute.use(cookieParser()).get(async (req: NextApiRequest, res: NextApiResponse) => {
    let user = {} as User;
    let token = "" as string;

    if (req.query.token) {
        token = req.query.token as string;
        await supabase.auth.api.getUser(token).then((userData) => {
            user = userData.user;
        }).catch(err => {
            return res.status(502).json({ error: err });
        });

        supabase.auth.setAuth(token);
    } else {
        const cookie = await supabase.auth.api.getUser(req.cookies["sb-access-token"]);
        if (!cookie || cookie.error) {
            return res.status(500).json({
                error: "Unauthorized.",
            });
        }

        user = cookie.user;
        token = req.cookies["sb-access-token"];
        supabase.auth.setAuth(req.cookies["sb-access-token"]);
    }

    const { data: discordData, error: discordError } = await supabase.from("users").select("discord").eq("id", user.id);
    if (discordError) {
        res.status(500).json({ error: discordError.message });
        throw discordError;
    }

    const discord = discordData[0].discord;

    const { data: githubData, error: githubError } = await supabase.from("users").select("github").eq("id", user.id);
    if (githubError) {
        res.status(500).json({ error: githubError.message });
        throw githubError;
    }
    const github = githubData[0].github;

    const { data: badgesData, error: badgesError } = await supabase.from("users").select("badges").eq("id", user.id);
    if (badgesError) {
        res.status(500).json({ error: badgesError.message });
        throw badgesError;
    }
    const badges = badgesData[0].badges;

    const { data: avatarData, error: avatarError } = await supabase.from("users").select("avatar").eq("id", user.id);
    if (avatarError) {
        res.status(500).json({ error: avatarError.message });
        throw avatarError;
    }
    const avatar = avatarData[0].avatar;

    const { data: bannerData, error: bannerError } = await supabase.from("users").select("banner").eq("id", user.id);
    if (bannerError) {
        res.status(500).json({ error: bannerError.message });
        throw bannerError;
    }
    const banner = bannerData[0].banner;

    const { data: tagData, error: tagError } = await supabase.from("users").select("tag").eq("id", user.id);
    if (tagError) {
        res.status(500).json({ error: tagError.message });
        throw tagError;
    }
    const tag = tagData[0].tag;

    const { data: cutieData, error: cutieError } = await supabase.from("users").select("cutie").eq("id", user.id);
    if (cutieError) {
        res.status(500).json({ error: cutieError.message });
        throw cutieError;
    }
    const cutie = cutieData[0].cutie;

    const { data: pixelData, error: pixelError } = await supabase.from("users").select("pixel").eq("id", user.id);
    if (pixelError) {
        res.status(500).json({ error: pixelError.message });
        throw pixelError;
    }
    const pixel = pixelData[0].pixel;

    const { data: notificationsData, error: notificationsError } = await supabase.from("notifications").select("*").eq("user", user.id);
    if (notificationsError) {
        res.status(500).json({ error: notificationsError.message });
        throw notificationsError;
    }
    const notifications = notificationsData;

    res.status(200).json({ user, discord, github, badges, tag, avatar, banner, cutie, pixel, notifications });
});

export default apiRoute;