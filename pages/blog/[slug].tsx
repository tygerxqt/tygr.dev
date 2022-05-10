import Container from "../../components/UI/Container";
import Head from "next/head";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import PostContainer from "../../components/Blog/PostContainer";
import MDXComponents from "../../components/Blog/MDXComponents";
import { Avatar, Heading, Stack, Text, Image, Flex, useColorMode } from "@chakra-ui/react";
import dateFormat from "dateformat"
import { MDXEmbedProvider } from "mdx-embed";

function Post({ metadata, source }) {
    const { colorMode } = useColorMode();
    return (
        <>
            <Container enableTransition={false}>
                <Head>
                    <title>{metadata.title}</title>
                </Head>
                <Stack my="15vh" justifyContent="center" alignItems="center">
                    <Stack
                        w={["100vw", "95vw"]}
                        maxW="680px"
                        p={["20px", "20px", "24px", "24px"]}
                    >
                        <Heading fontSize={["3xl", "3xl", "5xl", "5xl"]}>
                            {metadata.title}
                        </Heading>
                        <Stack
                            py={4}
                            direction={{ base: "column", md: "row" }}
                            alignItems="baseline"
                            justifyContent={"space-between"}
                        >
                            <Stack isInline alignItems={"center"}>
                                <Avatar
                                    name="tygerxqt"
                                    size="xs"
                                    src="https://avatars.githubusercontent.com/u/59417077?v=4"
                                    zIndex={-1}
                                />
                                <Text fontSize={["xs", "xs", "sm", "sm"]}>
                                    tygerxqt /{" "}
                                    {dateFormat(Date.parse(metadata.date), "mmmm d, yyyy")}
                                </Text>
                            </Stack>
                            <Stack>
                                <Text fontSize={["xs", "xs", "sm", "sm"]}>
                                    {metadata.readingTime}
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
                                src={"https:" + metadata.image.fields.file.url}
                                borderRadius="10px"
                                width={1366}
                                height={892}
                                placeholder="blur"
                                w="auto"
                                h="auto"
                                mx="auto"
                                alt=""
                            ></Image>
                        </Stack>
                        {colorMode === "light" ? (
                            <>
                                <MDXEmbedProvider>
                                    <PostContainer.light>
                                        <MDXRemote {...source} components={MDXComponents} />
                                    </PostContainer.light>
                                </MDXEmbedProvider>
                            </>
                        ) : (
                            <>
                                <MDXEmbedProvider>
                                    <PostContainer.dark>
                                        <MDXRemote {...source} components={MDXComponents} />
                                    </PostContainer.dark>
                                </MDXEmbedProvider>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}

let client = require("contentful").createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

export async function getStaticPaths() {
    let data = await client.getEntries({
        content_type: "post"
    });
    return {
        paths: data.items.map((item) => ({
            params: { slug: item.fields.slug }
        })),
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    let data = await client.getEntries({
        content_type: "post",
        "fields.slug": params.slug
    });

    const article = data.items[0].fields;
    const source = article.body;
    article.readingTime = readingTime(source).text;
    const mdxSource = await serialize(source);

    return {
        props: {
            metadata: article,
            source: mdxSource
        }
    }
}

export default Post;