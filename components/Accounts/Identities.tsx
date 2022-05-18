import { Stack, Button, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import supabase from "../../lib/SupabaseClient";
import React from "react";

function Identities() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    useEffect(() => {
        setLoading(true)
        fetch(`/api/users/${supabase.auth.user().id}?token=${supabase.auth.session().access_token}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
            }).finally(() => {
                setLoading(false)
            });
    }, [])

    return (
        <>
            <Stack spacing={5}>
                <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL + "/api/auth/link/discord"}&response_type=code&scope=identify%20email`} passHref>
                    <Button leftIcon={<FaDiscord />} colorScheme='blue' variant='solid' disabled={!loading}>
                        <Skeleton isLoaded={!loading}>
                            {data ? `Linked to ${data.discord[0].discord.username}#${data.discord[0].discord.discriminator}` : "Link Discord"}
                        </Skeleton>
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

export async function getServerSideProps({ req }) {
    const client = axios.create()
    const { user, token } = await supabase.auth.api.getUserByCookie(req);
    supabase.auth.setAuth(token);
    const { data } = await client.get(`${process.env.NEXT_PUBLIC_URL}/api/users/${user.id}?token=${token}`);

    return {
        props: {
            data
        },
    }
}

export default Identities;