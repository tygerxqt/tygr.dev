import Head from 'next/head'
import { Stack } from '@chakra-ui/react'
import Introduction from '../components/Introduction';
import AboutMe from '../components/About';
import Contact from '../components/Contact';
import FeaturedProjects from '../components/FeaturedProjects';
import Container from '../components/UI/Container';
import { createClient } from 'contentful';

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
          <FeaturedProjects projects={projects} />
          <Contact />
        </Stack>
      </Container>
    </>
  )
}

let client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getStaticProps() {
  let data = await client.getEntries({
    content_type: "featuredProjects",
    order: "fields.order"
  });

  return {
    props: {
      projects: data.items,
    }
  }
}

export default IndexPage;