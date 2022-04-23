import { Stack, SimpleGrid, Heading, Link, Text, Box, useColorMode } from "@chakra-ui/react";
import SlideUpWhenVisible from "../hook/slideUpWhenVisable";
import NextLink from "next/link";
import ProjectCard from "./UI/ProjectCard";

export default function FeaturedProjects({ projects }) {
    const { colorMode } = useColorMode();

    return (
        <>
            <Stack spacing={8} w="full">
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={16}>
                    <SlideUpWhenVisible threshold={0.1}>
                        <Stack spacing={1}>
                            <Stack
                                isInline
                                alignItems={"center"}
                                justifyContent={"space-between"}
                            >
                                <Heading
                                    fontSize={{ base: "xl", md: "2xl" }}
                                >
                                    Featured Projects.
                                </Heading>
                                <NextLink href={"/projects"} passHref>
                                    <Link>
                                        <Text
                                            display={{ base: 'block', md: 'none' }}
                                            fontSize={{ base: 'sm', md: 'xl' }}
                                            fontWeight="semibold"
                                            color={colorMode === "light" ? "#5E81AC" : "#90CDF4"}
                                        >
                                            {' '}
                                            Explore more &rarr;
                                        </Text>
                                    </Link>
                                </NextLink>
                            </Stack>
                            <Text fontSize={{ base: 'md', md: 'xl' }}>
                                Here&apos;s some of my projects I have worked on.
                            </Text>
                            <NextLink href={"/projects"} passHref>
                                <Link>
                                    <Text
                                        display={{ base: 'none', md: 'block' }}
                                        fontSize={{ base: 'md', md: 'xl' }}
                                        fontWeight="semibold"
                                        color={colorMode === "light" ? "#5E81AC" : "#90CDF4"}
                                    >
                                        Explore more &rarr;
                                    </Text>
                                </Link>
                            </NextLink>
                        </Stack>
                    </SlideUpWhenVisible>
                    <SlideUpWhenVisible threshold={undefined}>
                        <ProjectCard
                            title={projects[0].fields.title}
                            description={projects[0].fields.description}
                            image={projects[0].fields.image}
                            githubLink={projects[0].fields.githuhLink}
                            deployLink={projects[0].fields.deployLink}
                            tags={projects[0].fields.tags}
                        />
                    </SlideUpWhenVisible>
                    <SlideUpWhenVisible threshold={undefined}>
                        <Box mt={{ md: '-50%' }}>
                            <ProjectCard
                                title={projects[1].title}
                                description={projects[1].description}
                                image={projects[1].image}
                                githubLink={projects[1].github_link}
                                deployLink={projects[1].deploy_link}
                                tags={projects[1].tags}
                            />
                        </Box>
                    </SlideUpWhenVisible>
                    <SlideUpWhenVisible threshold={undefined}>
                        <ProjectCard
                            title={projects[2].title}
                            description={projects[2].description}
                            image={projects[2].image}
                            githubLink={projects[2].github_link}
                            deployLink={projects[2].deploy_link}
                            tags={projects[2].tags}
                        />
                    </SlideUpWhenVisible>
                </SimpleGrid>
            </Stack>
        </>
    )
}