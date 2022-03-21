import Head from 'next/head'
import { Stack } from '@chakra-ui/react'
import Container from '../components/Container'
import Introduction from '../components/Introduction';

export default function IndexPage() {
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
        </Stack>
      </Container>
    </>
  )
}