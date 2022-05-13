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
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import Container from "../UI/Container";
import supabase from "../../lib/SupabaseClient";
import React from "react";
import { uploadFileRequest } from "../../domains/upload.services";
import axios from "axios";
import EmailField from "./EmailField";
import UsernameField from "./UsernameField";
import PasswordField from "./PasswordField";
import Identities from "./Identities";

function Profile() {
  const user = supabase.auth.user();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [removing, setRemoving] = useState(false);

  const [token, setToken] = useState(null);

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
      const response = await uploadFileRequest(
        user.id,
        token,
        formData,
        async (event) => {
          console.log(
            `Current progress:`,
            Math.round((event.loaded * 100) / event.total)
          );
          setProgress(Math.round((event.loaded * 100) / event.total));
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
    } finally {
      setUploading(false);
    }
  };

  async function removeAvatar(id: string, token: string) {
    try {
      setRemoving(true);
      await axios.put(`/api/avatars/remove?id=${id}&token=${token}`);

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
      {console.log(user.id)}
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
                  <UiFileInputButton
                    uploadFileName="upload"
                    onChange={UploadAvatar}
                  />
                  <Button onClick={() => removeAvatar(user.id, token)}>
                    {" "}
                    {removing ? <Spinner /> : "Remove"}{" "}
                  </Button>
                </Stack>
              </Center>
            </Flex>
            <UsernameField />
            <EmailField />
            <PasswordField />
            <Stack spacing={5} pt={16}>
              <Heading fontSize={{ base: "2xl", md: "4xl" }}>Identities</Heading>
              <Divider />
            </Stack>
            <Identities />
          </Flex>
        </Stack>
      </Container>
    </>
  );
}

export default Profile;
