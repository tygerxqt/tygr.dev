import { DiscordUser } from "../Identites/DiscordUser";
import { GithubUser } from "../Identites/GithubUser";

export default interface UserData {
    id: string
    full_name: string;
    username: string;
    avatar: string;
    discord: DiscordUser;
    github: GithubUser;
    setup: boolean;
    badges: {
        bug: boolean;
        beta: boolean;
        admin: boolean;
        donator: boolean;
        contributor: boolean;
    };
    banner: string;
    cutie: boolean;
    tag: string;
    customer: {
        id: string;
        name: string;
        email: string;
    },
    pixel: boolean;
    notifications: Array<{
        id: string;
        created_at: string;
        user: string;
        author: string;
        message: string;
        redirect: string;
    }>;
}