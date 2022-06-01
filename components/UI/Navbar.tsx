import React, { useEffect, useState } from "react";
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
  Spinner,
  SkeletonCircle,
  chakra
} from "@chakra-ui/react";
import NextLink from "next/link";
import useMediaQuery from "../../hook/useMediaQuery";
import { AiOutlineMenu } from "react-icons/ai";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";
import supabase from "../../lib/SupabaseClient";
import Link from "next/link";
import axios from "axios";
import { UserProfile } from "../../types/UserProfile";
import { MdAccountCircle } from "react-icons/md";
import { AiFillIdcard } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";

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
  const [userData, setUserData] = useState<UserProfile>({} as UserProfile);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = supabase.auth.user();
    const session = supabase.auth.session();

    if (!user || !session) {
      setUserData({} as UserProfile);
      setLoading(false);
      return;
    }

    async function fetch() {
      const data = await axios.get(`/api/users/${user.id}?token=${session.access_token}`);
      setUserData(data.data as UserProfile);
      setLoading(false);
    }

    fetch();
  }, []);

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
        size={"sm"}
      >
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="5px" />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <VStack spacing={5}>
                <Avatar
                  src={userData.avatar}
                  rounded="full"
                  size="2xl"
                />
                <VStack>
                  <Text fontSize="26px" fontWeight="bold">
                    {user.user_metadata.username}#{user.user_metadata.tag}
                  </Text>
                  <Text fontSize="14px">{user.email}</Text>
                </VStack>
              </VStack>
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
    <Flex
      zIndex={"99"}
      position="fixed"
      w="100%"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      px={"4vw"}
      py={{ base: "1.5vh", md: "3vh" }}
      backgroundColor={colorMode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(18, 18, 18, 0.9)"}
      backdropFilter="blur(5px)"
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
          {loading ? (
            <SkeletonCircle p="4" ml="3vw" size='12' />
          ) : (
            <>
              {session ? (
                <Menu>
                  <MenuButton
                    as={Avatar}
                    ml={"3vw"}
                    src={userData.avatar}
                    size="md"
                  />
                  <MenuList>
                    <MenuGroup title={`${supabase.auth.user().user_metadata.username}#${user.user_metadata.tag}`} fontSize={"xl"}>
                      <Link href="/profile" passHref>
                        <MenuItem closeOnSelect={true} icon={<MdAccountCircle fontSize={"16px"} />}>Profile</MenuItem>
                      </Link>
                      <Link href="/account" passHref>
                        <MenuItem closeOnSelect={true} icon={<AiFillIdcard fontSize={"16px"} />}>Account</MenuItem>
                      </Link>
                    </MenuGroup>
                    <MenuGroup>
                      <MenuItem
                        closeOnSelect={true}
                        icon={<BiLogOut fontSize={"16px"} />}
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
              ) : (
                <NextLink href={"/profile"} passHref>
                  <Button
                    variant="solid"
                    p="4"
                    ml="3vw"
                    colorScheme={"blue"}
                    fontSize={"16px"}
                  >
                    Log in
                  </Button>
                </NextLink>
              )}
            </>
          )}
        </Center>
      ) : (
        <Center>
          {loading ? (
            <SkeletonCircle p="4" ml="3vw" size='6' />
          ) : (
            <>
              {session ? (
                <>
                  <Button variant="unstyled" onClick={onOpenModal}>
                    <Avatar
                      as="a"
                      size="sm"
                      src={userData.avatar}
                    />
                  </Button>
                  <AccountCard />
                </>
              ) : (
                <NextLink href="/profile" passHref>
                  <Button variant="solid" p="4" ml="3vw" fontSize={"16px"}>
                    Log in
                  </Button>
                </NextLink>
              )}
            </>
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
      )
      }
    </Flex >
  );
}
