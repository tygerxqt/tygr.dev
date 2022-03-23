import React from "react";
import {
  Button,
  Flex,
  Box,
  Slide,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  useColorMode,
  Image,
  Center,
  Heading,
} from "@chakra-ui/react";
import NextLink from "next/link";
import useMediaQuery from "../hook/useMediaQuery";
import { AiOutlineMenu } from "react-icons/ai";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs"

export default function Navbar({ enableTransition }) {
  const isLargerThan768 = useMediaQuery(768);
  const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();

  const { colorMode, toggleColorMode } = useColorMode()

  const NavbarDrawer = () => (
    <>
      <Drawer
        isOpen={isOpenDrawer}
        placement="right"
        onClose={onCloseDrawer}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderColor={colorMode === 'light' ? '#000000' : '#FFFFFF'}>
            <Image borderTop={'4vw'} w="32px" h="32px" src={colorMode === 'light' ? 'https://i.imgur.com/SOSvCdA.png' : 'https://i.imgur.com/IWlV3zu.png'} alt={'tygerxqt'} />
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              <NextLink href="/" passHref>
                <Button as="a" variant="ghost" fontSize="16px">
                  Home
                </Button>
              </NextLink>
              <NextLink href="/projects" passHref>
                <Button as="a" variant="ghost" fontSize="16px">
                  Projects
                </Button>
              </NextLink>
              <NextLink href="/blog" passHref>
                <Button as="a" variant="ghost" fontSize="16px">
                  Blog
                </Button>
              </NextLink>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );

  return (
    <Box zIndex="99">
      <Slide
        direction="top"
        in={true}
        transition={
          enableTransition
            ? { enter: { duration: 0.5, delay: 0.01 } }
            : { enter: { duration: 0, delay: 0 } }
        }
      >
        <Flex
          as="nav"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          px={isLargerThan768 ? "20vw" : "10vw"}
          pt={isLargerThan768 ? "4vw" : "8vw"}
          pb={isLargerThan768 ? "1vw" : "2vw"}
          borderBottom="0.5px solid borderColor"
          backgroundColor={colorMode === 'light' ? '#FFFFFF' : '#000000'}
        >
          <NextLink href="/" passHref>
            <Image borderTop={'4vw'} w="48px" h="48px" src={colorMode === 'light' ? 'https://i.imgur.com/SOSvCdA.png' : 'https://i.imgur.com/IWlV3zu.png'} alt={'tygerxqt'} />
          </NextLink>
          {isLargerThan768 ? (
            <Center>
              <NextLink href={"/projects"} passHref>
                <Button as="a" variant={"ghost"} p="4" ml="3vw" fontSize={"16px"}>
                  Projects
                </Button>
              </NextLink>
              <NextLink href={"/blog"} passHref>
                <Button as="a" variant={"ghost"} p="4" ml="3vw" fontSize={"16px"}>
                  Blog
                </Button>
              </NextLink>
              <Button
                variant="outline"
                p="4"
                ml="3vw"
                fontSize={"16px"}
                onClick={toggleColorMode}
              >
                {colorMode === "dark" ? <BsMoonFill /> : <BsFillSunFill />}
              </Button>
            </Center>
          ) : (
            <Center>
              <Button
                variant="ghost"
                p="4"
                ml="3vw"
                fontSize={"16px"}
                onClick={onOpenDrawer}
              >
                <AiOutlineMenu />
              </Button>
              <NavbarDrawer />
            </Center>
          )}
        </Flex>
      </Slide>
    </Box >
  );
}