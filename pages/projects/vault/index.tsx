import {
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    Divider,
    SimpleGrid,
    Center,
    Flex,
    Spinner,
    ButtonGroup,
    Button,
} from "@chakra-ui/react";
import useMediaQuery from "../../../hook/useMediaQuery";
import { createClient } from "contentful";
import Head from "next/head";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ProjectCard from "../../../components/Projects/ProjectCard";
import Navbar from "../../../components/UI/Navbar";
import Link from "next/link";
import { useAuth } from "../../../contexts/Auth";
import PremiumContainer from "../../../components/Accounts/PremiumContainer";

function ProjectPage({ projects }) {
    const { userData } = useAuth();
    const [query, setQuery] = useState("");
    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const isLargerThan768 = useMediaQuery(768);

    return (
        <>
            {userData === undefined ? (
                <>
                    <Navbar enableTransition={false} />
                    <Flex
                        as="main"
                        justifyContent="center"
                        px={isLargerThan768 ? "15vw" : "8vw"}
                        py={isLargerThan768 ? "4vw" : "8vw"}
                    >
                        <Center>
                            <Stack
                                spacing={10}
                                justifyContent="center"
                                my={["20vh", "20vh", "30vh", "30vh"]}
                            >
                                <Center>
                                    <Spinner size={"xl"} />
                                </Center>
                                <Center>
                                    <Text fontSize="xl" fontWeight="bold">
                                        Loading...
                                    </Text>
                                </Center>
                            </Stack>
                        </Center>
                    </Flex>
                </>
            ) : (
                <>
                    <PremiumContainer>
                        <Head>
                            <title>Projects</title>
                            <meta name="title" content="Projects" />
                            <meta
                                name="description"
                                content="A full list of all projects I have created or worked on."
                            />

                            <meta property="og:type" content="website" />
                            <meta property="og:url" content="https://www.tygr.dev/projects" />
                            <meta property="og:title" content="Projects" />
                            <meta
                                property="og:description"
                                content="A full list of all projects I have created or worked on."
                            />
                            <meta property="og:image" content="https://images.ctfassets.net/547zkxycwgvr/3Q0kToF2x0JVJYMuAlaKD8/ab6255362cf55e7421bac16caaa00073/tygrdev5.png" />

                            <meta property="twitter:card" content="summary_large_image" />
                            <meta property="twitter:url" content="https://tygr.dev/projects" />
                            <meta property="twitter:title" content="Projects" />
                            <meta
                                property="twitter:description"
                                content="A full list of all projects I have created or worked on."
                            />
                            <meta
                                property="twitter:image"
                                content="https://images.ctfassets.net/547zkxycwgvr/3Q0kToF2x0JVJYMuAlaKD8/ab6255362cf55e7421bac16caaa00073/tygrdev5.pngpng"
                            />
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
                                    An entire list of projects I have worked on. This list includes privated and archived projects.
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
                                {userData && userData.pixel && (
                                    <>
                                        <ButtonGroup spacing={5}>
                                            <Link href={"/projects"} passHref>
                                                <Button>
                                                    Public Projects
                                                </Button>
                                            </Link>
                                            <Link href={"/projects/beta"} passHref>
                                                <Button>
                                                    Early Access
                                                </Button>
                                            </Link>
                                        </ButtonGroup>
                                        <Divider />
                                    </>
                                )}
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
                                            image={"https:" + project.fields.image.fields.file.url}
                                            deployLink={project.fields.deployLink}
                                            archived={project.fields.archived}
                                            userData={userData}
                                            beta={project.fields.beta}
                                            githubLink={project.fields.githubLink}
                                            id={project.sys.id}
                                            published={project.fields.published}
                                            tags={project.fields.tags}
                                        />
                                    ))}
                            </SimpleGrid>
                        </Stack>
                    </PremiumContainer>
                </>
            )}
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
