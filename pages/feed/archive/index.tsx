import { Stack, Heading, Divider, Text } from "@chakra-ui/react";
import { createClient } from "contentful";
import ArchivedPostCard from "../../../components/Accounts/Feed/ArchivedPostCard";
import PremiumContainer from "../../../components/Accounts/PremiumContainer";

export default function Feed({ posts }) {
    return (
        <>
            <PremiumContainer>
                <Stack spacing={10} my={["10vh", "10vh", "15vh", "15vh"]}>
                    <Stack spacing={5}>
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>Feed Archive</Heading>
                        <Divider />
                        <Text fontSize={{ base: "md", md: "lg" }}>
                            Archived Updates on projects, and other Archived Pixel related news.
                        </Text>
                    </Stack>
                    <Stack spacing={5}>
                        {posts.map((post) => (
                            <>
                                <ArchivedPostCard post={post} />
                            </>
                        ))}
                    </Stack>
                </Stack>
            </PremiumContainer>
        </>
    );
}

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getServerSideProps() {
    let data = await client.getEntries({
        content_type: "feedPost",
        order: "sys.createdAt",
        "fields.archived": true,
    });

    return {
        props: {
            posts: data.items.reverse(),
        },
    };
}
