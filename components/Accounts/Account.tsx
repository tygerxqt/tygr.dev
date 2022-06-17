import { Heading, Stack, Divider, Button, ButtonGroup, Input, Spinner, Text, Avatar, Center, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Skeleton, toast, useDisclosure, VStack, useToast, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box } from "@chakra-ui/react";
import Link from "next/link";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Container from "../UI/Container";
import supabase from "../../lib/SupabaseClient";
import axios from "axios";
import router from "next/router";
import Stripe from "stripe";
import { UserProfile } from "../../types/Account/UserProfile";
import { FaDiscord, FaGithub } from "react-icons/fa";

function Account() {
  const user = supabase.auth.user();
  const session = supabase.auth.session();
  const toast = useToast();
  const [userData, setUserData] = React.useState<UserProfile>({} as UserProfile);
  const [loading, setLoading] = React.useState(true);
  const [update, setUpdate] = React.useState(false);

  // set server cookie
  async function setCookie() {
    await axios.post("/api/auth/cookie/set", {
      event: user ? "SIGNED_IN" : "SIGNED_OUT",
      session: supabase.auth.session(),
    });
  }

  setCookie();

  // === Customer ===
  const [customer, setCustomer] = useState({} as Stripe.Customer);
  const [newCustomerName, setNewCustomerName] = useState(user.user_metadata.full_name);
  const [newCustomerEmail, setNewCustomerEmail] = useState(user.email);

  async function createCustomer() {
    setLoading(true);
    await axios.post(`/api/billing/customers/create`, {
      email: newCustomerEmail,
      name: newCustomerName,
    }).then(response => {
      setCustomer(response.data as Stripe.Customer);
    }).catch(error => {
      throw new Error(error.response.data.error);
    }).finally(() => {
      setLoading(false);
    });
  }

  const loadPortal = async () => {
    const { data } = await axios.get(`/api/billing/portal?redirect=account`);
    router.push(data.data);
  }

  // === Identities ===
  const { isOpen: DiscordModalIsOpen, onOpen: DiscordModalOnOpen, onClose: DiscordModalOnClose } = useDisclosure();
  const [DiscordModalUISwitch, setDiscordModalUISwitch] = useState(true);
  const [DiscordUnlinkConfirm, setDiscordUnlinkConfirm] = useState(false);

  const { isOpen: GithubModalIsOpen, onOpen: GithubModalOnOpen, onClose: GithubModalOnClose } = useDisclosure();
  const [GithubModalUISwitch, setGithubModalUISwitch] = useState(true);
  const [GithubUnlinkConfirm, setGithubUnlinkConfirm] = useState(false);

  async function destroyDiscordLink() {
    setLoading(true);
    try {
      await axios.post(`/api/auth/unlink/discord`).then(res => {
        toast({
          title: "Success",
          description: "Discord account unlinked.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }).catch(err => {
        throw err.response.data.error;
      }).finally(() => {
        setLoading(false);
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occured. " + err,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  async function destroyGithubLink() {
    setLoading(true);
    try {
      await axios.post(`/api/auth/unlink/github`).then(res => {
        toast({
          title: "Success",
          description: "GitHub account unlinked.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }).catch(err => {
        throw err.response.data.error;
      }).finally(() => {
        setLoading(false);
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occured. " + err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  // === Removal ===
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const { isOpen: DeleteIsOpen, onOpen: DeleteOnOpen, onClose: DeleteOnClose } = useDisclosure();
  const cancelRef = React.useRef();

  async function deleteAccount() {
    try {
      await axios.post("/api/users/delete").then(response => {
        toast({
          title: "Account deleted",
          description: response.data.data,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        supabase.auth.signOut();
      }).catch(err => {
        throw new Error(err.response.data.error);
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.data,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    const session = supabase.auth.session();
    async function fetch() {
      await axios.get(`/api/users/@me?token=${session.access_token}`).then(response => {
        setUserData(response.data as UserProfile)
      }).catch(error => {
        throw new Error(error.response.data.error);
      });

      await axios.get(`api/billing/customers/fetch`).then(response => {
        setCustomer(response.data.data);
      }).catch(error => {
        throw new Error(error.response.data.error);
      }).finally(() => {
        setLoading(false);
        setUpdate(false);
      });
    }

    if (session) {
      fetch();
    } else {
      setLoading(false);
    }
  }, [update]);

  useEffect(() => {
    const user = supabase.auth.user();
    if (email === user.email) {
      setVerified(true);
    }
  }, [email]);

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
          {/* Identities */}
          <Stack spacing={5}>
            <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
              Identities
            </Heading>
            <Divider />
            <Text fontSize={{ base: "md", md: "lg" }}>
              Link external accounts like Discord and Github to your Pixel account.
            </Text>

            {/* Discord */}
            <ButtonGroup>
              <Stack isInline>
                <Skeleton isLoaded={!loading}>
                  {userData.discord ? (
                    <Button leftIcon={<FaDiscord />} colorScheme='blue' variant='solid' onClick={DiscordModalOnOpen}>
                      {`${userData.discord.username}#${userData.discord.discriminator}`}
                    </Button>
                  ) : (
                    <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL + "/api/auth/link/discord"}&response_type=code&scope=identify%20email`} passHref>
                      <Button leftIcon={<FaDiscord />} colorScheme='blue' variant='outline'>
                        {"Link Discord"}
                      </Button>
                    </Link>
                  )}
                </Skeleton>
                {userData.discord ? (
                  <Flex>
                    <Modal onClose={DiscordModalOnClose} isOpen={DiscordModalIsOpen} isCentered>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader />
                        <ModalCloseButton />
                        <ModalBody>
                          {DiscordModalUISwitch ? (
                            <>
                              <Center>
                                <VStack spacing={5}>
                                  <Avatar
                                    src={`https://cdn.discordapp.com/avatars/${userData.discord.id}/${userData.discord.avatar}.png?size=256`}
                                    rounded="full"
                                    size="2xl"
                                  />
                                  <VStack>
                                    <Text fontSize="26px" fontWeight="bold">
                                      {userData.discord.username}#<span>{userData.discord.discriminator}</span>
                                    </Text>
                                    <Text fontSize="14px">Email: {userData.discord.email}</Text>
                                    <Text fontSize="14px">ID: {userData.discord.id}</Text>
                                  </VStack>
                                </VStack>
                              </Center>
                              <Center>
                                <SimpleGrid
                                  columns={2}
                                  spacing={5}
                                  mt={{ base: "6vw", sm: "4vw", md: "2vw" }}
                                >
                                  <Button as="a" variant="solid" fontSize="16px" onClick={() => setDiscordModalUISwitch(DiscordModalUISwitch ? false : true)}>
                                    Toggle view
                                  </Button>
                                  {DiscordUnlinkConfirm ? (
                                    <Button
                                      as="a"
                                      variant="solid"
                                      colorScheme={"red"}
                                      fontSize="16px"
                                      onClick={() => destroyDiscordLink()}
                                    >
                                      Confirm unlink
                                    </Button>
                                  ) : (
                                    <Button
                                      as="a"
                                      variant="solid"
                                      fontSize="16px"
                                      onClick={() => setDiscordUnlinkConfirm(true)}
                                    >
                                      Unlink
                                    </Button>
                                  )}
                                </SimpleGrid>
                              </Center>
                            </>
                          ) : (
                            <>
                              <Center>
                                <VStack>
                                  <Text fontSize="16px">Username: <b>{userData.discord.username}</b></Text>
                                  <Text fontSize="16px">Tag: <b>{userData.discord.discriminator}</b></Text>
                                  <Text fontSize="16px">Email: <b>{userData.discord.email}</b></Text>
                                  <Text fontSize="16px">ID: <b>{userData.discord.id}</b></Text>
                                </VStack>
                              </Center>
                              <Center>
                                <SimpleGrid
                                  columns={2}
                                  spacing={5}
                                  mt={{ base: "6vw", sm: "4vw", md: "2vw" }}
                                >
                                  <Button as="a" variant="solid" fontSize="16px" onClick={() => setDiscordModalUISwitch(DiscordModalUISwitch ? false : true)}>
                                    Toggle view
                                  </Button>
                                  {DiscordUnlinkConfirm ? (
                                    <Button
                                      as="a"
                                      variant="solid"
                                      fontSize="16px"
                                      colorScheme={"red"}
                                      onClick={() => destroyDiscordLink()}
                                    >
                                      Confirm unlink
                                    </Button>
                                  ) : (
                                    <Button
                                      as="a"
                                      variant="solid"
                                      fontSize="16px"
                                      onClick={() => setDiscordUnlinkConfirm(true)}
                                    >
                                      Unlink
                                    </Button>
                                  )}
                                </SimpleGrid>
                              </Center>
                            </>
                          )}
                        </ModalBody>
                        <ModalFooter />
                      </ModalContent>
                    </Modal>
                  </Flex>
                ) : <div />}
              </Stack>

              <Stack isInline>
                <Skeleton isLoaded={!loading}>
                  {userData.github ? (
                    <Button leftIcon={<FaGithub />} colorScheme='gray' variant='solid' onClick={GithubModalOnOpen}>
                      {`${userData.github.email}`}
                    </Button>
                  ) : (
                    <Link href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user%20read:email&allow_signup=false`} passHref>
                      <Button leftIcon={<FaGithub />} colorScheme='gray' variant='outline'>
                        {"Link GitHub"}
                      </Button>
                    </Link>
                  )}
                </Skeleton>
                {userData.github ? (
                  <Flex>
                    <Modal onClose={GithubModalOnClose} isOpen={GithubModalIsOpen} isCentered>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader />
                        <ModalCloseButton />
                        <ModalBody>
                          {GithubModalUISwitch ? (
                            <>
                              <Center>
                                <VStack spacing={5}>
                                  <Avatar
                                    src={`${userData.github.avatar_url}`}
                                    rounded="full"
                                    size="2xl"
                                  />
                                  <VStack>
                                    <Text fontSize="26px" fontWeight="bold">
                                      {userData.github.username}
                                    </Text>
                                    <Text fontSize="14px">Email: {userData.github.email}</Text>
                                    <Text fontSize="14px">ID: {userData.github.id}</Text>
                                  </VStack>
                                </VStack>
                              </Center>
                              <Center>
                                <SimpleGrid
                                  columns={2}
                                  spacing={5}
                                  mt={{ base: "6vw", sm: "4vw", md: "2vw" }}
                                >
                                  <Button as="a" variant="solid" fontSize="16px" onClick={() => setGithubModalUISwitch(GithubModalUISwitch ? false : true)}>
                                    Toggle view
                                  </Button>
                                  {GithubUnlinkConfirm ? (
                                    <Button
                                      as="a"
                                      variant="solid"
                                      colorScheme={"red"}
                                      fontSize="16px"
                                      onClick={() => destroyGithubLink()}
                                    >
                                      Confirm unlink
                                    </Button>
                                  ) : (
                                    <Button
                                      as="a"
                                      variant="solid"
                                      fontSize="16px"
                                      onClick={() => setGithubUnlinkConfirm(true)}
                                    >
                                      Unlink
                                    </Button>
                                  )}
                                </SimpleGrid>
                              </Center>
                            </>
                          ) : (
                            <>
                              <Center>
                                <VStack>
                                  <Text fontSize="16px">Username: <b>{userData.github.username}</b></Text>
                                  <Text fontSize="16px">URL: <b>{userData.github.url}</b></Text>
                                  <Text fontSize="16px">Email: <b>{userData.github.email}</b></Text>
                                  <Text fontSize="16px">ID: <b>{userData.github.id}</b></Text>
                                </VStack>
                              </Center>
                              <Center>
                                <SimpleGrid
                                  columns={2}
                                  spacing={5}
                                  mt={{ base: "6vw", sm: "4vw", md: "2vw" }}
                                >
                                  <Button as="a" variant="solid" fontSize="16px" onClick={() => setGithubModalUISwitch(GithubModalUISwitch ? false : true)}>
                                    Toggle view
                                  </Button>
                                  {GithubUnlinkConfirm ? (
                                    <Button
                                      as="a"
                                      variant="solid"
                                      fontSize="16px"
                                      colorScheme={"red"}
                                      onClick={() => destroyGithubLink()}
                                    >
                                      Confirm unlink
                                    </Button>
                                  ) : (
                                    <Button
                                      as="a"
                                      variant="solid"
                                      fontSize="16px"
                                      onClick={() => setGithubUnlinkConfirm(true)}
                                    >
                                      Unlink
                                    </Button>
                                  )}
                                </SimpleGrid>
                              </Center>
                            </>
                          )}
                        </ModalBody>
                        <ModalFooter />
                      </ModalContent>
                    </Modal>
                  </Flex>
                ) : <div />}
              </Stack>
            </ButtonGroup>
          </Stack>

          {/* Billing */}
          <Stack spacing={5}>
            <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
              Billing
            </Heading>
            <Divider />
            <Text fontSize={{ base: "md", md: "lg" }}>
              Manage your billing information and subscription.
            </Text>
            {loading ? (
              <>
                <Spinner />
              </>
            ) : (
              <>
                {customer ? (
                  <>
                    {userData.pixel ? (
                      <>
                        <Text fontSize={{ base: "md", md: "lg" }}>
                          You are subscribed.
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text fontSize={{ base: "md", md: "lg" }}>
                          You are <b>not</b> subscribed.
                        </Text>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Text fontSize={{ base: "md", md: "lg" }}>
                      We have used your Pixel account information to auto-fill the form below. If anything is incorrect, please change it now.
                    </Text>
                  </>
                )}
              </>
            )}
            {loading ? (
              <>
              </>
            ) : (
              <>
                {userData.pixel ? (
                  <>
                    <ButtonGroup spacing={5}>
                      <Link href="/dashboard" passHref>
                        <Button colorScheme="gray">
                          Dashboard
                        </Button>
                      </Link>
                      <Button colorScheme="gray" onClick={() => loadPortal()}>
                        Edit information
                      </Button>
                    </ButtonGroup>
                  </>
                ) : (
                  <>
                    <ButtonGroup spacing={5}>
                      {customer ? (
                        <>
                          <Link href="/pixels" passHref>
                            <Button>
                              Subscribe
                            </Button>
                          </Link>
                          <Button onClick={() => loadPortal()}>
                            Edit billing information
                          </Button>
                        </>
                      ) : (
                        <>
                          <Stack spacing={"3vh"}>
                            <Stack>
                              <Heading fontSize={["xl", "xl", "lg", "lg"]}>Name</Heading>
                              <Input value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} />
                            </Stack>
                            <Stack>
                              <Heading fontSize={["xl", "xl", "lg", "lg"]}>Email</Heading>
                              <Input value={newCustomerEmail} onChange={(e) => setNewCustomerEmail(e.target.value)} />
                            </Stack>
                            <Stack>
                              <ButtonGroup>
                                <Button onClick={() => createCustomer()} loadingText="Creating..." isLoading={loading}>
                                  Create customer
                                </Button>
                              </ButtonGroup>
                            </Stack>
                          </Stack>
                        </>
                      )}
                    </ButtonGroup>
                  </>
                )}
              </>
            )}
          </Stack>

          {/* Removal */}
          <Stack spacing={5}>
            <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
              Removal
            </Heading>
            <Divider />
            <Text fontSize={{ base: "md", md: "lg" }}>
              Deleting your account means <b>all</b> your data will be deleted from our database. You can&apos;t undo this action.
            </Text>
            <ButtonGroup spacing={5}>
              <Button colorScheme="red" onClick={DeleteOnOpen}>
                Delete account
              </Button>
              <AlertDialog
                isOpen={DeleteIsOpen}
                leastDestructiveRef={cancelRef}
                onClose={DeleteOnClose}
                isCentered={true}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                      Delete Account
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? This action is irreversible.
                      <br />
                      Please type in your email to confirm.
                      <Box mt={4}>
                        <Input placeholder='Email' type='email' disabled={verified} onChange={(e) => setEmail(e.target.value)} />
                      </Box>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={DeleteOnClose}>
                        Cancel
                      </Button>
                      <Button colorScheme='red' onClick={() => deleteAccount()} ml={3} disabled={!verified}>
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
              {/* <Button colorScheme="red" variant={"outline"}>
                    Disable account
                  </Button> */}
            </ButtonGroup>
          </Stack>

        </Stack>
      </Container>
    </>
  );
}

export default Account;