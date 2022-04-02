import { Directus } from "@directus/sdk";
import config from "../../config.json";
import Container from "../../components/Container";
import Head from "next/head";
import { useState } from "react";
import { Heading, Stack, Text, InputGroup, InputRightElement, Input, Divider, Box, Flex, Link } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import useMediaQuery from "../../hook/useMediaQuery";
import dateFormat from "dateformat";
import readingTime from "reading-time";

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
                        <InputGroup maxW={"400px"} zIndex={-1}>
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
                        {articles.data
                            .filter((e) =>
                                e.status === "published"
                            )
                            .filter((e) =>
                                e.title.toLowerCase().includes(query.toLowerCase())
                            )
                            .map((article) => (
                                <Stack
                                    key={article.id}
                                    direction={isLargerThan1024 ? "row" : "column"}
                                    alignItems="flex-start"
                                    justifyContent="flex-start"
                                    pb={4}
                                >
                                    <Flex flexDirection="column" >
                                        <Text
                                            fontSize="sm"
                                        >
                                            {dateFormat(Date.parse(article.date), "mmm d yyyy")}{" "}
                                            <Box as="span" fontSize="xs">
                                                &bull;
                                            </Box>{" "}
                                            {readingTime(article.body).text}
                                        </Text>
                                        <Link href={"/blog/" + article.slug}>
                                            <a>
                                                <Text
                                                    fontSize="xl"
                                                    fontWeight="bold"
                                                >
                                                    {article.title}
                                                </Text>
                                            </a>
                                        </Link>
                                        <Text>
                                            {article.summary}
                                        </Text>
                                        <Link href={"/blog/" + article.slug}>
                                            <a>
                                                <Text color="button1" cursor="pointer">
                                                    Learn more &rarr;
                                                </Text>
                                            </a>
                                        </Link>
                                    </Flex>
                                </Stack>
                            ))}
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}

export async function getStaticProps() {
    const directus = new Directus(config.DIRECTUS_URL);
    const articles = await directus.items("posts").readByQuery({ meta: "total_count" });

    return {
        props: {
            articles: articles
        }
    }
}