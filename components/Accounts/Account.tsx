import { Heading, Stack, Divider } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import Container from "../UI/Container";
import Removal from "./Account/Removal";
import Billing from "./Account/Billing";
import Identities from "./Account/Identities";

function Account() {
  return (
    <>
      <Container enableTransition={false}>
        <Head>
          <title>Account</title>
        </Head>
        <Stack spacing={16} justifyContent="center" my={["10vh", "10vh", "15vh", "15vh"]}>
          <Stack spacing={5}>
            <Heading fontSize={{ base: "4xl", md: "6xl" }}>Account</Heading>
            <Divider />
          </Stack>
          <Identities />
          <Billing />
          <Removal />
        </Stack>
      </Container>
    </>
  );
}

export default Account;