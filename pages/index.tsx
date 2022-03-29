import Head from 'next/head'
import { Stack } from '@chakra-ui/react'
import Introduction from '../components/Introduction';
import AboutMe from '../components/About';
import Contact from '../components/Contact';
import { Directus } from '@directus/sdk';
import FeaturedProjects from '../components/FeaturedProjects';
import config from '../config.json'
import Container from '../components/Container';

function IndexPage({ projects }) {
  return (
    <>
      <Container enableTransition={true}>
        <Head>
          <title>tygerxqt</title>
          <meta name="title" content="tygerxqt" />
        </Head>
        <Stack
          as="main"
          justifyContent="center"
          spacing={"60px"}
          alignItems="center"
          mt={{ base: '20vh', md: '15vh' }}
        >
          <Introduction />
          <AboutMe />
          <FeaturedProjects projects={projects.data} />
          <Contact />
        </Stack>
      </Container>
    </>
  )
}

export async function getStaticProps() {
  const directus = new Directus(config.DIRECTUS_URL);

  const projects = await directus.items('featuredProjects').readByQuery({ meta: 'total_count' });

  return {
    props: {
      projects
    }
  }
}

export default IndexPage;