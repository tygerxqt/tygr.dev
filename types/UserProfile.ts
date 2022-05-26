import { DiscordUser } from "./DiscordUser";
import { GithubUser } from "./GithubUser";

interface Badges {
    admin: boolean;
    beta: boolean;
    bug: boolean;
    contributor: boolean;
    donator: boolean;
    pixel: boolean;
}

export interface UserProfile {
    avatar: string;
    badges: Badges;
    banner: string;
    discord: DiscordUser;
    github: GithubUser;
    email: string;
    id: string;
    cutie: boolean;
    phone: string;
    user_metadata: {
        username: string;
        full_name: string;
    }
}