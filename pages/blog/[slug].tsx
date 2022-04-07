import Container from "../../components/Container";
import Head from "next/head";
import { Directus } from "@directus/sdk";
import config from "../../config.json";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import PostContainer from "../../components/PostContainer";
import MDXComponents from "../../components/MDXComponents";
import { Avatar, Heading, Stack, Text, Image, Flex, useColorMode } from "@chakra-ui/react";
import dateFormat from "dateformat"

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
                                src={config.DIRECTUS_URL + "/assets/" + metadata.hero_image}
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
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}

let directus = new Directus(config.DIRECTUS_URL);

export async function getStaticPaths() {
    let posts = await directus.items("posts").readByQuery({
        meta: "total_count"
    });
    return {
        paths: posts.data.map((item: any) => ({
            params: { slug: item.slug }
        })),
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    let posts = await directus.items("posts").readByQuery({
        search: params.slug
    });

    const article: any = posts.data[0]
    const source = article.body;
    article.readingTime = readingTime(source).text;
    const mdxSource = await serialize(source);

    return {
        props: {
            metadata: article,
            source: mdxSource
        }
    };
}

export default Post;