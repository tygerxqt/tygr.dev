import { Button, Center, Heading, Stack, Flex, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import useMediaQuery from "../../hook/useMediaQuery";
import supabase from "../../lib/SupabaseClient";
import { UserProfile } from "../../types/UserProfile";
import Navbar from "../UI/Navbar";

function Account() {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [userData, setUserData] = useState<UserProfile>({} as UserProfile);

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
          {userData.badges.admin ? (
            <Flex
              as="main"
              justifyContent="center"
              px={isLargerThan768 ? "15vw" : "8vw"}
              py={isLargerThan768 ? "4vw" : "8vw"}
            >
              <Head>
                <title>Account</title>
              </Head>
              <Center>
                <Stack
                  spacing={10}
                  justifyContent="center"
                  my={["20vh", "20vh", "30vh", "30vh"]}
                >
                  <Stack spacing={10}>
                    {" "}
                    <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                      Your profile has moved!
                    </Heading>
                    <Center>
                      <Link href="/profile" passHref>
                        <Button w="md" variant={"solid"} colorScheme={"blue"}>
                          Profile
                        </Button>
                      </Link>
                    </Center>
                  </Stack>
                </Stack>
              </Center>
            </Flex>
          ) : (
            <>
              <Navbar enableTransition={false} />
              <Flex
                as="main"
                justifyContent="center"
                px={isLargerThan768 ? "15vw" : "8vw"}
                py={isLargerThan768 ? "4vw" : "8vw"}
              >
                <Head>
                  <title>Account</title>
                </Head>
                <Center>
                  <Stack
                    spacing={10}
                    justifyContent="center"
                    my={["20vh", "20vh", "30vh", "30vh"]}
                  >
                    <Stack spacing={10}>
                      {" "}
                      <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                        Pixel accounts are closed for now.
                      </Heading>
                      <Center>
                        <Link href="https://github.com/tygerxqt/tygr.dev/issues/12" passHref>
                          <Button w="md" variant={"solid"} colorScheme={"blue"}>
                            Track progress
                          </Button>
                        </Link>
                      </Center>
                    </Stack>
                  </Stack>
                </Center>
              </Flex>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Account;
