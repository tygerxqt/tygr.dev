import Head from "next/head";
import { Heading, Stack, Divider, Button, Box, Flex } from "@chakra-ui/react";
import Navbar from "../components/UI/Navbar";

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
        px={{ base: "10vw", md: "10vw" }}
        mt={{ base: "15vh", md: "22.5vh" }}
      >
        <Stack alignItems="center">
          <Heading fontSize="display">404</Heading>
          <Heading fontSize={{ base: "md", md: "2xl", lg: "4xl" }}>
            The requested page doesn&apos;t exist or you don&apos;t have access
            to it.
          </Heading>
        </Stack>
      </Stack>
    </>
  );
}
