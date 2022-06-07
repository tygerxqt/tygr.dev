import {
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    Divider,
    SimpleGrid,
    Button,
    ButtonGroup,
} from "@chakra-ui/react";
import { createClient } from "contentful";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import PremiumContainer from "../../../components/Accounts/PremiumContainer";
import ProjectCard from "../../../components/Projects/ProjectCard";
import React from "react";

function ProjectPage({ projects }) {
    const [query, setQuery] = useState("");
    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <>
            <PremiumContainer>
                <Head>
                    <title>Project Vault</title>
                </Head>
                <Stack
                    spacing={10}
                    justifyContent="center"
                    my={["10vh", "10vh", "15vh", "15vh"]}
                >
                    <Stack spacing={5}>
                        {" "}
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>Project Vault</Heading>
                        <Text fontSize={{ base: "14px", md: "16px" }}>
                            A <b>full</b> list of archived, privated, early and current projects I have created or worked on.
                        </Text>
                        <InputGroup maxW={"400px"}>
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
                        <ButtonGroup spacing={5}>
                            <Link href={`/projects`} passHref>
                                <Button>
                                    Public Projects
                                </Button>
                            </Link>
                            <Link href={`/projects/beta`} passHref>
                                <Button>
                                    Early Access
                                </Button>
                            </Link>
                        </ButtonGroup>
                        <Divider />
                    </Stack>
                    <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={8}>
                        {projects
                            .filter(
                                (project) =>
                                    project.fields.title
                                        .toLowerCase()
                                        .includes(query.toLowerCase()) ||
                                    project.fields.description
                                        .toLowerCase()
                                        .includes(query.toLowerCase())
                            )
                            .map((project) => (
                                <ProjectCard
                                    key={project.fields.title}
                                    title={project.fields.title}
                                    description={project.fields.description}
                                    deployLink={project.fields.deployLink}
                                    githubLink={project.fields.githubLink}
                                    image={"https:" + project.fields.image.fields.file.url}
                                    tags={project.fields.tags}
                                    beta={project.fields.beta}
                                    published={project.fields.published}
                                    archived={project.fields.archived}
                                />
                            ))}
                    </SimpleGrid>
                </Stack>
            </PremiumContainer>
        </>
    );
}

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getStaticProps() {
    const data = await client.getEntries({
        content_type: "project",
        order: "sys.updatedAt",
    });

    return {
        props: {
            projects: data.items.reverse(),
        },
    };
}

export default ProjectPage;
