import {
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { createClient } from "contentful";
import Head from "next/head";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Container from "../../components/UI/Container";
import ProjectCard from "../../components/UI/ProjectCard";

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
            <Heading fontSize={{ base: "4xl", md: "6xl" }}>Projects</Heading>
            <Text fontSize={{ base: "14px", md: "16px" }}>
              A full list of all projects I have created or worked on.
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
                />
              ))}
          </SimpleGrid>
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
