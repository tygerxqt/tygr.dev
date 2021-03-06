import Container from "../../components/UI/Container";
import Head from "next/head";
import { useState } from "react";
import {
  Heading,
  Stack,
  Text,
  InputGroup,
  InputRightElement,
  Input,
  Divider,
  Box,
  Flex,
  Link,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import useMediaQuery from "../../hook/useMediaQuery";
import dateFormat from "dateformat";
import readingTime from "reading-time/lib/reading-time";
import { createClient } from "contentful";

export default function IndexBlog({ articles }) {
  const [query, setQuery] = useState("");
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const isLargerThan1024 = useMediaQuery(1024);
  let projectTot = 0;

  return (
    <>
      <Container enableTransition={false}>
        <Head>
          <title>Blog</title>
          <meta name="title" content="Blog" />
          <meta
            name="description"
            content="Writings on programming, tutorials, and my experiences."
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://tygr.dev/blog" />
          <meta property="og:title" content="Blog." />
          <meta
            property="og:description"
            content="Writings on programming, tutorials, and my experiences."
          />
          <meta property="og:image" content="https://i.imgur.com/7hLIhHt.png" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://tygr.dev/blog" />
          <meta property="twitter:title" content="Blog." />
          <meta
            property="twitter:description"
            content="Writings on programming, tutorials, and my experiences."
          />
          <meta
            property="twitter:image"
            content="https://i.imgur.com/7hLIhHt.png"
          />
        </Head>
        <Stack
          spacing={10}
          justifyContent="center"
          my={["10vh", "10vh", "15vh", "15vh"]}
        >
          <Stack spacing={5}>
            <Heading fontSize={{ base: "4xl", md: "6xl" }}>Blog</Heading>
            <Text fontSize={{ base: "14px", md: "16px" }}>
              This is where I share my writings on programming, tutorials, and
              my experiences.
            </Text>
            <InputGroup maxW={"400px"}  >
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
            {articles
              .filter((e) =>
                e.fields.title.toLowerCase().includes(query.toLowerCase())
              )
              .map((article) => (
                <Stack
                  key={projectTot++}
                  direction={isLargerThan1024 ? "row" : "column"}
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  border={"1px"}
                  borderColor={"#242424"}
                  rounded={"xl"}
                  p={4}
                >
                  <Flex flexDirection="column">
                    <Text fontSize="sm">
                      {dateFormat(
                        Date.parse(article.fields.date),
                        "mmm d yyyy"
                      )}{" "}
                      <Box as="span" fontSize="xs">
                        &bull;
                      </Box>{" "}
                      {readingTime(article.fields.body).text}
                    </Text>
                    <Link href={"/blog/" + article.fields.slug}>
                      <a>
                        <Text fontSize="xl" fontWeight="bold">
                          {article.fields.title}
                        </Text>
                      </a>
                    </Link>
                    <Text>{article.fields.summary}</Text>
                    <Link href={"/blog/" + article.fields.slug}>
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
  );
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getStaticProps() {
  let data = await client.getEntries({
    content_type: "post",
    "fields.archived": false,
    order: "sys.createdAt",
  });

  return {
    props: {
      articles: data.items.reverse(),
    },
  };
}
