import Container from "../../components/UI/Container";
import Head from "next/head";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import PostContainer from "../../components/Blog/PostContainer";
import MDXComponents from "../../components/Blog/MDXComponents";
import { Avatar, Heading, Stack, Text, Image, useColorMode, Box, Divider, Flex, IconButton, useToast, ButtonGroup, Button, Textarea } from "@chakra-ui/react";
import dateFormat from "dateformat"
import BlogComments from "../../components/Blog/BlogCommments";

function Post({ metadata, source }) {
    const { colorMode } = useColorMode();

    return (
        <>
            <Container enableTransition={false}>
                <Head>
                    <title>{metadata.fields.title}</title>
                    <meta name="title" content={metadata.fields.title} />
                    <meta property="og:site_name" content="tygr.dev" />
                    <meta name="description" content={metadata.fields.summary} />

                    <meta property="og:type" content="website" />
                    <meta
                        property="og:url"
                        content={`https://tygr.dev/blog/${metadata.fields.slug}`}
                    />
                    <meta property="og:title" content={metadata.fields.title} />
                    <meta property="og:description" content={metadata.fields.summary} />
                    <meta property="og:image" content={metadata.fields.image.fields.file.url} />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta
                        property="twitter:url"
                        content={`https://tygr.dev/blog/${metadata.fields.slug}`}
                    />
                    <meta property="twitter:title" content={metadata.fields.title} />
                    <meta property="twitter:description" content={metadata.fields.summary} />
                    <meta property="twitter:image" content={metadata.fields.image} />
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
                                src={"https:" + metadata.fields.image.fields.file.url}
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
                            <BlogComments metadata={metadata} />
                        </Stack>
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

export default Post;