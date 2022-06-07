import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import PostContainer from "../../components/Blog/PostContainer";
import MDXComponents from "../../components/Blog/MDXComponents";
import { Heading, Stack, Text, useColorMode } from "@chakra-ui/react";
import dateFormat from "dateformat"
import Container from "../../components/UI/Container";

export default function Privacy({ metadata, source }) {
    const { colorMode } = useColorMode();
    return (
        <>
            <Container enableTransition={false}>
                <Stack my="15vh" justifyContent="center" alignItems="center">
                    <Stack
                        w={["100vw", "95vw"]}
                        maxW="680px"
                        p={["20px", "20px", "24px", "24px"]}
                    >
                        <Heading fontSize={["3xl", "3xl", "5xl", "5xl"]}>
                            Terms of service
                        </Heading>
                        <Stack
                            py={2}
                            direction={{ base: "column", md: "row" }}
                            alignItems="baseline"
                            justifyContent={"space-between"}
                        >
                            <Stack isInline alignItems={"center"}>
                                <Text fontSize={["xs", "xs", "sm", "sm"]}>
                                    Last updated {" "}
                                    {dateFormat(Date.parse(metadata.date), "mmmm d, yyyy")}
                                </Text>
                            </Stack>
                            <Stack>
                                <Text fontSize={["xs", "xs", "sm", "sm"]}>
                                    {metadata.readingTime}
                                </Text>
                            </Stack>
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
    );
}

let client = require("contentful").createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

export async function getStaticProps() {
    let data = await client.getEntries({
        content_type: "terms",
        order: "sys.createdAt",
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