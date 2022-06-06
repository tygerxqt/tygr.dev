import Head from "next/head";
import { Heading, Stack, Divider, Button, Box, Flex, Center } from "@chakra-ui/react";
import Navbar from "../components/UI/Navbar";
import Container from "../components/UI/Container";

export default function ErrorPage() {
  return (
    <>
      <Container enableTransition={false}>
        <Head>
          <title>404</title>
          <meta name="title" content="404" />
          <meta
            name="description"
            content="This page doesn't exist or is currently unavailable. That's all we know."
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://tygr.dev/404" />
          <meta property="og:title" content="tygerxqt." />
          <meta
            property="og:description"
            content="This page doesn't exist or is currently unavailable. That's all we know."
          />
          <meta property="og:image" content="https://i.imgur.com/GBBjRYu.png" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://tygr.dev/404" />
          <meta property="twitter:title" content="tygerxqt" />
          <meta
            property="twitter:description"
            content="This page doesn't exist or is currently unavailable. That's all we know."
          />
          <meta
            property="twitter:image"
            content="https://i.imgur.com/GBBjRYu.png"
          />
        </Head>
        <Stack
          as="main"
          justifyContent="center"
          alignItems="center"
          px={{ base: "10vw", md: "10vw" }}
          mt={{ base: "15vh", md: "22.5vh" }}
        >
          <Stack alignItems="center" mb={"27vh"}>
            <Heading fontSize="display">404</Heading>
            <Heading fontSize={{ base: "md", md: "2xl", lg: "4xl" }} textAlign={"center"}>
              The requested page doesn&apos;t exist or you don&apos;t have access
              to it.
            </Heading>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
