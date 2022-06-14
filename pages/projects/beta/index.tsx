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
    Center,
    Flex,
    Spinner,
} from "@chakra-ui/react";
import { createClient } from "contentful";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import PremiumContainer from "../../../components/Accounts/PremiumContainer";
import React from "react";
import BetaProjectCard from "../../../components/Projects/BetaProjectCard";
import axios from "axios";
import supabase from "../../../lib/SupabaseClient";
import { UserProfile } from "../../../types/Account/UserProfile";
import Navbar from "../../../components/UI/Navbar";
import useMediaQuery from "../../../hook/useMediaQuery";

function ProjectPage({ projects }) {
    const [query, setQuery] = useState("");
    const handleChange = (e) => {
        setQuery(e.target.value);
    };
    const isLargerThan768 = useMediaQuery(768);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile>({} as UserProfile);

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            const { data, status: dataStatus } = await axios.get(`/api/users/@me`);
            if (dataStatus != 200) throw new Error(data.message);
            setUserData(data as UserProfile);
            setLoading(false);
            setUpdate(false);
        }

        if (session) {
            fetch();
        } else {
            setLoading(false);
        }
    }, [update]);

    return (
        <>
            {loading ? (
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
                                        Checking subscription status...
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
                            <title>Project Vault</title>
                        </Head>
                        <Stack
                            spacing={10}
                            justifyContent="center"
                            my={["10vh", "10vh", "15vh", "15vh"]}
                        >
                            <Stack spacing={5}>
                                {" "}
                                <Heading fontSize={{ base: "4xl", md: "6xl" }}>Early Access</Heading>
                                <Text fontSize={{ base: "14px", md: "16px" }}>
                                    A <b>full</b> list of early projects I am actively working on. Click on a project to request early access.
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
                                    <Link href={`/projects/vault`} passHref>
                                        <Button>
                                            Project Vault
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
                                        <BetaProjectCard
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
                                            id={project.sys.id}
                                            userData={userData}
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
        "fields.published": false,
    });

    return {
        props: {
            projects: data.items.reverse(),
        },
    };
}

export default ProjectPage;
