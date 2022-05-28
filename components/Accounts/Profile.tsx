import {
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Avatar,
  useToast,
  Spinner,
  Center,
  Box,
  Text,
  SimpleGrid,
  VStack,
  Badge,
  Image,
  SkeletonCircle,
  Skeleton
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Container from "../UI/Container";
import supabase from "../../lib/SupabaseClient";
import React from "react";
import { uploadAvatarRequest } from "../../domains/avatars/upload.services"
import { uploadBannerRequest } from "../../domains/banners/upload.services"
import axios from "axios";
import EmailField from "./EmailField";
import UsernameField from "./UsernameField";
import PasswordField from "./PasswordField";
import Identities from "./Identities";
import IDField from "./IDField";
import useMediaQuery from "../../hook/useMediaQuery";
import Badges from "../../components/Accounts/Badges";
import MiniBadges from "./MiniBadges";
import CompactBadges from "./CompactBadges";
import { UserProfile } from "../../types/UserProfile";
import Link from "next/link";
import Navbar from "../UI/Navbar";

function Profile() {
  const user = supabase.auth.user();
  const session = supabase.auth.session();
  const [userData, setUserData] = useState<UserProfile>({} as UserProfile);

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [avatarRemoving, setAvatarRemoving] = useState(false);
  const [bannerRemoving, setBannerRemoving] = useState(false);

  const isLargerThan850 = useMediaQuery(850);
  const isLargerThan1215 = useMediaQuery(1215);
  const isLargerThan1360 = useMediaQuery(1360);
  const isLargerThan500 = useMediaQuery(500);
  const isLargerThan400 = useMediaQuery(400);
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
        session.access_token,
        formData,
        async (event) => {
          console.log(
            `Current progress:`,
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
        session.access_token,
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

  async function removeAvatar(id: string, token: string) {
    try {
      setAvatarRemoving(true);
      const { data } = await axios.put(`/api/avatars/remove?id=${id}&token=${token}`);
      if (data.error) throw data.error;

      toast({
        title: "Success",
        description: "Avatar removed",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setUpdate(true);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message ? err.message : err,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setAvatarRemoving(false);
    }
  }

  async function removeBanner(id: string, token: string) {
    try {
      setBannerRemoving(true);
      const { data } = await axios.put(`/api/banners/remove?id=${id}&token=${token}`);
      if (data.error) throw data.error;

      toast({
        title: "Success",
        description: "Banner removed",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setUpdate(true);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message ? err.message : err,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setBannerRemoving(false);
    }
  }

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




  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
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
          {!userData.badges.admin ? (
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
          ) : (
            <>
              <Container enableTransition={false}>
                <Stack
                  spacing={10}
                  justifyContent="center"
                  my={["10vh", "10vh", "15vh", "15vh"]}
                >
                  {" "}
                  <Flex flexDirection={"column"} gap={5}>
                    <Stack spacing={5}>
                      <Heading fontSize={{ base: "4xl", md: "6xl" }}>Profile</Heading>
                      <Divider />
                    </Stack>
                    <SimpleGrid columns={isLargerThan850 ? 2 : 1} gap={10}>
                      <Stack spacing={5}>
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
                            zIndex={-1}
                          />
                          <Center>
                            <Stack spacing={5} pt={3}>
                              <AvatarButton
                                uploadFileName="avatar"
                                onChange={UploadAvatar}
                                allowMultipleFiles={false}
                              />
                              <Button onClick={() => removeAvatar(user.id, session.access_token)}>
                                {" "}
                                {avatarRemoving ? <Spinner /> : "Remove"}{" "}
                              </Button>
                            </Stack>
                          </Center>
                        </Flex>
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
                              zIndex={-1}
                              alt={"Banner"}
                            />
                            <Stack spacing={5} pt={3}>
                              <Center>
                                <BannerUpload
                                  uploadFileName="banner"
                                  onChange={UploadBanner}
                                  allowMultipleFiles={false}
                                />
                                <Button ml={4} onClick={() => removeBanner(user.id, session.access_token)}>
                                  {" "}
                                  {bannerRemoving ? <Spinner /> : "Remove"}{" "}
                                </Button>
                              </Center>
                            </Stack>
                          </Flex>
                        </Center>
                        <Stack spacing={5}>
                          <Stack spacing={5}>
                            <Heading fontSize={{ base: "xl", md: "2xl" }}>Info</Heading>
                            <Divider />
                          </Stack>
                          <UsernameField />
                          <EmailField />
                          <PasswordField />
                          <IDField />
                        </Stack>
                      </Stack>
                      <Flex flexDirection={"column"}>
                        <Box border={"1px"} borderColor={"black"} rounded={"lg"} pb={4}>
                          <VStack spacing={4}>
                            <Image
                              src={userData.banner}
                              w={"1200px"}
                              h={"200px"}
                              objectFit="cover"
                              alt={"banner"}
                            />
                            <Flex
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center"
                              w={"full"}
                              px={{ base: "1rem", md: "1.5rem", lg: "2rem" }}
                            >
                              <Image
                                src={userData.avatar}
                                rounded="full"
                                w={"128px"}
                                h={"128px"}
                                mt={"-12.5%"}
                                border={"2px"}
                                borderColor={"#111111"}
                                alt={"avatar"}
                              />

                              {/* Mobile view */}
                              {isLargerThan850 ? (
                                <></>
                              ) : (
                                <>
                                  {isLargerThan400 ? (
                                    <>
                                      {isLargerThan500 ? (
                                        <Stack isInline spacing={2}>
                                          <Badges />
                                        </Stack>
                                      ) : (
                                        <SimpleGrid columns={5} spacing={2}>
                                          <MiniBadges />
                                        </SimpleGrid>
                                      )}
                                    </>
                                  ) : (
                                    <SimpleGrid columns={3} spacing={2}>
                                      <CompactBadges />
                                    </SimpleGrid>
                                  )}
                                </>
                              )}

                              {/* Desktop view */}
                              {isLargerThan850 ? (
                                <>
                                  {isLargerThan1360 ? (
                                    <Stack isInline spacing={2} >
                                      <Badges />
                                    </Stack>
                                  ) : (
                                    <>
                                      {isLargerThan1215 ? (
                                        <SimpleGrid columns={5} spacing={2}>
                                          <MiniBadges />
                                        </SimpleGrid>
                                      ) : (
                                        <SimpleGrid columns={3} spacing={2}>
                                          <CompactBadges />
                                        </SimpleGrid>
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}

                            </Flex>
                            <Flex
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center"
                              w={"full"}
                              px={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }}
                            >
                              <Stack spacing={0}>
                                <Text fontSize="26px" fontWeight="bold">
                                  {user.user_metadata.username}
                                  {userData.cutie === true ? (
                                    <Badge ml='2' colorScheme='pink'>
                                      Cutie
                                    </Badge>
                                  ) : <div />}
                                </Text>
                                <Text fontSize="14px">{user.email}</Text>
                              </Stack>
                              <div />
                            </Flex>
                          </VStack>
                        </Box>
                      </Flex>
                    </SimpleGrid >
                    <Stack spacing={5} pt={16}>
                      <Heading fontSize={{ base: "2xl", md: "4xl" }}>Identities</Heading>
                      <Divider />
                    </Stack>
                    <Identities />
                  </Flex >
                </Stack >
              </Container>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Profile;
