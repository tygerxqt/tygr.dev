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
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  SimpleGrid,
  ModalFooter,
  HStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import useMediaQuery from "../../hook/useMediaQuery";
import { AiOutlineMenu } from "react-icons/ai";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";
import supabase from "../../lib/SupabaseClient";
import Link from "next/link";

export default function Navbar({ enableTransition }) {
  const isLargerThan768 = useMediaQuery(768);
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const session = supabase.auth.session();
  const user = supabase.auth.user();

  const { colorMode, toggleColorMode } = useColorMode();

  const NavbarDrawer = () => (
    <>
      <Drawer isOpen={isOpenDrawer} placement="right" onClose={onCloseDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            borderColor={colorMode === "light" ? "#000000" : "#FFFFFF"}
          >
            <Image
              borderTop={"4vw"}
              w="32px"
              h="32px"
              src={
                colorMode === "light"
                  ? "https://images.ctfassets.net/547zkxycwgvr/4tJraYpXGK1SnFV9P1mFxk/5c23ebf82f7dd9e4ba3a34fa1e40fb68/SOSvCdA.png"
                  : "https://images.ctfassets.net/547zkxycwgvr/5VGVSIquPU8U6jrGZdA9E8/a67b2944be87ef51b93467c51560a24d/IWlV3zu.png"
              }
              alt={"tygerxqt"}
            />
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

  const AccountCard = () => (
    <>
      <Modal
        onClose={onCloseModal}
        isOpen={isOpenModal}
        isCentered
        motionPreset="slideInBottom"
        size={"lg"}
      >
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="5px" />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <HStack spacing={10}>
                <Avatar
                  src={user.user_metadata.avatar}
                  rounded="full"
                  size="2xl"
                />
                <VStack>
                  <Text fontSize="26px" fontWeight="bold">
                    {user.user_metadata.username}
                  </Text>
                  <Text fontSize="14px">{user.email}</Text>
                </VStack>
              </HStack>
            </Center>
            <Center>
              <SimpleGrid
                columns={2}
                spacing={5}
                mt={{ base: "6vw", sm: "4vw", md: "2vw" }}
              >
                <NextLink href="/profile" passHref>
                  <Button as="a" variant="solid" fontSize="16px">
                    Profile
                  </Button>
                </NextLink>

                <Button
                  as="a"
                  variant="solid"
                  fontSize="16px"
                  onClick={() => supabase.auth.signOut()}
                >
                  Log out
                </Button>
              </SimpleGrid>
            </Center>
          </ModalBody>
          <Center>
            <ModalFooter />
          </Center>
        </ModalContent>
      </Modal>
    </>
  );

  return (
    <Box>
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
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          px={"4vw"}
          py={{ base: "1.5vh", md: "3vh" }}
          zIndex={99}
          backgroundColor={colorMode === "light" ? "#FFFFFF" : "#111111"}
          opacity={isLargerThan768 ? 0.8 : 1}
          borderBottom={"1px"}
          borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
        >
          <NextLink href="/" passHref>
            <Image
              borderTop={"4vw"}
              w={{ base: "32px", md: "46px" }}
              h={{ base: "32px", md: "46px" }}
              src={
                colorMode === "light"
                  ? "https://images.ctfassets.net/547zkxycwgvr/4tJraYpXGK1SnFV9P1mFxk/5c23ebf82f7dd9e4ba3a34fa1e40fb68/SOSvCdA.png"
                  : "https://images.ctfassets.net/547zkxycwgvr/5VGVSIquPU8U6jrGZdA9E8/a67b2944be87ef51b93467c51560a24d/IWlV3zu.png"
              }
              alt={"tygerxqt"}
            />
          </NextLink>
          {isLargerThan768 ? (
            <Center>
              <NextLink href={"/projects"} passHref>
                <Button as="a" variant={"ghost"} p="4" fontSize={"16px"}>
                  Projects
                </Button>
              </NextLink>
              <NextLink href={"/blog"} passHref>
                <Button
                  as="a"
                  variant={"ghost"}
                  p="4"
                  ml="3vw"
                  fontSize={"16px"}
                >
                  Blog
                </Button>
              </NextLink>
              <Button
                variant="ghost"
                p="4"
                ml="3vw"
                fontSize={"16px"}
                onClick={toggleColorMode}
              >
                {colorMode === "dark" ? <BsMoonFill /> : <BsFillSunFill />}
              </Button>
              {session ? (
                <NextLink href={"/profile"} passHref>
                  <Menu>
                    <MenuButton
                      as={Avatar}
                      ml={"3vw"}
                      src={user.user_metadata.avatar}
                      size="md"
                    />
                    <MenuList>
                      <MenuGroup title={"Account"}>
                        {/* <Center>
                          <Box p={4}>
                            <Avatar name={user.user_metadata.username} src={user.user_metadata.avatar} size="xl" />
                          </Box>
                        </Center> */}
                        <Link href="/profile" passHref>
                          <MenuItem closeOnSelect={true}>Profile</MenuItem>
                        </Link>
                      </MenuGroup>
                      <MenuGroup>
                        <MenuItem
                          closeOnSelect={true}
                          onClick={() => {
                            supabase.auth.signOut();
                            window.location.reload();
                          }}
                        >
                          Sign out
                        </MenuItem>
                      </MenuGroup>
                    </MenuList>
                  </Menu>
                </NextLink>
              ) : (
                <NextLink href={"/profile"} passHref>
                  <Button
                    variant="outline"
                    p="4"
                    ml="3vw"
                    colorScheme={"blue"}
                    fontSize={"16px"}
                  >
                    Log in
                  </Button>
                </NextLink>
              )}
            </Center>
          ) : (
            <Center>
              {session ? (
                <>
                  <Button variant="unstyled" onClick={onOpenModal}>
                    <Avatar
                      as="a"
                      size="sm"
                      name={session.user.user_metadata.username}
                      src={session.user.user_metadata.avatar}
                    />
                  </Button>
                  <AccountCard />
                </>
              ) : (
                <NextLink href="/profile" passHref>
                  <Button variant="outline" p="4" ml="3vw" fontSize={"16px"}>
                    Log in
                  </Button>
                </NextLink>
              )}
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
    </Box>
  );
}
