import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import cookieParser from "cookie-parser";
import { Octokit } from "@octokit/core";
import { GithubUser } from "../../../types/Identites/GithubUser";
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
    if (!cookie) {
        return res.status(500).json({
            error: "Unauthorized.",
        });
    }

    supabase.auth.setAuth(cookie.token);

    const { data: pixelData, error: pixelErr } = await supabase.from("users").select("pixel").eq("id", cookie.user.id);
    if (pixelErr) {
        res.status(500).json({ error: pixelErr.message });
        throw pixelErr;
    }
    const pixel = pixelData[0].pixel;

    if (!pixel) {
        res.status(500).json({ error: "You are not subscribed." });
    }

    const { data: githubData, error: githubErr } = await supabase.from("users").select("github").eq("id", cookie.user.id);
    if (githubErr) {
        res.status(500).json({ error: githubErr.message });
        throw githubErr;
    }

    const github: GithubUser = githubData[0].github;

    if (!github) {
        return;
    }
    const octokit = new Octokit({ auth: process.env.OCTOKIT_AUTH_KEY });

    const orgMembers = await octokit.request("GET /orgs/{org}/members", {
        org: "tygerware"
    });

    if (orgMembers.data.filter(member => member.login === github.username).length < 1) {
        return res.status(200).json({ data: true });
    }

    const orgInvites = await octokit.request("GET /orgs/{org}/invitations", {
        org: "tygerware"
    });

    if (orgInvites.data.filter(invite => invite.login === github.username).length >= 1) {
        await octokit.request(`DELETE /orgs/{org}/invitations/{invitation_id}`, {
            org: "tygerware",
            invitation_id: orgInvites.data.filter(invite => invite.login === github.username)[0].id
        });
        return res.status(200).json({ data: `An invite has already been sent to ${github.email}. Please check your emails.` });
    }

    await octokit.request(`DELETE /orgs/{org}/members/{username}`, {
        org: "tygerware",
        username: github.username
    });

    res.status(200).json({ data: true });
});

export default apiRoute;