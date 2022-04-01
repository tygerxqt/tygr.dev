import { Directus } from "@directus/sdk";
import config from "../../config.json";
import Container from "../../components/Container";
import Head from "next/head";
import { useState } from "react";
import { Heading, Stack, Text, InputGroup, InputRightElement, Input, Divider, Box, Flex, Link } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import useMediaQuery from "../../hook/useMediaQuery";

export default function IndexBlog({ articles }) {
    const [query, setQuery] = useState("");
    const handleChange = (e) => {
        setQuery(e.target.value);
    }

    const isLargerThan1024 = useMediaQuery(1024);

    return (
        <>
            <Container enableTransition={false}>
                <Head>
                    <title>Blog</title>
                </Head>
                <Stack
                    spacing={10}
                    justifyContent="center"
                    my={["10vh", "10vh", "15vh", "15vh"]}
                >
                    <Stack spacing={5}>
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                            Blog
                        </Heading>
                        <Text fontSize={{ base: "14px", md: "16px" }}>
                            This is where I share my writings on programming, tutorials, and my
                            experiences.
                        </Text>
                        <InputGroup maxW={"400px"}>
                            <InputRightElement pointerEvents={"none"}>
                                <FaSearch />
                            </InputRightElement>
                            <Input
                                type="text"
                                placeholder={"Search articles"}
                                value={query}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <Divider />
                        <Stack spacing={5}>

                            <Stack
                                direction={isLargerThan1024 ? "row" : "column"}
                                alignItems={"flex-start"}
                                justifyContent={"flex-start"}
                            >
                                <Text
                                    display={isLargerThan1024 ? "block" : "none"}
                                >
                                    DATE
                                    <br />{" "}
                                    <Text fontSize="sm" textAlign="right">
                                        TIME
                                    </Text>
                                </Text>
                                <Text
                                    fontSize={"sm"}
                                    display={isLargerThan1024 ? "none" : "block"}
                                >
                                    DATE{" "}
                                    <Box as="span" fontSize="xs">
                                        &bull;
                                    </Box>{" "}
                                    TIME
                                </Text>
                                <Flex flexDirection="column" px={isLargerThan1024 ? 10 : 0}>
                                    <Link href={"/blog/"}>
                                        <a>
                                            <Text
                                                fontSize="xl"
                                                fontWeight={"bold"}
                                                cursor="pointer"
                                            >
                                                TITLE
                                            </Text>
                                            <Text>
                                                SUMMARY
                                            </Text>

                                            <Text cursor={"pointer"}>
                                                Learn more &rarr;
                                            </Text>
                                        </a>
                                    </Link>
                                </Flex>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}

export async function getStaticProps() {
    const directus = new Directus(config.DIRECTUS_URL);
    const articles = await directus.items("posts").readByQuery({ meta: "total_count" });

    console.log(articles);

    return {
        props: {
            articles: articles
        }
    }
}