import { Button, Center, Heading, Stack, Flex } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import useMediaQuery from "../../hook/useMediaQuery";
import Navbar from "../UI/Navbar";

function Account() {
  const isLargerThan768 = useMediaQuery(768);
  return (
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
    </>
  );
}

export default Account;
