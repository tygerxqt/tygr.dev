import {
  Stack,
  SimpleGrid,
  Heading,
  Link,
  Text,
  Box,
  useColorMode,
} from "@chakra-ui/react";
import SlideUpWhenVisible from "../../hook/slideUpWhenVisable";
import NextLink from "next/link";
import FeaturedProjectCard from "../Projects/FeaturedProjectCard";

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
                <Heading fontSize={{ base: "xl", md: "2xl" }}>
                  Featured Projects.
                </Heading>
                <NextLink href={"/projects"} passHref>
                  <Link>
                    <Text
                      display={{ base: "block", md: "none" }}
                      fontSize={{ base: "sm", md: "xl" }}
                      fontWeight="semibold"
                      color={colorMode === "light" ? "#5E81AC" : "#90CDF4"}
                    >
                      {" "}
                      Explore more &rarr;
                    </Text>
                  </Link>
                </NextLink>
              </Stack>
              <Text fontSize={{ base: "md", md: "xl" }}>
                Here&apos;s some of my projects I have worked on.
              </Text>
              <NextLink href={"/projects"} passHref>
                <Link>
                  <Text
                    display={{ base: "none", md: "block" }}
                    fontSize={{ base: "md", md: "xl" }}
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
            <FeaturedProjectCard
              title={projects[0].fields.title}
              description={projects[0].fields.description}
              image={"https:" + projects[0].fields.image.fields.file.url}
              githubLink={projects[0].fields.githubLink}
              deployLink={projects[0].fields.deployLink}
              tags={projects[0].fields.tags}
              beta={projects[0].fields.beta}
              id={projects[0].fields.id}
            />
          </SlideUpWhenVisible>
          <SlideUpWhenVisible threshold={undefined}>
            <Box mt={{ md: "-50%" }}>
              <FeaturedProjectCard
                title={projects[1].fields.title}
                description={projects[1].fields.description}
                image={"https:" + projects[1].fields.image.fields.file.url}
                githubLink={projects[1].fields.githubLink}
                deployLink={projects[1].fields.deployLink}
                tags={projects[1].fields.tags}
                beta={projects[1].fields.beta}
                id={projects[1].fields.id}
              />
            </Box>
          </SlideUpWhenVisible>
          <SlideUpWhenVisible threshold={undefined}>
            <FeaturedProjectCard
              title={projects[2].fields.title}
              description={projects[2].fields.description}
              image={"https:" + projects[2].fields.image.fields.file.url}
              githubLink={projects[2].fields.githubLink}
              deployLink={projects[2].fields.deployLink}
              tags={projects[2].fields.tags}
              beta={projects[2].fields.beta}
              id={projects[2].fields.id}
            />
          </SlideUpWhenVisible>
        </SimpleGrid>
      </Stack>
    </>
  );
}
