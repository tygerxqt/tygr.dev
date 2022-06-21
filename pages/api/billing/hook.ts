import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import stripe from "../../../lib/Stripe";
import { buffer } from "micro";
import supabaseAdmin from "../../../lib/SupabaseAdminClient";
import cookieParser from "cookie-parser";
import { GithubUser } from "../../../types/Identites/GithubUser";
import { Octokit } from "@octokit/core";

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Method '${req.method}' Not allowed.` })
    },
});

apiRoute.use(cookieParser());

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    const signature = req.headers["stripe-signature"] as string;
    const signingSecret = process.env.STRIPE_SIGNING_SECRET;
    const reqBuffer = await buffer(req);

    let event;

    try {
        event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
    } catch (error) {
        console.log(error);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
        case "customer.subscription.updated": {
            await supabaseAdmin.from("users").update({
                pixel: true
            }).eq("customer->>id", event.data.object.customer);
        }
            break;

        case "customer.subscription.deleted": {
            await supabaseAdmin.from("users").update({
                pixel: false,
            }).eq("customer->>id", event.data.object.customer);

            const { data: githubData, error: githubErr } = await supabaseAdmin.from("users").select("github").eq("customer->>", event.data.object.customer);
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
        }
            break;

    }
    res.send({ data: true });
});

export const config = {
    api: {
        bodyParser: false,
    }
}

export default apiRoute;