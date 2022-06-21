import { Heading, Stack, Divider, Button, ButtonGroup, Input, Spinner, Text, Avatar, Center, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, toast, useDisclosure, VStack, useToast, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box } from "@chakra-ui/react";
import Link from "next/link";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import supabase from "../../lib/SupabaseClient";
import axios from "axios";
import router from "next/router";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { useAuth } from "../../contexts/Auth";
import useMediaQuery from "../../hook/useMediaQuery";
import Navbar from "../UI/Navbar";

function Account() {
  const { userData, update, user } = useAuth();
  const toast = useToast();
  const isLargerThan768 = useMediaQuery(768);

  const [deleteLoad, setDeleteLoad] = useState(false);

  const [discordLoad, setDiscordLoad] = useState(false);
  const [githubLoad, setGithubLoad] = useState(false);

  const [portalLoad, setPortalLoad] = useState(false);

  // === Customer ===
  const [newCustomerName, setNewCustomerName] = useState(user.user_metadata.full_name);
  const [newCustomerEmail, setNewCustomerEmail] = useState(user.email);

  async function createCustomer() {
    await axios.post(`/api/billing/customers/create`, {
      email: newCustomerEmail,
      name: newCustomerName,
    }).then(response => {
      update();
    }).catch(error => {
      throw new Error(error.response.data.error);
    });
  }

  const loadPortal = async () => {
    setPortalLoad(true);
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
    try {
      setDiscordLoad(true);
      await axios.post(`/api/auth/unlink/discord`).then(res => {
        toast({
          title: "Success",
          description: "Discord account unlinked.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setDiscordLoad(false);
        update();
      }).catch(err => {
        throw err.response.data.error;
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occured. " + err,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setDiscordLoad(false);
    }
  }

  async function destroyGithubLink() {
    try {
      setGithubLoad(true);
      await axios.post(`/api/auth/unlink/github`).then(res => {
        toast({
          title: "Success",
          description: "GitHub account unlinked.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        update();
        setGithubLoad(false);
      }).catch(err => {
        throw err.response.data.error;
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occured. " + err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setGithubLoad(false);
    }
  }

  // === Removal ===
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const { isOpen: DeleteIsOpen, onOpen: DeleteOnOpen, onClose: DeleteOnClose } = useDisclosure();
  const cancelRef = React.useRef();

  async function deleteAccount() {
    try {
      await axios.delete("/api/users/delete").then(async response => {
        toast({
          title: "Account deleted",
          description: response.data.data,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        await supabase.auth.signOut();
        await axios.post('/api/auth/cookie', {
          event: "SIGNED_OUT"
        });
      }).catch(error => {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
    } catch (error) {
      setDeleteLoad(false);
    }
  }

  useEffect(() => {
    const user = supabase.auth.user();
    if (email === user.email) {
      setVerified(true);
    }
  }, [email]);

  return (
    <>
      {userData === undefined || !user ? (
        <>
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
                    Loading...
                  </Text>
                </Center>
              </Stack>
            </Center>
          </Flex>
        </>
      ) : (
        <>
          <Navbar enableTransition={false} />
          <Flex
            as="main"
            justifyContent="center"
            flexDirection="column"
            px={isLargerThan768 ? "15vw" : "8vw"}
            py={isLargerThan768 ? "4vw" : "8vw"}
          >
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
                    {userData && userData.discord.id ? (
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
                    {userData && userData.discord.id ? (
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
                                          disabled={discordLoad}
                                          isLoading={discordLoad}
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
                                          disabled={discordLoad}
                                          isLoading={discordLoad}
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
                    {userData && userData.github.email ? (
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
                    {userData && userData.github.email ? (
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
                                          isLoading={githubLoad}
                                          disabled={githubLoad}
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
                                          disabled={githubLoad}
                                          isLoading={githubLoad}
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

                {userData && userData.customer.id ? (
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
                  </>
                )}
                {userData && userData.pixel ? (
                  <>
                    <ButtonGroup spacing={5}>
                      <Link href="/dashboard" passHref>
                        <Button colorScheme="gray">
                          Dashboard
                        </Button>
                      </Link>
                      <Button colorScheme="gray" onClick={() => loadPortal()} disabled={portalLoad} isLoading={portalLoad}>
                        Edit information
                      </Button>
                    </ButtonGroup>
                  </>
                ) : (
                  <>
                    <ButtonGroup spacing={5}>
                      {userData && userData.customer.id ? (
                        <>
                          <Link href="/pixels" passHref>
                            <Button>
                              Subscribe
                            </Button>
                          </Link>
                          <Button onClick={() => loadPortal()} disabled={portalLoad} isLoading={portalLoad}>
                            Edit billing information
                          </Button>
                        </>
                      ) : (
                        <>
                          <Stack spacing={5}>
                            <Text fontSize={{ base: "md", md: "lg" }}>
                              We have used your Pixel account information to auto-fill the form below. If anything is incorrect, please change it now.
                            </Text>
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
                                  <Button onClick={() => createCustomer()} loadingText="Creating...">
                                    Create customer
                                  </Button>
                                </ButtonGroup>
                              </Stack>
                            </Stack>
                          </Stack>
                        </>
                      )}
                    </ButtonGroup>
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
                          <Button colorScheme='red' onClick={() => {
                            setDeleteLoad(true)
                            deleteAccount()
                          }} ml={3} disabled={!verified || deleteLoad} isLoading={deleteLoad}>
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </ButtonGroup>
              </Stack>
            </Stack>
          </Flex>
        </>
      )}

    </>
  );
}

export default Account;