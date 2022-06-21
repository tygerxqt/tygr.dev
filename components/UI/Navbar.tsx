import React, { useEffect } from "react";
import {
  Button,
  Flex,
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
  AvatarBadge,
  Box,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  chakra,
} from "@chakra-ui/react";
import NextLink from "next/link";
import useMediaQuery from "../../hook/useMediaQuery";
import { AiFillIdcard, AiOutlineMenu } from "react-icons/ai";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";
import { useAuth } from "../../contexts/Auth";
import { BiCamera, BiLogOut } from "react-icons/bi";
import { MdAccountCircle, MdDashboard, MdFeedback } from "react-icons/md";
import { RiParkingFill } from "react-icons/ri";
import CompactBadges from "../Accounts/Badges/CompactBadges";
import Notifications from "./Notifications";
import supabase from "../../lib/SupabaseClient";
import axios from "axios";

export default function Navbar({ enableTransition }) {
  const { userData, user, signOut, update } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      await axios.post("/api/auth/cookie", {
        event: session?.user ? "SIGNED_IN" : "SIGNED_OUT",
        session: session,
      });
    });
  });

  const isLargerThan768 = useMediaQuery(768);
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  useEffect(() => {
    if (user) {
      if (!userData) {
        update();
      }
    }
  }, [update, user, userData]);

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

          {/* Desktop */}
          {userData && user ? (
            <>
              <Menu>
                <MenuButton
                  as={Avatar}
                  ml={"3vw"}
                  src={userData.avatar}
                  size={"md"}
                >
                  {userData.notifications.length === 0 ? null : (
                    <>
                      {userData.notifications.length > 0 || userData.notifications.length < 9 ? (
                        <AvatarBadge bg='#FFFFFF' boxSize={"20px"}>
                          <Text fontSize={"12px"}>{userData.notifications.length}</Text>
                        </AvatarBadge>
                      ) : (
                        <AvatarBadge bg='#FFFFFF' boxSize={"22px"}>
                          <Text fontSize={"12px"}>9+</Text>
                        </AvatarBadge>
                      )}
                    </>
                  )}
                </MenuButton>
                <MenuList pt={0}>
                  <Image
                    src={userData.banner}
                    w={"350px"}
                    h={"150px"}
                    objectFit="cover"
                    alt={"banner"}
                    borderRadius="5px 5px 0px 0px"
                    fallbackSrc={`${process.env.NEXT_PUBLIC_URL}/api/banners/default.jpg`}
                  />
                  <Flex
                    flexDirection="row"
                    justifyContent={"space-between"}
                    alignItems="center"
                    w={"full"}
                    px={"10px"}
                    pt={"8px"}
                  >
                    <Image
                      src={userData.avatar}
                      rounded="full"
                      w={"96px"}
                      h={"96px"}
                      mt={"-15%"}
                      border={"2px"}
                      borderColor={"#111111"}
                      alt={"avatar"}
                      fallbackSrc={`${process.env.NEXT_PUBLIC_URL}/api/avatars/default.jpg`}
                    />
                    <Box>
                      <CompactBadges />
                    </Box>
                  </Flex>
                  <MenuGroup fontSize={"xl"}>
                    <Flex>
                      <chakra.span fontWeight={"semibold"} fontSize={"20px"} pl={4}>{user.user_metadata.username}<chakra.span color={"#b9bbbe"}>#{user.user_metadata.tag}</chakra.span></chakra.span>
                    </Flex>
                    <MenuDivider />
                    <NextLink href="/profile" passHref>
                      <MenuItem closeOnSelect={true} icon={<MdAccountCircle fontSize={"16px"} />}>Profile</MenuItem>
                    </NextLink>
                    <NextLink href="/account" passHref>
                      <MenuItem closeOnSelect={true} icon={<AiFillIdcard fontSize={"16px"} />}>Account</MenuItem>
                    </NextLink>
                    <Notifications />
                    {userData.pixel ? (
                      <>
                        <MenuDivider />
                        <MenuGroup>
                          <NextLink href="/dashboard" passHref>
                            <MenuItem closeOnSelect={true} icon={<MdDashboard fontSize={"16px"} />}>Dashboard</MenuItem>
                          </NextLink>
                          <NextLink href="/feed" passHref>
                            <MenuItem closeOnSelect={true} icon={<MdFeedback fontSize={"16px"} />}>Feed</MenuItem>
                          </NextLink>
                          <NextLink href="/photography" passHref>
                            <MenuItem closeOnSelect={true} icon={<BiCamera fontSize={"16px"} />}>Photography</MenuItem>
                          </NextLink>
                        </MenuGroup>
                      </>
                    ) : (
                      <>
                        <NextLink href="/pixels" passHref>
                          <MenuItem closeOnSelect={true} icon={<RiParkingFill fontSize={"16px"} />}>Pixels</MenuItem>
                        </NextLink>
                      </>
                    )}
                  </MenuGroup>
                  <MenuGroup>
                    <MenuDivider />
                    <MenuItem
                      closeOnSelect={true}
                      icon={<BiLogOut fontSize={"16px"} />}
                      onClick={() => { signOut() }}
                    >
                      Sign out
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
            </>
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
        </Center>
      ) : (
        <Center>

          {/* Mobile */}
          {userData && user ? (
            <>
              <Menu>
                <MenuButton
                  as={Avatar}
                  ml={"3vw"}
                  src={userData.avatar}
                  size={"sm"}
                >
                  {userData.notifications.length === 0 ? null : (
                    <>
                      {userData.notifications.length > 0 || userData.notifications.length < 9 ? (
                        <AvatarBadge bg='#FFFFFF' boxSize={"20px"}>
                          <Text fontSize={"12px"}>{userData.notifications.length}</Text>
                        </AvatarBadge>
                      ) : (
                        <AvatarBadge bg='#FFFFFF' boxSize={"22px"}>
                          <Text fontSize={"12px"}>9+</Text>
                        </AvatarBadge>
                      )}
                    </>
                  )}
                </MenuButton>
                <MenuList pt={0}>
                  <Flex
                    flexDirection="row"
                    justifyContent={"center"}
                    alignItems="center"
                    w={"full"}
                    px={"10px"}
                    pt={"8px"}
                  >
                    <Image
                      src={userData.avatar}
                      rounded="full"
                      w={"96px"}
                      h={"96px"}
                      border={"2px"}
                      borderColor={"#111111"}
                      alt={"avatar"}
                      fallbackSrc={`${process.env.NEXT_PUBLIC_URL}/api/avatars/default.jpg`}
                    />
                  </Flex>
                  <MenuGroup>
                    <Center>
                      <chakra.span fontWeight={"semibold"} fontSize={"20px"} pt={2}>{user.user_metadata.username}<chakra.span color={"#b9bbbe"}>#{user.user_metadata.tag}</chakra.span></chakra.span>
                    </Center>
                    <MenuDivider />
                    <NextLink href="/profile" passHref>
                      <MenuItem closeOnSelect={true} icon={<MdAccountCircle fontSize={"16px"} />}>Profile</MenuItem>
                    </NextLink>
                    <NextLink href="/account" passHref>
                      <MenuItem closeOnSelect={true} icon={<AiFillIdcard fontSize={"16px"} />}>Account</MenuItem>
                    </NextLink>
                    <Notifications />
                    {userData.pixel ? (
                      <>
                        <MenuDivider />
                        <MenuGroup>
                          <NextLink href="/dashboard" passHref>
                            <MenuItem closeOnSelect={true} icon={<MdDashboard fontSize={"16px"} />}>Dashboard</MenuItem>
                          </NextLink>
                          <NextLink href="/feed" passHref>
                            <MenuItem closeOnSelect={true} icon={<MdFeedback fontSize={"16px"} />}>Feed</MenuItem>
                          </NextLink>
                          <NextLink href="/photography" passHref>
                            <MenuItem closeOnSelect={true} icon={<BiCamera fontSize={"16px"} />}>Photography</MenuItem>
                          </NextLink>
                        </MenuGroup>
                      </>
                    ) : (
                      <>
                        <NextLink href="/pixels" passHref>
                          <MenuItem closeOnSelect={true} icon={<RiParkingFill fontSize={"16px"} />}>Pixels</MenuItem>
                        </NextLink>
                      </>
                    )}
                  </MenuGroup>
                  <MenuGroup>
                    <MenuDivider />
                    <MenuItem
                      closeOnSelect={true}
                      icon={<BiLogOut fontSize={"16px"} />}
                      onClick={() => { signOut() }}
                    >
                      Sign out
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
            </>
          ) : (
            <NextLink href="/profile" passHref>
              <Button variant="solid" p="4" ml="3vw" fontSize={"16px"}>
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
      )
      }
    </Flex >
  );
}
