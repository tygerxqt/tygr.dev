import { Button, ButtonGroup, Divider, Heading, Stack, Text, SimpleGrid, Box, Avatar, useToast, Spinner, Center, Flex } from "@chakra-ui/react";
import axios from "axios";
import supabase from "../../lib/SupabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";
import { createClient } from "contentful";
import PremiumContainer from "../../components/Accounts/PremiumContainer";
import PostCard from "../../components/Accounts/Feed/PostCard";
import Head from "next/head";
import { useEffect, useState } from "react";
import { UserProfile } from "../../types/Account/UserProfile";
import useMediaQuery from "../../hook/useMediaQuery";

export default function Dashboard({ posts }) {
    const session = supabase.auth.session();
    const router = useRouter();
    const toast = useToast();

    const isLargerThan768 = useMediaQuery(768);

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile>({} as UserProfile);

    const loadPortal = async () => {
        await axios.get(`/api/billing/portal?redirect=dashboard`).then(res => {
            router.push(res.data.data);
        }).catch(err => {
            console.log(err.response.data.error);
        });
    }

    async function loadGithub() {
        await axios.get(`/api/github/invite`).then(response => {
            if (response.data.redirect) {
                router.push(response.data.redirect);
            } else {
                toast({
                    title: "Success!",
                    description: response.data.data,
                    status: "success",
                    duration: 9000,
                    isClosable: true
                });
            }
        }).catch(error => {
            toast({
                title: "Error!",
                description: error.response.data.error,
                status: "error",
                duration: 9000,
                isClosable: true
            });
        })
    }

    useEffect(() => {
        async function fetch() {
            if (!supabase.auth.session()) {
                return setLoading(false);
            }
            await axios.get(`/api/users/${supabase.auth.user().id}`).then(response => {
                setUserData(response.data);
                setLoading(false);
            }).catch(error => {
                console.log(error.response.data.error);
                toast({
                    title: "Error",
                    description: error.response.data.error,
                    status: "error",
                    duration: 9000,
                    isClosable: true
                });
            });
        }

        fetch();
    }, [toast, loading])

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
                    <PremiumContainer>
                        <Head>
                            <title>Dashboard</title>
                        </Head>
                        <SimpleGrid columns={[1, 1, 2, 2]} spacing={20} my={["10vh", "10vh", "15vh", "15vh"]}>
                            <Stack spacing={10}>
                                <Stack spacing={5}>
                                    <Heading fontSize={{ base: "4xl", md: "6xl" }}>Dashboard</Heading>
                                    <Divider />
                                    <Text fontSize={{ base: "md", md: "lg" }}>
                                        Welcome to your dashboard. Here you can view your account information, and manage your subscription.
                                    </Text>
                                </Stack>
                                <Stack spacing={5}>
                                    <Heading fontSize={{ base: "2xl", md: "4xl" }}>Rewards</Heading>
                                    <Text fontSize={{ base: "md", md: "lg" }}>
                                        Manage and claim your rewards here.
                                    </Text>
                                    <ButtonGroup spacing={5} >
                                        <Link href={"/projects/beta"} passHref>
                                            <Button>
                                                Early access
                                            </Button>
                                        </Link>
                                        <Link href={"/projects/vault"} passHref>
                                            <Button>
                                                Project vault
                                            </Button>
                                        </Link>
                                    </ButtonGroup>
                                    <ButtonGroup spacing={5}>
                                        <Link href={"/photography"} passHref>
                                            <Button>
                                                Photograhy library
                                            </Button>
                                        </Link>
                                        <Button onClick={() => loadGithub()}>
                                            Github repos
                                        </Button>
                                    </ButtonGroup>
                                </Stack>
                                <Stack spacing={5}>
                                    <Heading fontSize={{ base: "2xl", md: "4xl" }}>Account</Heading>
                                    <Text fontSize={{ base: "md", md: "lg" }}>
                                        Manage your customer and subscription information here.
                                    </Text>
                                    <ButtonGroup spacing={5}>
                                        <Button onClick={() => loadPortal()}>
                                            Manage Subscription
                                        </Button>
                                    </ButtonGroup>
                                </Stack>
                            </Stack>
                            <Stack spacing={10}>
                                <Stack spacing={5}>
                                    <Heading fontSize={{ base: "4xl", md: "6xl" }}>Feed</Heading>
                                    <Divider />
                                    <Text fontSize={{ base: "md", md: "lg" }}>
                                        Updates on projects, and other Pixel related news.
                                    </Text>
                                </Stack>
                                <Stack spacing={5}>
                                    {posts.map((post) => (
                                        <>
                                            <PostCard post={post} />
                                        </>
                                    ))}

                                </Stack>
                            </Stack>
                        </SimpleGrid>
                    </PremiumContainer>
                </>
            )}
        </>
    )
}


const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getStaticProps() {
    let data = await client.getEntries({
        content_type: "feedPost",
        limit: 3,
        order: "sys.createdAt",
        "fields.archived": false,
    });

    return {
        props: {
            posts: data.items.reverse(),
        },
    };
}
