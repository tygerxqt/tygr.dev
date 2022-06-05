import { Button, ButtonGroup, Center, Divider, Flex, Heading, Spinner, Stack, Text, VisuallyHidden } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import Container from "../../components/UI/Container";
import Navbar from "../../components/UI/Navbar";
import useMediaQuery from "../../hook/useMediaQuery";
import supabase from "../../lib/SupabaseClient";
import { UserProfile } from "../../types/UserProfile";
import { useRouter } from "next/router";

export default function Dashboard() {
    const session = supabase.auth.session();
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile>({} as UserProfile);

    const isLargerThan768 = useMediaQuery(768);
    const router = useRouter();

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            const { data, status: dataStatus } = await axios.get(`/api/users/${user.id}?token=${session.access_token}`);
            if (dataStatus != 200) throw new Error(data.message);
            setUserData(data as UserProfile);
            setLoading(false);
            setUpdate(false);
        }

        if (session) {
            fetch();
        } else {
            setLoading(false);
        }
    }, [update]);

    const loadPortal = async () => {
        await axios.get(`/api/billing/portal?token=${session.access_token}`).then(res => {
            router.push(res.data.data);
        }).catch(err => {
            console.log(err.response.data.error);
        });
    }

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
                    {!userData.badges.pixel ? (
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
                                    <title>Dashboard</title>
                                </Head>
                                <Stack spacing={10} justifyContent="center" my={["10vh", "10vh", "15vh", "15vh"]}>
                                    <Stack spacing={5}>
                                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>Dashboard</Heading>
                                        <Divider />
                                        <Text fontSize={{ base: "md", md: "lg" }}>
                                            Welcome to your dashboard. Here you can view your account information, and manage your subscription.
                                        </Text>
                                    </Stack>
                                    {/* <Stack spacing={5}>
                                        <Heading fontSize={{ base: "2xl", md: "4xl" }}>Rewards</Heading>
                                        <Text fontSize={{ base: "md", md: "lg" }}>
                                            Manage and claim your rewards here.
                                        </Text>
                                        <ButtonGroup>
                                            <Button colorScheme="blue" variant="outline">
                                                Manage Subscription
                                            </Button>
                                        </ButtonGroup>
                                    </Stack> */}
                                    <Stack spacing={5}>
                                        <Heading fontSize={{ base: "2xl", md: "4xl" }}>Account</Heading>
                                        <Text fontSize={{ base: "md", md: "lg" }}>
                                            Manage your customer and subscription information here.
                                        </Text>
                                        <ButtonGroup spacing={5}>
                                            <Button onClick={() => loadPortal()}>
                                                Manage Subscription
                                            </Button>
                                            <Button>
                                                Edit customer
                                            </Button>
                                        </ButtonGroup>
                                    </Stack>
                                </Stack>
                            </Container>
                        </>
                    )}
                </>
            )}
        </>
    );
}