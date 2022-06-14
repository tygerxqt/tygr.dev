import { Divider, Heading, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import Container from "../../components/UI/Container";
export default function Cancelled() {
    useEffect(() => {
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 5000);
    }, [])

    return (
        <>
            <Head>
                <title>Success</title>
            </Head>
            <Stack
                as="main"
                justifyContent="center"
                alignItems="center"
                px={{ base: "10vw", md: "10vw" }}
                mt={{ base: "15vh", md: "22.5vh" }}
            >
                <Stack alignItems="center" mb={"27vh"}>
                    <Heading fontSize="display">Thank you!</Heading>
                    <Heading fontSize={{ base: "md", md: "2xl", lg: "4xl" }} textAlign={"center"}>
                        Your payment was successful! You will be redirected to the dashboard in a few seconds.
                    </Heading>
                </Stack>
            </Stack>
        </>
    )
}