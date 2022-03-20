import Head from 'next/head'
import { Stack } from '@chakra-ui/react'
import Container from '../components/Container'

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
            spacing="144px"
            justifyContent="center"
            alignItems="center"
            px={{ base: '5vw', md: '10vw' }}
            mt={{ base: '15vh', md: '22.5vh' }}
          >

          </Stack>
        </Container>
      </>
  )
}