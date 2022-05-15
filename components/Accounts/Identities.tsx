import { Stack, Button } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import supabase from "../../lib/SupabaseClient";

function Identities() {
    const user = supabase.auth.user();
    const session = supabase.auth.session();

    const [data, setData] = useState<any>({});
    useEffect(() => {
        async function getData() {
            const data = await axios.get(`/api/users/${user.id}?token=${session.access_token}`);
            setData(data.data);
        }

        getData();
    }, [session, user]);
    return (
        <>
            <Stack spacing={5}>
                <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL + "/api/auth/link/discord"}&response_type=code&scope=identify%20email`} passHref>
                    <Button leftIcon={<FaDiscord />} colorScheme='blue' variant='solid'>
                        {data ? `Linked to ${data.discord[0].discord.username}#${data.discord[0].discord.discriminator}` : "Link Discord"}
                    </Button>
                </Link>
                <Link href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user%20read:email&allow_signup=false`} passHref>
                    <Button leftIcon={<FaGithub />} variant='solid'>
                        Link Github
                    </Button>
                </Link>
            </Stack>
        </>
    )
}

export default Identities;