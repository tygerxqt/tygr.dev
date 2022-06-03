import { Center, Heading, Stack, Flex, Spinner, Text, Divider } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import useMediaQuery from "../../hook/useMediaQuery";
import supabase from "../../lib/SupabaseClient";
import { UserProfile } from "../../types/UserProfile";
import Container from "../UI/Container";
import Navbar from "../UI/Navbar";
import Removal from "./Account/Removal";
import Billing from "./Account/Billing";
import Identities from "./Account/Identities";

function Account() {
  const [userData, setUserData] = useState<UserProfile>({} as UserProfile);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    const user = supabase.auth.user();
    const session = supabase.auth.session();

    async function fetch() {
      const data = await axios.get(`/api/users/${user.id}?token=${session.access_token}`);
      setUserData(data.data as UserProfile);
      setLoading(false);
      setUpdate(false);
    }

    fetch();
  }, [update]);

  const isLargerThan768 = useMediaQuery(768);
  return (
    <>
      <Navbar enableTransition={false} />
      {loading ? (
        <Flex
          as="main"
          justifyContent="center"
          px={isLargerThan768 ? "15vw" : "8vw"}
          py={isLargerThan768 ? "4vw" : "8vw"}
        >
          <Center>
            <Stack
              spacing={10}
              justifyContent="center"
              my={["20vh", "20vh", "30vh", "30vh"]}
            >
              <Center>
                <Spinner size={"xl"} />
              </Center>
              <Center>
                <Text fontSize="xl" fontWeight="bold">
                  Fetching user data...
                </Text>
              </Center>
            </Stack>
          </Center>
        </Flex>
      ) : (
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
              <Billing userData={userData} />
              <Removal />
            </Stack>
          </Container>
        </>
      )
      }
    </>
  );
}

export default Account;
