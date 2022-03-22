import React from 'react'
import { Flex, Stack, Box, Text } from '@chakra-ui/react'
import Navbar from './Navbar'
import useMediaQuery from '../hook/useMediaQuery'

export default function Container({ enableTransition, children }) {
  const isLargerThan768 = useMediaQuery(768);

  return (
    <>
      <Navbar enableTransition={enableTransition} />
      <Flex
        as="main"
        justifyContent="center"
        flexDirection="column"
        px={"5vh"}
        py={isLargerThan768 ? "4vw" : "8vw"}
      >
        {children}
      </Flex>
    </>
  )
}