import { Button, Divider, Flex, Heading, Stack, Text, Box, SimpleGrid, Avatar, Input, useToast, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import Container from "../UI/Container";
import supabase from "../../lib/SupabaseClient";
import React from 'react';
import { uploadFileRequest } from "../../domains/upload.services";
import axios from "axios";

function Profile() {
    const toast = useToast();
    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);

    const user = supabase.auth.user();
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(user.user_metadata.username);
    const [email, setEmail] = useState(user.email);

    useEffect(() => {
        const value = localStorage.getItem("supabase.auth.token");
        const token = !!value ? JSON.parse(value).currentSession.access_token : null;
        setToken(token);
    }, []);

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

    interface IProps {
        acceptedFileTypes?: string;
        allowMultipleFiles?: boolean;
        onChange: (formData: FormData) => void;
        uploadFileName: string;
    }

    const UiFileInputButton: React.FC<IProps> = (props) => {
        const fileInputRef = React.useRef<HTMLInputElement | null>(null);
        const formRef = React.useRef<HTMLFormElement | null>(null);
        const [uploading, setUploading] = useState(false);

        const onClickHandler = () => {
            setUploading(true);
            fileInputRef.current?.click();
        };

        const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files?.length) {
                return;
            }

            const formData = new FormData();

            Array.from(event.target.files).forEach((file) => {
                formData.append(event.target.name, file);
            });

            props.onChange(formData);

            formRef.current?.reset();
        };

        return (
            <form ref={formRef}>
                <Button type="button" onClick={onClickHandler} colorScheme="blue" variant="outline">
                    {uploading ? <Spinner /> : "Upload"}
                </Button>
                <input
                    accept={props.acceptedFileTypes}
                    multiple={props.allowMultipleFiles}
                    name={props.uploadFileName}
                    onChange={onChangeHandler}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    type="file"
                />
            </form>
        );
    };

    const UploadAvatar = async (formData: FormData) => {
        const response = await uploadFileRequest(user.id, token, formData, async (event) => {
            console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
        });

        if (response.error) {
            setUploading(false);
            toast({
                title: "Error",
                description: response.error,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        await supabase.auth.update({
            data: {
                avatar: `${process.env.NEXT_PUBLIC_URL}/api/avatars/${response.data[0]}`,
            },
        });
        setUploading(false);
    };

    async function removeAvatar(id: string, token: string) {
        try {
            setRemoving(true);
            await axios.put(`/api/avatars/remove?id=${id}&token=${token}`);

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
        } finally {
            setRemoving(false);
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
                                        <UiFileInputButton uploadFileName="upload" onChange={UploadAvatar} />
                                        <Button onClick={() => removeAvatar(user.id, token)}> {removing ? <Spinner /> : "Remove"} </Button>
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
