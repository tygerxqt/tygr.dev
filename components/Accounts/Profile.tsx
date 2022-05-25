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
  Input,
  Box,
  Text,
  SimpleGrid,
  VStack,
  useColorMode,
  Badge,
  color,
  Image,
  Spacer,
  Skeleton
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
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

function Profile() {
  const user = supabase.auth.user();
  const toast = useToast();

  const [avatarRemoving, setAvatarRemoving] = useState(false);
  const [bannerRemoving, setBannerRemoving] = useState(false);
  const [token, setToken] = useState(null);

  const isLargerThan850 = useMediaQuery(850);
  const isLargerThan1215 = useMediaQuery(1215);
  const isLargerThan1360 = useMediaQuery(1360);
  const isLargerThan500 = useMediaQuery(500);
  const isLargerThan400 = useMediaQuery(400);

  // set server cookie
  axios.post("/api/auth/cookie/set", {
    event: user ? "SIGNED_IN" : "SIGNED_OUT",
    session: supabase.auth.session(),
  });

  useEffect(() => {
    const value = localStorage.getItem("supabase.auth.token");
    const token = !!value
      ? JSON.parse(value).currentSession.access_token
      : null;
    setToken(token);
  }, []);

  interface IProps {
    acceptedFileTypes?: string;
    allowMultipleFiles?: boolean;
    onChange: (formData: FormData) => void;
    uploadFileName: string;
  }

  const AvatarButton: React.FC<IProps> = (props) => {
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
        <Button
          type="button"
          onClick={onClickHandler}
          colorScheme="blue"
          variant="outline"
        >
          {uploading ? <Spinner /> : "Upload"}
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
        token,
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

      const { error: metadataError } = await supabase.auth.update({
        data: {
          avatar: `${process.env.NEXT_PUBLIC_URL}/api/avatars/${response.data[0]}`,
        },
      });

      if (metadataError) throw error;
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
        <Button
          type="button"
          onClick={onClickHandler}
          colorScheme="blue"
          variant="outline"
        >
          {uploading ? <Spinner /> : "Upload"}
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
        token,
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
          banner: `${process.env.NEXT_PUBLIC_URL}/api/banners/${response.data[0]}`,
        })
        .eq("id", user.id);
      if (error) throw error;

      const { error: metadataError } = await supabase.auth.update({
        data: {
          banner: `${process.env.NEXT_PUBLIC_URL}/api/banners/${response.data[0]}`,
        },
      });

      if (metadataError) throw error;
    } catch (err) {
      toast({
        title: "Error",
        description: err,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
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

  return (
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
                    src={user.user_metadata.avatar}
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
                      />
                      <Button onClick={() => removeAvatar(user.id, token)}>
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
                      src={user.user_metadata.banner}
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
                        />
                        <Button ml={4} onClick={() => removeBanner(user.id, token)}>
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
                  <VStack spacing={5}>
                    <Image
                      src={user.user_metadata.banner}
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
                        src={user.user_metadata.avatar}
                        rounded="full"
                        w={"128px"}
                        h={"128px"}
                        mt={"-20%"}
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
                          {user.user_metadata.cutie === true ? (
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
                  {/* Optional Buttons */}
                  {/* <Center>
                    <SimpleGrid
                      columns={1}
                      spacing={5}
                      mt={{ base: "6vw", sm: "4vw", md: "2vw" }}
                    >
                      <Button as="a" variant="solid" fontSize="16px">
                        Beta Base
                      </Button>
                    </SimpleGrid>
                  </Center> */}
                </Box>
              </Flex>
            </SimpleGrid>
            <Stack spacing={5} pt={16}>
              <Heading fontSize={{ base: "2xl", md: "4xl" }}>Identities</Heading>
              <Divider />
            </Stack>
            <Identities />
          </Flex>
        </Stack>
      </Container >
    </>
  );
}

export default Profile;
