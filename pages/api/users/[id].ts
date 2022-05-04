import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../../lib/SupabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "GET") {
        res.status(405).json({ error: "Method not allowed!" });
    }

    if (!req.query.token || req.query.token === null) {
        res.status(502).json({ error: "Missing User Token." });
    }

    const { user } = await supabase.auth.api.getUser(req.query.token as string);

    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase.from("users").select("*").eq("id", req.query.id);
    if (error) {
        res.status(502).json({ error: error });
        throw error;
    }

    res.status(200).json({ user });
}