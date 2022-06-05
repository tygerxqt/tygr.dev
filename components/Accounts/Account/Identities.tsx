import { Button, Skeleton, Flex, Box, useToast, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Center, Avatar, VStack, Text, SimpleGrid, Stack, Divider, Heading, ButtonGroup } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import supabase from "../../../lib/SupabaseClient";
import React from "react";
import { BiUnlink } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import { DiscordUser } from "../../../types/DiscordUser";
import { GithubUser } from "../../../types/GithubUser";

function Identities() {
    const toast = useToast();
    const { isOpen: DiscordModalIsOpen, onOpen: DiscordModalOnOpen, onClose: DiscordModalOnClose } = useDisclosure();
    const [DiscordModalUISwitch, setDiscordModalUISwitch] = useState(true);
    const [DiscordUnlinkConfirm, setDiscordUnlinkConfirm] = useState(false);

    const { isOpen: GithubModalIsOpen, onOpen: GithubModalOnOpen, onClose: GithubModalOnClose } = useDisclosure();
    const [GithubModalUISwitch, setGithubModalUISwitch] = useState(true);
    const [GithubUnlinkConfirm, setGithubUnlinkConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    // used to trigger useEffect
    const [update, setUpdate] = useState(false);

    // social data
    const [discordData, setDiscordData] = useState<DiscordUser>(null);
    const [githubData, setGithubData] = useState<GithubUser>(null);

    useEffect(() => {
        setLoading(true)
        fetch(`/api/users/${supabase.auth.user().id}?token=${supabase.auth.session().access_token}`)
            .then((res) => res.json())
            .then((data) => {
                data.discord.id ? setDiscordData(data.discord) : setDiscordData(null);
                data.github.id ? setGithubData(data.github) : setGithubData(null);
                setData(data);
            }).finally(() => {
                setLoading(false)
                setUpdate(false)
            });
    }, [update]);

    async function destroyDiscordLink() {
        setLoading(true);
        try {
            const res = await axios.post(`/api/auth/unlink/discord`, {
                token: supabase.auth.session().access_token,
            });

            if (res.status != 200) console.log(res.data.error)

            if (res.status != 200) {
                toast({
                    title: "Error",
                    description: "An error occured: " + res.data.error,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Success",
                    description: "Discord account unlinked.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                setUpdate(true);
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "An unexpected error occured. " + err.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    async function destroyGithubLink() {
        setLoading(true);
        try {
            const res = await axios.post(`/api/auth/unlink/github`, {
                token: supabase.auth.session().access_token,
            });

            if (res.status != 200) console.log(res.data.error)

            if (res.status != 200) {
                toast({
                    title: "Error",
                    description: "An error occured: " + res.data.error,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Success",
                    description: "GitHub account unlinked.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                setUpdate(true);
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "An unexpected error occured. " + err.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
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
                            {discordData ? (
                                <Button leftIcon={<FaDiscord />} colorScheme='blue' variant='solid' onClick={DiscordModalOnOpen}>
                                    {`${discordData.username}#${discordData.discriminator}`}
                                </Button>
                            ) : (
                                <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL + "/api/auth/link/discord"}&response_type=code&scope=identify%20email`} passHref>
                                    <Button leftIcon={<FaDiscord />} colorScheme='blue' variant='outline'>
                                        {"Link Discord"}
                                    </Button>
                                </Link>
                            )}
                        </Skeleton>
                        {discordData ? (
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
                                                                src={`https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}.png?size=256`}
                                                                rounded="full"
                                                                size="2xl"
                                                            />
                                                            <VStack>
                                                                <Text fontSize="26px" fontWeight="bold">
                                                                    {discordData.username}#<span>{discordData.discriminator}</span>
                                                                </Text>
                                                                <Text fontSize="14px">Email: {discordData.email}</Text>
                                                                <Text fontSize="14px">ID: {discordData.id}</Text>
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
                                                            <Text fontSize="16px">Username: <b>{discordData.username}</b></Text>
                                                            <Text fontSize="16px">Tag: <b>{discordData.discriminator}</b></Text>
                                                            <Text fontSize="16px">Email: <b>{discordData.email}</b></Text>
                                                            <Text fontSize="16px">ID: <b>{discordData.id}</b></Text>
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
                            {githubData ? (
                                <Button leftIcon={<FaGithub />} colorScheme='gray' variant='solid' onClick={GithubModalOnOpen}>
                                    {`${githubData.email}`}
                                </Button>
                            ) : (
                                <Link href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user%20read:email&allow_signup=false`} passHref>
                                    <Button leftIcon={<FaGithub />} colorScheme='gray' variant='outline'>
                                        {"Link GitHub"}
                                    </Button>
                                </Link>
                            )}
                        </Skeleton>
                        {githubData ? (
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
                                                                src={`${githubData.avatar_url}`}
                                                                rounded="full"
                                                                size="2xl"
                                                            />
                                                            <VStack>
                                                                <Text fontSize="26px" fontWeight="bold">
                                                                    {githubData.username}
                                                                </Text>
                                                                <Text fontSize="14px">Email: {githubData.email}</Text>
                                                                <Text fontSize="14px">ID: {githubData.id}</Text>
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
                                                            <Text fontSize="16px">Username: <b>{githubData.username}</b></Text>
                                                            <Text fontSize="16px">URL: <b>{githubData.url}</b></Text>
                                                            <Text fontSize="16px">Email: <b>{githubData.email}</b></Text>
                                                            <Text fontSize="16px">ID: <b>{githubData.id}</b></Text>
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
        </>
    )
}

export default Identities;