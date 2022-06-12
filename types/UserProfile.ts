import { User } from "@supabase/supabase-js";
import { DiscordUser } from "./DiscordUser";
import { GithubUser } from "./GithubUser";

interface Badges {
    admin: boolean;
    beta: boolean;
    bug: boolean;
    contributor: boolean;
    donator: boolean;
}

export interface UserProfile {
    user: User;
    avatar: string;
    badges: Badges;
    banner: string;
    discord: DiscordUser;
    github: GithubUser;
    email: string;
    id: string;
    cutie: boolean;
    pixel: boolean;
    phone: string;
    notifications: Array<{
        id: string;
        created_at: string;
        user: string;
        author: string;
        message: string;
    }>
    user_metadata: {
        username: string;
        full_name: string;
        tag: string;
    }
}