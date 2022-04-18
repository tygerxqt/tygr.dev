import { Button, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useCallback, useState } from "react";
import Container from "../UI/Container";
import supabase from "./SupabaseClient";
import updateProfile from "./updateProfile";

function Profile() {
    const user = supabase.auth.user();

    const handleSignout = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    return (
        <>
            <Container enableTransition={false}>
                <Head>
                    <title>Projects</title>
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
                        <Text fontSize={{ base: "16px", md: "18px" }}>
                            ID: {user.id}
                        </Text>
                        <Text fontSize={{ base: "16px", md: "18px" }}>
                            Username: {user.user_metadata.username}
                        </Text>
                        <Text fontSize={{ base: "16px", md: "18px" }}>
                            Email: {user.email}
                        </Text>
                        <Button variant={"solid"} onClick={() => handleSignout()}>
                            Sign out
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}

export default Profile;