import { Heading, Input, InputGroup, InputRightElement, Stack, Text, Divider, SimpleGrid } from "@chakra-ui/react";
import { Directus } from "@directus/sdk";
import Head from "next/head";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Container from "../../components/UI/Container";
import ProjectCard from "../../components/UI/ProjectCard";
import config from "../../config.json";

function ProjectPage({ projects }) {
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
                    my={["10vh", "10vh", "15vh", "15vh"]}
                >
                    <Stack spacing={5}>
                        {" "}
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                            Projects
                        </Heading>
                        <Text fontSize={{ base: "14px", md: "16px" }}>
                            A full list of all projects I have created or worked on.
                        </Text>
                        <InputGroup maxW={"400px"} zIndex={-1}>
                            <InputRightElement pointerEvents={"none"}>
                                <FaSearch />
                            </InputRightElement>
                            <Input
                                type="text"
                                placeholder={"Search projects"}
                                value={query}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <Divider />
                    </Stack>
                    <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={8}>
                        {projects.data.filter((project) =>
                            project.title.toLowerCase().includes(query.toLowerCase())
                        ).map((project) => (
                            <ProjectCard
                                key={project.title}
                                title={project.title}
                                description={project.description}
                                deploy_link={project.deploy_link}
                                github_link={project.github_link}
                                image={project.image}
                                tags={project.tags}
                            />
                        ))}
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

export default ProjectPage;