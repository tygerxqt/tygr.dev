import { Button, ButtonGroup, Divider, Heading, Stack, Text, SimpleGrid, Box, Avatar } from "@chakra-ui/react";
import axios from "axios";
import supabase from "../../lib/SupabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";
import { createClient } from "contentful";
import PremiumContainer from "../../components/Accounts/PremiumContainer";
import PostCard from "../../components/Accounts/Feed/PostCard";

export default function Dashboard({ posts }) {
    const session = supabase.auth.session();
    const router = useRouter();
    const loadPortal = async () => {
        await axios.get(`/api/billing/portal?token=${session.access_token}&redirect=dashboard`).then(res => {
            router.push(res.data.data);
        }).catch(err => {
            console.log(err.response.data.error);
        });
    }

    return (
        <>
            <PremiumContainer>
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
                                <Button>
                                    Early access
                                </Button>
                                <Button>
                                    Project vault
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup spacing={5}>
                                <Button>
                                    Photograhy library
                                </Button>
                                <Button>
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
