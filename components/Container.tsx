import React from 'react'
import { Flex, Stack, Box, Text } from '@chakra-ui/react'
import Navbar from './Navbar'

const Container = ({ enableTransition, children }) => {
  return (
    <>
      <Navbar enableTransition={enableTransition} />
      <Flex as="main" justifyContent="center" flexDirection="column">
        {children}
      </Flex>
      <Box as="footer" role="contentinfo" mx="auto" maxW="7xl" py="12" px={{ base: '4', md: '8' }}>
        <Stack>
          <Text color="textPrimary" alignSelf={'center'}>
            © {new Date().getFullYear()} tygerxqt
          </Text>
        </Stack>
      </Box>
    </>
  )
}

export default Container
