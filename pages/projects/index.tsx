import { Heading, Input, InputGroup, InputRightElement, Stack, Text, Divider, SimpleGrid } from "@chakra-ui/react";
import { Directus } from "@directus/sdk";
import Head from "next/head";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Container from "../../components/Container";
import config from "../../config.json";

export default function ProjectPage({ projects }) {
    const [query, setQuery] = useState("");
    const handleChange = (e) => {
        setQuery(e.target.value);
    };


    return (
        <>
            <Container enableTransition={false}>
                <Head>
                    <title>Projects</title>
                </Head>
                <Stack
                    spacing={10}
                    justifyContent="center"
                    my={["15vh", "15vh", "22.5vh", "22.5vh"]}
                >
                    <Stack spacing={5}>
                        {" "}
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                            Projects
                        </Heading>
                        <Text fontSize={{ base: "14px", md: "16px" }}>
                            A full list of all projects I have created or worked on.
                        </Text>
                        <InputGroup maxW={"400px"}>
                            <InputRightElement pointerEvents={"none"} children={<FaSearch />} />
                            <Input
                                type="text"
                                placeholder={"Search projects"}
                                value={query}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <Divider />
                    </Stack>
                    <SimpleGrid columns={{ sm: 1, md: 2}} spacing={8}>
                    </SimpleGrid>
                </Stack>
            </Container>
        </>
    )
}

export async function getStaticProps() {
    const directus = new Directus(config.DIRECTUS_URL);
    const projects = await directus.items('projects').readByQuery({ meta: 'total_count' });

    return {
        props: {
            projects
        }
    }
}