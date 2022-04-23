import { Deta } from "deta";
import supabase from "./SupabaseClient";

export async function updateAvatar(event, user) {
    try {
        if (!event.target.files || event.target.files.length === 0) {
            throw new Error('You must select an image to upload.')
        }

        let image = event.target.files[0];
        let ext = image.name.split('.').pop();
        const buffer = await image.arrayBuffer();
        let byteArray = new Uint8Array(buffer);

        const deta = Deta(process.env.DETA_PROJECT_KEY);
        const drive = deta.Drive("avatars");
        if ((await drive.list()).names.filter(name => name.includes(user.user_metadata.username)).length > 0) {
            await drive.delete(await user.user_metadata.avatar.replace(/^https?:\/\/[^\/]+\/api\/avatars\//, ''));
        }
        const type = event.target.files[0].type;
        await drive.put(`${user.id}.${ext}`, { data: byteArray, contentType: type });

        await supabase.auth.update({
            data: {
                avatar: `https://tygr.dev/api/avatars/${user.id}.${ext}`,
            },
        });

        return true;
    } catch (err) {
        throw err;
    }
}