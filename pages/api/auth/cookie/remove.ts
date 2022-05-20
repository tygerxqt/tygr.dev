import supabase from "../../../../lib/SupabaseClient"

const handler = async (req, res) => {
    await supabase.auth.api.deleteAuthCookie(req, res, { redirectTo: "/" });
};

export default handler;