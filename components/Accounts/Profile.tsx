import { Button, Divider, Flex, Heading, Stack, Text, Box, SimpleGrid, Avatar, Input, useToast } from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import Container from "../UI/Container";
import supabase from "./SupabaseClient";
import React from 'react';
import { Deta } from "deta";
import { updateAvatar } from "./updateAvatar";

function Profile({ list }) {
    const toast = useToast();
    const [uploading, setUploading] = useState(false);

    const user = supabase.auth.user();
    const [username, setUsername] = useState(user.user_metadata.username);
    const [email, setEmail] = useState(user.email);

    async function updateEmail() {
        try {
            const { error } = await supabase.auth.update({
                email: email
            });

            if (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Success",
                    description: "Profile updated",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (err) {
            throw err;
        }
    }

    async function updateUsername() {
        try {
            const { error } = await supabase.auth.update({
                data: {
                    username: setUsername,
                },
            });
            if (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Success",
                    description: "Profile updated",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (err) {
            throw err;
        }
    }

    async function uploadAvatar(event) {
        try {
            setUploading(true)

            updateAvatar(event, user);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setUploading(false)
        }
    }

    async function removeAvatar() {
        try {
            const deta = Deta(process.env.DETA_PROJECT_KEY);
            const drive = deta.Drive("avatars");
            const filename = await user.user_metadata.avatar.replace(/^https?:\/\/[^\/]+\/api\/avatars\//, '');
            await drive.delete(filename);

            // Remove the avatar from the user
            let { error: UpdateError } = await supabase.auth.update({
                data: {
                    avatar: null,
                }
            });

            if (UpdateError) throw UpdateError;

            toast({
                title: "Success",
                description: "Avatar removed",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    return (
        <>
            <Container enableTransition={false}>
                <Head>
                    <title>Account</title>
                </Head>
                <Stack
                    spacing={10}
                    justifyContent="center"
                    my={["10vh", "10vh", "15vh", "15vh"]}
                >
                    <Stack spacing={5}>
                        {" "}
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                            Profile
                        </Heading>
                        <Divider />
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20}>
                            <Stack spacing={5}>
                                <Flex flexDirection={"row"} justifyContent="center" gap={10}>
                                    <Avatar
                                        src={user.user_metadata.avatar}
                                        w="128px"
                                        h="128px"
                                        borderRadius="50%"
                                    />
                                    <Stack spacing={5} alignItems="center" pt={3}>
                                        <Button
                                            colorScheme="blue"
                                            variant="outline"
                                            onClick={() => {
                                                document.getElementById("single").click();
                                            }}
                                        >
                                            {uploading ? 'Uploading ...' : 'Upload'}
                                        </Button>
                                        <input
                                            style={{
                                                visibility: 'hidden',
                                                position: 'absolute',
                                            }}
                                            type="file"
                                            id="single"
                                            accept="image/*"
                                            onChange={uploadAvatar}
                                            disabled={uploading}
                                        />
                                        <Button onClick={() => removeAvatar()}>Remove</Button>
                                    </Stack>
                                </Flex>
                                <Box>
                                    <Text size="sm" pb="1">
                                        Username
                                    </Text>
                                    <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                                </Box>
                                <Box>
                                    <Text size="sm" pb="1">
                                        Email
                                    </Text>
                                    <Input value={user.email} onChange={(e) => setEmail(e.target.value)} />
                                </Box>
                            </Stack>
                            {/* <Box display={{ base: "none", md: "block" }}>
                                <Heading textAlign={"center"} size="lg" pb={5}>Preview</Heading>
                                <Box p={8} my={2} bg={"#222222"} rounded="lg">
                                    <Stack spacing={5}>
                                        <Center>
                                            <Avatar
                                                name={username}
                                                src={user.user_metadata.avatar}
                                                size="xl"
                                            />
                                        </Center>
                                        <Box textAlign={"center"}>
                                            <Heading size="md">
                                                {username}
                                            </Heading>
                                            <Text>{email}</Text>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box> */}
                        </SimpleGrid>
                    </Stack>
                </Stack>
            </Container >
        </>
    )
}

export async function getServerSideProps() {
    const list: Object = await fetch("https://localhost:3000/api/avatars/list").then(data => data.json());

    return {
        props: {
            list: list,
        }
    }
}

export default Profile;