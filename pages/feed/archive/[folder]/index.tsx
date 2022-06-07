import { Stack, Heading, Divider, Text, Code, Button, ButtonGroup } from "@chakra-ui/react";
import { createClient } from "contentful";
import PremiumContainer from "../../../../components/Accounts/PremiumContainer";
import { useRouter } from "next/router";
import ArchivedPostCard from "../../../../components/Accounts/Feed/ArchivedPostCard";
import Head from "next/head";
import Link from "next/link";

export default function Feed({ posts }) {
    const router = useRouter();
    return (
        <>
            <PremiumContainer>
                <Head>
                    <title>Feed / Archive / {router.query.folder}</title>
                </Head>
                <Stack spacing={10} my={["10vh", "10vh", "15vh", "15vh"]}>
                    <Stack spacing={5}>
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>Feed / {router.query.folder}</Heading>
                        <Divider />
                        <Text fontSize={{ base: "md", md: "lg" }}>
                            All the feed entires in the <Code>/{router.query.folder}</Code> directory.
                        </Text>
                        <ButtonGroup>
                            <Link href={`/feed/${router.query.folder}`} passHref>
                                <Button>
                                    Back to /feed/{router.query.folder}
                                </Button>
                            </Link>
                        </ButtonGroup>
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

export async function getStaticPaths(context) {
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
        "fields.archived": true
    });

    return {
        props: {
            posts: data.items.reverse(),
        }
    }
}
