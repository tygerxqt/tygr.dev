import Head from 'next/head'
import { Heading, Stack, Text, Center, Flex } from '@chakra-ui/react'
import Container from '../components/Container'

export default function IndexPage() {
    return (
        <>
            <Container enableTransition={true}>
                <Head>
                    <title>404</title>
                    <meta name="title" content="tygerxqt" />
                </Head>
                <Stack
                    as="main"
                    spacing="144px"
                    justifyContent="center"
                    alignItems="center"
                    px={{ base: '5vw', md: '10vw' }}
                    mt={{ base: '15vh', md: '22.5vh' }}
                >
                    <Stack alignItems="center">
                        <Heading fontSize="display">
                            404
                        </Heading>
                        <Heading fontSize={'4xl'}>
                            The requested page doesn&apos;t exist or you don&apos;t have access to it.
                        </Heading>
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}