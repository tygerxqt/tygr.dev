import { Stack, Heading, Divider, Text, Code } from "@chakra-ui/react";
import { createClient } from "contentful";
import PostCard from "../../../components/Accounts/Feed/PostCard";
import PremiumContainer from "../../../components/Accounts/PremiumContainer";
import { useRouter } from "next/router";

export default function Feed({ posts }) {
    const router = useRouter();
    return (
        <>
            <PremiumContainer>
                <Stack spacing={10} my={["10vh", "10vh", "15vh", "15vh"]}>
                    <Stack spacing={5}>
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>Feed / {router.query.folder}</Heading>
                        <Divider />
                        <Text fontSize={{ base: "md", md: "lg" }}>
                            All the feed entires in the <Code>/{router.query.folder}</Code> directory.
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
        content_type: "feedPost"
    });
    return {
        paths: data.items.map((item) => ({
            // @ts-ignore
            params: { folder: item.fields.folder }
        })),
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    let data = await client.getEntries({
        content_type: "feedPost",
        order: "sys.createdAt",
        "fields.folder": params.folder,
        "fields.archived": false
    });

    return {
        props: {
            posts: data.items.reverse(),
        }
    }
}
