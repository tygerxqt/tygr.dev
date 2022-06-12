import { Flex, Center, Stack, Spinner, Text, VisuallyHidden } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useState, useEffect } from "react";
import useMediaQuery from "../../hook/useMediaQuery";
import supabase from "../../lib/SupabaseClient";
import { UserProfile } from "../../types/Account/UserProfile";
import Container from "../UI/Container";
import Navbar from "../UI/Navbar";

export default function PremiumContainer({ children }) {
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile>({} as UserProfile);
    const isLargerThan768 = useMediaQuery(768);

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            try {
                await axios.get(`/api/users/${user.id}`).then(response => {
                    setUserData(response.data as UserProfile)
                }).catch(error => {
                    throw new Error(error.response.data.error);
                });
            } catch (err) {
                throw err;
            } finally {
                setLoading(false);
                setUpdate(false);
            }
        }

        if (session) {
            fetch();
        } else {
            setLoading(false);
        }

    }, [update]);
    return (
        <>
            {loading ? (
                <>
                    <Navbar enableTransition={false} />
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
                                        Checking subscription status...
                                    </Text>
                                </Center>
                            </Stack>
                        </Center>
                    </Flex>
                </>
            ) : (
                <>
                    {!userData.pixel ? (
                        <>
                            <Navbar enableTransition={false} />
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
                                                Redirecting...
                                            </Text>
                                            <VisuallyHidden>
                                                {window.location.href = "/pixels"}
                                            </VisuallyHidden>
                                        </Center>
                                    </Stack>
                                </Center>
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Container enableTransition={false}>
                                <Head>
                                    <meta name="title" content="Log in" />
                                    <meta
                                        name="description"
                                        content="Log in to your Pixel account to see this page."
                                    />

                                    <meta property="og:type" content="website" />
                                    <meta property="og:url" content="https://www.tygr.dev/profile" />
                                    <meta property="og:title" content="tygerxqt" />
                                    <meta
                                        property="og:description"
                                        content="Log in to your Pixel account to see this page."
                                    />
                                    <meta property="og:image" content="https://images.ctfassets.net/547zkxycwgvr/4JPYvu5J5MXi5G4MpHF5qH/1f47ef5e0fee9dd8a23882cc716d1486/PixelSEO.png" />

                                    <meta property="twitter:card" content="summary_large_image" />
                                    <meta property="twitter:url" content="https://tygr.dev/profile" />
                                    <meta property="twitter:title" content="tygerxqt" />
                                    <meta
                                        property="twitter:description"
                                        content="Log in to your Pixel account to see this page."
                                    />
                                    <meta
                                        property="twitter:image"
                                        content="https://images.ctfassets.net/547zkxycwgvr/4JPYvu5J5MXi5G4MpHF5qH/1f47ef5e0fee9dd8a23882cc716d1486/PixelSEO.png"
                                    />
                                </Head>
                                {children}
                            </Container>
                        </>
                    )}
                </>
            )}
        </>
    )
}