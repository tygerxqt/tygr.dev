import { useToast, Button, Spinner, Center, Flex, Stack, Text, Divider, Heading, SimpleGrid, Avatar, Image, Badge, Box, VStack, ButtonGroup } from "@chakra-ui/react";
import useMediaQuery from "../../hook/useMediaQuery";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { uploadAvatarRequest } from "../../domains/avatars/upload.services";
import { uploadBannerRequest } from "../../domains/banners/upload.services";
import supabase from "../../lib/SupabaseClient";
import { UserProfile } from "../../types/Account/UserProfile";
import Container from "../UI/Container";
import Head from "next/head";
import EmailField from "./Profile/EmailField";
import IDField from "./Profile/IDField";
import PasswordField from "./Profile/PasswordField";
import UsernameField from "./Profile/UsernameField";
import Preview from "./Profile/Preview";
import TagField from "./Profile/TagField";
import TokenField from "./Profile/TokenField";

function Profile() {
    const user = supabase.auth.user();
    const [userData, setUserData] = useState<UserProfile>({} as UserProfile);

    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [avatarRemoving, setAvatarRemoving] = useState(false);
    const [bannerRemoving, setBannerRemoving] = useState(false);

    const isLargerThan1200 = useMediaQuery(1200);
    const isLargerThan768 = useMediaQuery(768);

    // set server cookie
    axios.post("/api/auth/cookie/set", {
        event: user ? "SIGNED_IN" : "SIGNED_OUT",
        session: supabase.auth.session(),
    });

    interface IProps {
        acceptedFileTypes?: string;
        allowMultipleFiles?: boolean;
        onChange: (formData: FormData) => void;
        uploadFileName: string;
    }

    const AvatarButton: React.FC<IProps> = (props) => {
        const fileInputRef = React.useRef<HTMLInputElement | null>(null);
        const formRef = React.useRef<HTMLFormElement | null>(null);

        const onClickHandler = () => {
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
                <Button
                    type="button"
                    onClick={onClickHandler}
                    colorScheme="blue"
                    variant="outline"
                >
                    {uploadingAvatar ? <Spinner /> : "Upload"}
                </Button>
                <input
                    accept={props.acceptedFileTypes}
                    multiple={props.allowMultipleFiles}
                    name={props.uploadFileName}
                    onChange={onChangeHandler}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    type="file"
                />
            </form>
        );
    };

    const UploadAvatar = async (formData: FormData) => {
        try {
            const response = await uploadAvatarRequest(
                user.id,
                formData,
                async (event) => {
                    console.log(
                        `Uploading avatar:`,
                        Math.round((event.loaded * 100) / event.total)
                    );
                }
            );

            if (response.error) throw response.error;

            const { error } = await supabase
                .from("users")
                .update({
                    avatar: `${process.env.NEXT_PUBLIC_URL}/api/avatars/${response.data[0]}`,
                })
                .eq("id", user.id);
            if (error) throw error;
            setUpdate(true);
        } catch (err) {
            toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    };

    const BannerUpload: React.FC<IProps> = (props) => {
        const fileInputRef = React.useRef<HTMLInputElement | null>(null);
        const formRef = React.useRef<HTMLFormElement | null>(null);

        const onClickHandler = () => {
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
                <Button
                    type="button"
                    onClick={onClickHandler}
                    colorScheme="blue"
                    variant="outline"
                >
                    {uploadingBanner ? <Spinner /> : "Upload"}
                </Button>
                <input
                    accept={props.acceptedFileTypes}
                    multiple={props.allowMultipleFiles}
                    name={props.uploadFileName}
                    onChange={onChangeHandler}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    type="file"
                />
            </form>
        );
    };

    const UploadBanner = async (formData: FormData) => {
        try {
            const response = await uploadBannerRequest(
                user.id,
                formData,
                async (event) => {
                    console.log(
                        `Uploading banner:`,
                        Math.round((event.loaded * 100) / event.total)
                    );
                }
            );

            if (response.error) throw response.error;

            const { error } = await supabase
                .from("users")
                .update({
                    banner: `${process.env.NEXT_PUBLIC_URL}/api/banners/${response.data[0]}`,
                })
                .eq("id", user.id);

            if (error) throw error;

            setUploadingBanner(false);
            setUpdate(true);
        } catch (err) {
            toast({
                title: "Error",
                description: err,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            setUploadingBanner(false);
        }
    };

    async function removeAvatar(id: string) {
        try {
            setAvatarRemoving(true);
            await axios.put(`/api/avatars/remove?id=${id}`).then(response => {
                toast({
                    title: "Success",
                    description: "Avatar removed",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                setUpdate(true);
            }).catch(err => {
                throw err;
            })
        } catch (err) {
            toast({
                title: "Error",
                description: err,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setAvatarRemoving(false);
        }
    }

    async function removeBanner(id: string) {
        try {
            setBannerRemoving(true);
            await axios.put(`/api/banners/remove?id=${id}`).then(response => {
                toast({
                    title: "Success",
                    description: "Banner removed",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                setUpdate(true);
            }).catch(err => {
                throw err;
            })
        } catch (err) {
            toast({
                title: "Error",
                description: err,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setBannerRemoving(false);
        }
    }

    useEffect(() => {
        async function fetch() {
            await axios.get(`/api/users/@me`).then(response => {
                setUserData(response.data as UserProfile);
                setLoading(false);
                setUpdate(false);
            }).catch(err => {
                setLoading(false);
                setUpdate(false);
                throw new Error(err);
            });
        }

        fetch();
    }, [update, toast]);

    return (
        <>
            {loading ? (
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
                                        Fetching user data...
                                    </Text>
                                </Center>
                            </Stack>
                        </Center>
                    </Flex>
                </>
            ) : (
                <>
                    <Container enableTransition={false}>
                        <Head>
                            <title>Profile</title>
                        </Head>
                        <Stack
                            spacing={10}
                            justifyContent="center"
                            my={["10vh", "10vh", "15vh", "15vh"]}
                        >
                            <Stack spacing={5}>
                                <Heading fontSize={{ base: "4xl", md: "6xl" }}>Profile</Heading>
                                <Divider />
                            </Stack>
                            {isLargerThan1200 ? (
                                <>
                                    <SimpleGrid columns={2} spacing={10}>
                                        <Stack spacing={4}>

                                            {/* Avatar */}
                                            <Heading fontSize={{ base: "xl", md: "2xl" }}>Avatar</Heading>
                                            <Divider />
                                            <Flex
                                                flexDirection={"row"}
                                                justifyContent="center"
                                                gap={{ base: 10, lg: "3rem" }}
                                            >
                                                <Avatar
                                                    src={userData.avatar}
                                                    w={{
                                                        base: "128px",
                                                        lg: "192px",
                                                    }}
                                                    h={{
                                                        base: "128px",
                                                        lg: "192px",
                                                    }}
                                                    borderRadius="50%"
                                                    placeholder={`${process.env.NEXT_PUBLIC_URL}/api/avatars/default.jpg`}
                                                />
                                                <Center>
                                                    <Stack spacing={5} pt={3}>
                                                        <AvatarButton
                                                            uploadFileName="avatar"
                                                            onChange={UploadAvatar}
                                                            allowMultipleFiles={false}
                                                        />
                                                        <Button onClick={() => removeAvatar(user.id)}>
                                                            {" "}
                                                            {avatarRemoving ? <Spinner /> : "Remove"}{" "}
                                                        </Button>
                                                    </Stack>
                                                </Center>
                                            </Flex>

                                            {/* Banner */}
                                            <Center>
                                                <Flex
                                                    flexDirection={"column"}
                                                    justifyContent="center"
                                                    py={4}
                                                    gap={{ base: 10, lg: "1.5rem" }}
                                                >
                                                    <Stack spacing={5}>
                                                        <Heading fontSize={{ base: "xl", md: "2xl" }}>Banner</Heading>
                                                        <Divider />
                                                    </Stack>
                                                    <Image
                                                        src={userData.banner}
                                                        w={"1200px"}
                                                        h={"200px"}
                                                        rounded="lg"
                                                        objectFit={"cover"}
                                                        fallbackSrc={`${process.env.NEXT_PUBLIC_URL}/api/banners/default.jpg`}
                                                        alt={"Banner"}
                                                    />
                                                    <Stack spacing={5} pt={3}>
                                                        <Center>
                                                            <BannerUpload
                                                                uploadFileName="banner"
                                                                onChange={UploadBanner}
                                                                allowMultipleFiles={false}
                                                            />
                                                            <Button ml={4} onClick={() => removeBanner(user.id)}>
                                                                {" "}
                                                                {bannerRemoving ? <Spinner /> : "Remove"}{" "}
                                                            </Button>
                                                        </Center>
                                                    </Stack>
                                                </Flex>
                                            </Center>
                                        </Stack>

                                        <Preview user={user} userData={userData} />
                                    </SimpleGrid>
                                </>
                            ) : (
                                <>
                                    <SimpleGrid columns={1} spacing={10}>
                                        <Stack spacing={8}>

                                            <Preview user={user} userData={userData} />

                                            {/* Avatar */}
                                            <Heading fontSize={{ base: "xl", md: "2xl" }}>Avatar</Heading>
                                            <Divider />
                                            <Flex
                                                flexDirection={"row"}
                                                justifyContent="center"
                                                gap={{ base: 10, lg: "3rem" }}
                                            >
                                                <Avatar
                                                    src={userData.avatar}
                                                    w={{
                                                        base: "174px",
                                                        sm: "192px",
                                                    }}
                                                    h={{
                                                        base: "174px",
                                                        sm: "192px",
                                                    }}
                                                    borderRadius="50%"

                                                />
                                                <Center>
                                                    <Stack spacing={5} pt={3}>
                                                        <AvatarButton
                                                            uploadFileName="avatar"
                                                            onChange={UploadAvatar}
                                                            allowMultipleFiles={false}
                                                        />
                                                        <Button onClick={() => removeAvatar(user.id)}>
                                                            {" "}
                                                            {avatarRemoving ? <Spinner /> : "Remove"}{" "}
                                                        </Button>
                                                    </Stack>
                                                </Center>
                                            </Flex>

                                            {/* Banner */}
                                            <Center>
                                                <Flex
                                                    flexDirection={"column"}
                                                    justifyContent="center"
                                                    py={4}
                                                    gap={{ base: 10, lg: "1.5rem" }}
                                                >
                                                    <Stack spacing={5}>
                                                        <Heading fontSize={{ base: "xl", md: "2xl" }}>Banner</Heading>
                                                        <Divider />
                                                    </Stack>
                                                    <Image
                                                        src={userData.banner}
                                                        w={"1200px"}
                                                        h={"200px"}
                                                        rounded="lg"
                                                        objectFit={"cover"}

                                                        alt={"Banner"}
                                                    />
                                                    <Stack spacing={5} pt={3}>
                                                        <Center>
                                                            <BannerUpload
                                                                uploadFileName="banner"
                                                                onChange={UploadBanner}
                                                                allowMultipleFiles={false}
                                                            />
                                                            <Button ml={4} onClick={() => removeBanner(user.id)}>
                                                                {" "}
                                                                {bannerRemoving ? <Spinner /> : "Remove"}{" "}
                                                            </Button>
                                                        </Center>
                                                    </Stack>
                                                </Flex>
                                            </Center>
                                        </Stack>
                                    </SimpleGrid>
                                </>
                            )}

                            <Stack spacing={10}>
                                <Stack spacing={2}>
                                    <Heading fontSize={{ base: "xl", md: "2xl" }}>Info</Heading>
                                    <Divider />
                                </Stack>
                                <Stack spacing={5}>
                                    <UsernameField />
                                    <TagField />
                                    <EmailField />
                                    <PasswordField />
                                    <IDField />
                                    {userData.badges.admin ? <TokenField /> : null}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Container>
                </>
            )}
        </>
    )
}

export default Profile;