import Head from 'next/head'
import { Heading, Stack, Divider, Button, Box } from '@chakra-ui/react'
import Navbar from '../components/UI/Navbar'

export default function ErrorPage() {
    return (
        <>
            <Navbar enableTransition={false} />
            <Head>
                <title>404</title>
                <meta name="title" content="tygerxqt" />
            </Head>
            <Stack
                as="main"
                spacing={8}
                justifyContent="center"
                alignItems="center"
                px={{ base: '10vw', md: '10vw' }}
                mt={{ base: '15vh', md: '22.5vh' }}
            >
                <Stack alignItems="center">
                    <Heading fontSize="display">
                        404
                    </Heading>
                    <Heading fontSize={{ base: "md", sm: "xl", md: "2xl", lg: "4xl" }}>
                        The requested page doesn&apos;t exist or you don&apos;t have access to it.
                    </Heading>
                </Stack>
                <Divider />
                <Stack isInline alignItems="center" spacing={8}>
                    <Box>
                        <Button
                            as="a"
                            href="/"
                            variant="outline"
                            fontSize="16px"
                        >
                            Home
                        </Button>
                        <Button
                            as="a"
                            href="/projects"
                            variant="outline"
                            fontSize="16px"
                        >
                            Projects
                        </Button>
                        <Button
                            as="a"
                            href="/blog"
                            variant="outline"
                            fontSize="16px"
                        >
                            Blog
                        </Button>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}