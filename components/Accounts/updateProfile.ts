import supabase from "./SupabaseClient";

export default async function updateProfile(username, avatar_url) {
    const user = await supabase.auth.user();

    try {
        const updates = {
            id: user.id,
            avatar_url: avatar_url,
            updated_at: new Date(),
        }

        let { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            console.log(error);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}