import { ButtonGroup, Button, VisuallyHidden } from "@chakra-ui/react"
import Link from "next/link"
import { FaDiscord, FaGithub } from "react-icons/fa"

const AuthButtons = () => {
    return (
        <>
            <ButtonGroup variant={"outline"} spacing={4} width={"full"}>
                <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL + "/api/auth/login/discord"}&response_type=code&scope=identify%20email`} passHref>
                    <Button key={"Discord"} isFullWidth>
                        <VisuallyHidden>Sign in with Discord</VisuallyHidden>
                        <FaDiscord size={"22px"} />
                    </Button>
                </Link>
                <Link href={``} passHref>
                    <Button key={"Github"} isFullWidth>
                        <VisuallyHidden>Sign in with Github</VisuallyHidden>
                        <FaGithub size={"22px"} />
                    </Button>
                </Link>
            </ButtonGroup>
        </>
    )
}

export default AuthButtons;