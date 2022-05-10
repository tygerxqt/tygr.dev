import { Stack, Button } from "@chakra-ui/react";
import Link from "next/link";
import { FaDiscord, FaGithub, FaSpotify } from "react-icons/fa";

export default function Identities() {
    return (
        <>
            <Stack spacing={5}>
                <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL + "/api/link/discord"}&response_type=code&scope=identify`} passHref>
                    <Button leftIcon={<FaDiscord />} colorScheme='blue' variant='solid'>
                        Link Discord
                    </Button>
                </Link>
                <Button leftIcon={<FaGithub />} variant='solid' disabled>
                    Link Github
                </Button>
                <Button leftIcon={<FaSpotify />} colorScheme='green' variant='solid' disabled>
                    Link Spotify
                </Button>
            </Stack>
        </>
    )
}