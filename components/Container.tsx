import React from 'react'
import { Flex, Stack, Box, Text, Link } from '@chakra-ui/react'
import Navbar from './Navbar'
import useMediaQuery from '../hook/useMediaQuery'
import { useColorMode } from '@chakra-ui/react'

export default function Container({ enableTransition, children }) {
  const { colorMode } = useColorMode()
  const isLargerThan768 = useMediaQuery(768);

  return (
    <>
      <Navbar enableTransition={enableTransition} />
      <Flex
        as="main"
        justifyContent="center"
        flexDirection="column"
        px={isLargerThan768 ? "15vw" : "8vw"}
        py={isLargerThan768 ? "4vw" : "8vw"}
      >
        {children}
      </Flex>
      <Stack alignItems="center" mb={5}>
        <Text textAlign="center" fontSize="sm">
          Designed and Developed by tygerxqt.
          <br />
          Built with{" "}
          <Link
            href="https://nextjs.org/"
            fontWeight="semibold"
            color={colorMode === "light" ? "#5E81AC" : "#90CDF4"}
          >
            Next.js
          </Link>{" "}
          &{" "}
          <Link
            href="https://chakra-ui.com/"
            fontWeight="semibold"
            color={colorMode === "light" ? "#5E81AC" : "#90CDF4"}
          >
            Chakra UI
          </Link>
          . Hosted on{" "}
          <Link
            href="https://vercel.com/"
            fontWeight="semibold"
            color={colorMode === "light" ? "#5E81AC" : "#90CDF4"}
          >
            Vercel
          </Link>
          .
        </Text>
      </Stack>
    </>
  )
}