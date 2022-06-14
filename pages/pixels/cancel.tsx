import { Heading, Stack } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
export default function Cancelled() {
    useEffect(() => {
        setTimeout(() => {
            window.location.href = "/pixels";
        }, 5000);
    }, [])

    return (
        <>
            <Head>
                <title>Declined</title>
            </Head>
            <Stack
                as="main"
                justifyContent="center"
                alignItems="center"
                px={{ base: "10vw", md: "10vw" }}
                mt={{ base: "15vh", md: "22.5vh" }}
            >
                <Stack alignItems="center" mb={"27vh"}>
                    <Heading fontSize="display">Oops!</Heading>
                    <Heading fontSize={{ base: "md", md: "2xl", lg: "4xl" }} textAlign={"center"}>
                        Your payment was canceled. You was not charged. You will be redirected in a few seconds.
                    </Heading>
                </Stack>
            </Stack>
        </>
    )
}