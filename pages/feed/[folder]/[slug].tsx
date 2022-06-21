import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import PostContainer from "../../../components/Blog/PostContainer";
import MDXComponents from "../../../components/Blog/MDXComponents";
import { Avatar, Heading, Stack, Text, Image, useColorMode } from "@chakra-ui/react";
import dateFormat from "dateformat"
import PremiumContainer from "../../../components/Accounts/PremiumContainer";
import Head from "next/head";
import FeedComments from "../../../components/Accounts/Feed/FeedComments";

export default function FeedPost({ metadata, source }) {
    const { colorMode } = useColorMode();
    return (
        <>
            <PremiumContainer>
                <Head>
                    <title>Feed / {metadata.fields.title}</title>
                </Head>
                <Stack mt="15vh" justifyContent="center" alignItems="center">
                    <Stack
                        w={["100vw", "95vw"]}
                        maxW="680px"
                        p={["20px", "20px", "24px", "24px"]}
                    >
                        <Heading fontSize={["3xl", "3xl", "5xl", "5xl"]}>
                            {metadata.fields.title}
                        </Heading>
                        <Stack
                            py={2}
                            direction={{ base: "column", md: "row" }}
                            alignItems="baseline"
                            justifyContent={"space-between"}
                        >
                            <Stack isInline alignItems={"center"}>
                                <Avatar
                                    name="tygerxqt"
                                    size="xs"
                                    src="https://avatars.githubusercontent.com/u/59417077?v=4"
                                />
                                <Text fontSize={["xs", "xs", "sm", "sm"]}>
                                    tygerxqt /{" "}
                                    {dateFormat(Date.parse(metadata.fields.date), "mmmm d, yyyy")}
                                </Text>
                            </Stack>
                            <Stack>
                                <Text fontSize={["xs", "xs", "sm", "sm"]}>
                                    {metadata.fields.readingTime}
                                </Text>
                            </Stack>
                        </Stack>
                        <Stack
                            borderRadius={"10px"}
                            minH="200px"
                            border="1px"
                            borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
                        >
                            <Image
                                src={"https:" + metadata.fields.hero.fields.file.url}
                                borderRadius="10px"
                                width={1366}
                                height={892}
                                w="auto"
                                h="auto"
                                mx="auto"
                                alt=""
                            ></Image>
                        </Stack>
                        <Stack spacing={20}>
                            {colorMode === "light" ? (
                                <>
                                    <PostContainer.light>
                                        <MDXRemote {...source} components={MDXComponents} />
                                    </PostContainer.light>
                                </>
                            ) : (
                                <>
                                    <PostContainer.dark>
                                        <MDXRemote {...source} components={MDXComponents} />
                                    </PostContainer.dark>
                                </>
                            )}
                            <FeedComments metadata={metadata} />
                        </Stack>
                    </Stack>
                </Stack>
            </PremiumContainer>
        </>
    );
}

let client = require("contentful").createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

export async function getStaticPaths() {
    let data = await client.getEntries({
        content_type: "feedPost",
        "fields.archived": false,
    });

    return {
        paths: data.items.map((item) => ({
            params: {
                folder: item.fields.folder,
                slug: item.fields.slug
            }
        })),
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    let data = await client.getEntries({
        content_type: "feedPost",
        "fields.slug": params.slug,
        "fields.folder": params.folder,
        "fields.archived": false
    });

    const article = data.items[0];
    const source = article.fields.body;
    article.fields.readingTime = readingTime(source).text;
    const mdxSource = await serialize(source);

    return {
        props: {
            metadata: article,
            source: mdxSource
        }
    }
}