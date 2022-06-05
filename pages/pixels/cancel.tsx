import { Divider, Heading, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import Container from "../../components/UI/Container";
export default function Cancelled() {
    useEffect(() => {
        setTimeout(() => {
            window.location.href = "/pixels";
        }, 5000);
    }, [])

    return (
        <>
            <Container enableTransition={false}>
                <Head>
                    <title>Cancelled</title>
                </Head>
                <Stack spacing={10} justifyContent="center" my={["10vh", "10vh", "15vh", "15vh"]}>
                    <Stack spacing={5}>
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>Cancelled</Heading>
                        <Divider />
                    </Stack>
                    <Text fontSize={{ base: "md", md: "lg" }}>
                        Your payment was cancelled. You was not charged. You will be redirecting in a few seconds.
                    </Text>
                </Stack>
            </Container>
        </>
    )
}