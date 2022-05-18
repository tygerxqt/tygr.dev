import { Button, Skeleton, Flex, Box, useToast, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Center, Avatar, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import supabase from "../../lib/SupabaseClient";
import React from "react";
import { BiUnlink } from "react-icons/bi";
import { AiOutlineCheck, AiOutlineIdcard } from "react-icons/ai";
import { DiscordUser } from "../../types/DiscordUser";

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
    const [githubData, setGithubData] = useState(null);

    useEffect(() => {
        setLoading(true)
        fetch(`/api/users/${supabase.auth.user().id}?token=${supabase.auth.session().access_token}`)
            .then((res) => res.json())
            .then((data) => {
                data.discord[0].discord.id ? setDiscordData(data.discord[0].discord) : setDiscordData(null);
                data.github[0].github.id ? setGithubData(data.github[0].github) : setGithubData(null);
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

    return (
        <>
            {/* Discord */}
            <Box>
                <Flex flexDirection={"row"}>
                    <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL + "/api/auth/link/discord"}&response_type=code&scope=identify%20email`} passHref>
                        <Skeleton isLoaded={!loading}>
                            <Button w="full" leftIcon={<FaDiscord />} colorScheme='blue' variant='solid' disabled={discordData ? true : false}>
                                {discordData ? `Linked to ${discordData.username}#${discordData.discriminator}` : "Link Discord"}
                            </Button>
                        </Skeleton>
                    </Link>
                    {discordData ? (
                        <Flex pl={4} display={{ base: "none", sm: "block" }}>
                            {DiscordUnlinkConfirm ? (
                                // Confirm button
                                <Button onClick={() => destroyDiscordLink()} colorScheme={"red"} disabled={loading}>
                                    <AiOutlineCheck />
                                </Button>
                            ) : (
                                <Button onClick={() => setDiscordUnlinkConfirm(true)} disabled={loading}>
                                    <BiUnlink />
                                </Button>
                            )}
                        </Flex>
                    ) : <div />}
                    {discordData ? (
                        <Flex pl={4}>
                            <Button onClick={DiscordModalOnOpen}>
                                <AiOutlineIdcard />
                            </Button>
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
                                                            Data view
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
                </Flex>
            </Box>

            {/* Github
            <Box>
                <Flex flexDirection={"row"}>
                    <Link href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user%20read:email&allow_signup=false`} passHref>
                        <Button leftIcon={<FaGithub />} variant='solid'>
                            Link Github
                        </Button>
                    </Link>
                    <Flex pl={4}>
                        <Button>
                            <BiUnlink />
                        </Button>
                    </Flex>
                </Flex>
            </Box> */}
        </>
    )
}

export async function getServerSideProps({ req }) {
    const client = axios.create()
    const { user, token } = await supabase.auth.api.getUserByCookie(req);
    supabase.auth.setAuth(token);
    const { data } = await client.get(`${process.env.NEXT_PUBLIC_URL}/api/users/${user.id}?token=${token}`);

    return {
        props: {
            data
        },
    }
}

export default Identities;