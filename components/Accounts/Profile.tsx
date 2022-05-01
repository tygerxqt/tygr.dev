import { Button, Divider, Flex, Heading, Stack, Text, Box, SimpleGrid, Avatar, Input, useToast } from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import Container from "../UI/Container";
import supabase from "./SupabaseClient";
import React from 'react';
import { Deta } from "deta";
import { useRouter } from 'next/router'
import axios, { Axios } from "axios";
import { uploadFileRequest } from "../../domains/upload.services";
import FileInputButton from "./FileInputButton";

function Profile() {
    const toast = useToast();
    const [uploading, setUploading] = useState(false);

    const user = supabase.auth.user();
    const [username, setUsername] = useState(user.user_metadata.username);
    const [email, setEmail] = useState(user.email);

    const router = useRouter();

    const client = axios.create({
        baseURL: process.env.NEXT_PUBLIC_URL + "/api"
    });

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
            try {
                if (!event.target.files || event.target.files.length === 0) {
                    throw new Error('You must select an image to upload.')
                }

                let image = event.target.files[0];
                let ext = image.name.split('.').pop();
                const buffer = await image.arrayBuffer();
                let byteArray = new Uint8Array(buffer);

                // const deta = Deta(process.env.DETA_PROJECT_KEY);
                // const drive = deta.Drive("avatars");
                // if ((await drive.list()).names.filter(name => name.includes(user.user_metadata.username)).length > 0) {
                //     await drive.delete(await user.user_metadata.avatar.replace(/^https?:\/\/[^\/]+\/api\/avatars\//, ''));
                // }
                const type = event.target.files[0].type;
                // await drive.put(`${user.id}.${ext}`, { data: byteArray, contentType: type });
                const data = {
                    name: `${user.id}.${ext}`,
                    value: byteArray,
                    type: type
                }

                const stringified = JSON.stringify(data)
                console.log(stringified);

                await client.put(`/avatars/put`, stringified, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).catch((err) => {
                    throw err;
                });

                await supabase.auth.update({
                    data: {
                        avatar: `${process.env.NEXT_PUBLIC_URL}/api/avatars/${user.id}.${ext}`,
                    },
                });

                return true;
            } catch (err) {
                throw err;
            }
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

    const onChange = async (formData: FormData) => {
        const response = await uploadFileRequest(user.id, formData, (event) => {
            console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
        });

        console.log('response', response);
    };

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
                                        <FileInputButton uploadFileName="upload" onChange={onChange} />
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
    const list: Object = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/avatars/list`).then(data => data.json());

    return {
        props: {
            list: list,
        }
    }
}

export default Profile;
