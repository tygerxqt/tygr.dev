import {
  Flex,
  Stack,
  Box,
  Heading,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Center,
  Image,
  Text,
  useColorMode,
  useToast,
  ButtonGroup,
  Divider,
  VisuallyHidden,
} from "@chakra-ui/react";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import useMediaQuery from "../../hook/useMediaQuery";
import Navbar from "./Navbar";
import supabase from "../../lib/SupabaseClient";
import { FaDiscord, FaGithub } from "react-icons/fa";
import axios from "axios";
import AuthButtons from "./AuthButtons";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");

  const [LoginEmail, setLoginEmail] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");

  const [RegisterName, setRegisterName] = useState("");
  const [RegisterUsername, setRegisterUsername] = useState("");
  const [RegisterEmail, setRegisterEmail] = useState("");
  const [RegisterPassword, setRegisterPassword] = useState("");
  const [RegisterPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  const isLargerThan768 = useMediaQuery(768);
  const { colorMode } = useColorMode();
  const toast = useToast();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);

        // set client cookie
        const { user, error } = await supabase.auth.signIn({ email, password });

        // set server cookie
        axios.post("/api/auth/cookie/set", {
          event: user ? "SIGNED_IN" : "SIGNED_OUT",
          session: supabase.auth.session(),
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return console.log(error);
        }
        toast({
          title: "Success",
          description: `Logged in as ${user.user_metadata.username}!`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const handleRegister = useCallback(
    async (
      name: string,
      email: string,
      username: string,
      password: string,
      passwordConfirm: string
    ) => {
      try {
        setLoading(true);
        if (password !== passwordConfirm)
          throw new Error("Passwords do not match");
        if (!name) throw Error("Please provide your full name.");
        if (!username) throw Error("Please provide your username.");
        const { user, session, error } = await supabase.auth.signUp(
          { email: email, password: password },
          {
            data: {
              full_name: name,
              username: username,
              avatar: `${process.env.NEXT_PUBLIC_URL}/api/avatars/default.jpg`,
            },
          }
        );
        if (error) {
          throw error;
        }
        toast({
          title: "Success!",
          description: `Check your email to confirm registration!`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        // // Push to their email providor automatically
        // var domain = email.substring(email. lastIndexOf("@") +1);
        // router.push("https://" + domain);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        if (mode === "login") {
          handleLogin(LoginEmail, LoginPassword);
        } else if (mode === "register") {
          handleRegister(
            RegisterName,
            RegisterEmail,
            RegisterUsername,
            RegisterPassword,
            RegisterPasswordConfirm
          );
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [
    LoginEmail,
    LoginPassword,
    RegisterEmail,
    RegisterName,
    RegisterPassword,
    RegisterPasswordConfirm,
    RegisterUsername,
    handleLogin,
    handleRegister,
    mode,
  ]);

  return (
    <>
      {/* Login - Desktop */}
      {mode === "login" ? (
        <>
          <Navbar enableTransition={false} />
          <Head>
            <title>Log in</title>
          </Head>
          {isLargerThan768 ? (
            <>
              <Flex as="main" justifyContent="center" flexDirection="column">
                <Stack justifyContent="center">
                  <Flex flexDirection={"row"}>
                    <Flex width={"35vw"} height={"100vh"}>
                      <Box mt={"32.5vh"} mx={"15%"} zIndex={2}>
                        {" "}
                        <Stack mb={8} spacing={2}>
                          <Heading fontSize={{ md: "4xl", lg: "6xl" }}>
                            Log in
                          </Heading>
                          <HStack spacing={1}>
                            <Text>Don&apos;t have an account?</Text>
                            <Button
                              variant={"link"}
                              color={
                                colorMode === "light" ? "#A7C7E7" : "#90CDF4"
                              }
                              onClick={() => {
                                setMode("register");
                              }}
                            >
                              Sign Up
                            </Button>
                          </HStack>
                        </Stack>
                        <Box maxW="sm">
                          <form>
                            <FormControl>
                              <FormLabel zIndex={-1}>Email</FormLabel>
                              <Input
                                type="email"
                                placeholder="hello@apple.com"
                                onChange={(e) => setLoginEmail(e.target.value)}
                              />
                            </FormControl>
                            <FormControl mt={6}>
                              <Flex
                                flexDirection={"row"}
                                justifyContent="space-between"
                              >
                                <FormLabel zIndex={-1}>Password</FormLabel>
                                {/* <Link href={"/recovery"} passHref>
                                  <Button variant={"link"} pb={2} >
                                    Forgot Password?
                                  </Button>
                                </Link> */}
                              </Flex>
                              <Input
                                type="password"
                                placeholder="********"
                                onChange={(e) =>
                                  setLoginPassword(e.target.value)
                                }
                              />
                            </FormControl>
                          </form>
                        </Box>
                        <Button
                          variant={"solid"}
                          w="full"
                          mt={6}
                          onClick={() => handleLogin(LoginEmail, LoginPassword)}
                        >
                          Confirm
                        </Button>
                        <HStack p={4}>
                          <Divider />
                          <Text fontSize="sm" whiteSpace="nowrap">
                            or continue with
                          </Text>
                          <Divider />
                        </HStack>
                        <AuthButtons />
                      </Box>
                    </Flex>
                    <Flex width={"65vw"} height={"100vh"}>
                      <Image
                        src="https://images.ctfassets.net/547zkxycwgvr/wPurkZMcmxDPVqArvblsY/b54925a4a05f3c291b6bb5f2ffe5ff1f/pwIwzHl.jpg"
                        alt="background"
                        width={"100%"}
                        height={"100%"}
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </Flex>
                  </Flex>
                </Stack>
              </Flex>
            </>
          ) : (
            <>
              {/* Login - Mobile */}
              <Flex
                as="main"
                justifyContent="center"
                flexDirection="column"
                px={isLargerThan768 ? "12vw" : "7vw"}
                py={isLargerThan768 ? "4vw" : "8vw"}
              >
                <Stack
                  spacing={10}
                  justifyContent="center"
                  my={["10vh", "10vh", "11vh", "11vh"]}
                >
                  <Center>
                    {" "}
                    <Stack spacing={2} align={"center"}>
                      <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                        Log in
                      </Heading>
                      <HStack spacing={1}>
                        <Text>Don&apos;t have an account?</Text>
                        <Button
                          variant={"link"}
                          color={colorMode === "light" ? "#A7C7E7" : "#90CDF4"}
                          onClick={() => {
                            setMode("register");
                          }}
                        >
                          Sign Up
                        </Button>
                      </HStack>
                    </Stack>
                  </Center>
                  <Center>
                    <Box maxW="sm">
                      <form>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            placeholder="hello@apple.com"
                            onChange={(e) => setLoginEmail(e.target.value)}
                          />
                        </FormControl>
                        <FormControl mt={6}>
                          <FormLabel>Password</FormLabel>
                          <Input
                            type="password"
                            placeholder="********"
                            onChange={(e) => setLoginPassword(e.target.value)}
                          />
                        </FormControl>
                      </form>
                      <Button
                        variant={"solid"}
                        mt={6}
                        w="full"
                        onClick={() => handleLogin(LoginEmail, LoginPassword)}
                      >
                        Confirm
                      </Button>
                      {/* <HStack p={8}>
                                                <Divider />
                                                <Text fontSize="sm" whiteSpace="nowrap">
                                                    or continue with
                                                </Text>
                                                <Divider />
                                            </HStack>
                                            <ButtonGroup variant={"outline"} spacing={4} width={"full"}>
                                                <Button key={"Discord"} isFullWidth onClick={() => supabase.auth.signIn({ provider: "discord" }, { shouldCreateUser: false })}>
                                                    <VisuallyHidden>Sign in with Discord</VisuallyHidden>
                                                    <FaDiscord size={"22px"} />
                                                </Button>
                                                <Button key={"Github"} isFullWidth onClick={() => supabase.auth.signIn({ provider: "github" }, { shouldCreateUser: false })}>
                                                    <VisuallyHidden>Sign in with Github</VisuallyHidden>
                                                    <FaGithub size={"22px"} />
                                                </Button>
                                                <Button key={"Spotify"} isFullWidth onClick={() => supabase.auth.signIn({ provider: "spotify" }, { shouldCreateUser: false })}>
                                                    <VisuallyHidden>Sign in with Spotify</VisuallyHidden>
                                                    <FaSpotify size={"22px"} />
                                                </Button>
                                            </ButtonGroup> */}
                    </Box>
                  </Center>
                </Stack>
              </Flex>
            </>
          )}
        </>
      ) : (
        <>
          {/* Register - Desktop */}
          <Navbar enableTransition={false} />
          <Head>
            <title>Register</title>
          </Head>
          {isLargerThan768 ? (
            <>
              <Flex as="main" justifyContent="center" flexDirection="column">
                <Stack justifyContent="center">
                  <Flex flexDirection={"row"}>
                    <Flex width={"35vw"} height={"100vh"}>
                      <Box mt={"25vh"} mx={"15%"} zIndex={2}>
                        {" "}
                        <Stack mb={8} spacing={2}>
                          <Heading fontSize={{ md: "4xl", lg: "6xl" }}>
                            Register
                          </Heading>
                          <HStack spacing={1}>
                            <Text>Have an account?</Text>
                            <Button
                              variant={"link"}
                              color={
                                colorMode === "light" ? "#A7C7E7" : "#90CDF4"
                              }
                              onClick={() => {
                                setMode("login");
                              }}
                            >
                              Log in
                            </Button>
                          </HStack>
                        </Stack>
                        <Box maxW="sm">
                          <form>
                            <FormControl>
                              <FormLabel zIndex={-1}>Name</FormLabel>
                              <Input
                                type="text"
                                placeholder="John Doe"
                                onChange={(e) =>
                                  setRegisterName(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormControl pt={6}>
                              <FormLabel zIndex={-1}>Username</FormLabel>
                              <Input
                                type="text"
                                placeholder="johndoe"
                                onChange={(e) =>
                                  setRegisterUsername(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormControl pt={6}>
                              <FormLabel zIndex={-1}>Email</FormLabel>
                              <Input
                                type="email"
                                placeholder="john@doe.com"
                                onChange={(e) =>
                                  setRegisterEmail(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormControl pt={6}>
                              <FormLabel zIndex={-1}>Password</FormLabel>
                              <Input
                                type="password"
                                placeholder="********"
                                onChange={(e) =>
                                  setRegisterPassword(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormControl pt={6}>
                              <FormLabel zIndex={-1}>
                                Confirm Password
                              </FormLabel>
                              <Input
                                type="password"
                                placeholder="********"
                                onChange={(e) =>
                                  setRegisterPasswordConfirm(e.target.value)
                                }
                              />
                            </FormControl>
                          </form>
                        </Box>
                        <Button
                          variant={"solid"}
                          mt={6}
                          disabled={loading}
                          onClick={() =>
                            handleRegister(
                              RegisterName,
                              RegisterEmail,
                              RegisterUsername,
                              RegisterPassword,
                              RegisterPasswordConfirm
                            )
                          }
                        >
                          Create Account
                        </Button>
                      </Box>
                    </Flex>
                    <Flex width={"65vw"} height={"100vh"}>
                      <Image
                        src="https://images.ctfassets.net/547zkxycwgvr/wPurkZMcmxDPVqArvblsY/b54925a4a05f3c291b6bb5f2ffe5ff1f/pwIwzHl.jpg"
                        alt="background"
                        width={"100%"}
                        height={"100%"}
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </Flex>
                  </Flex>
                </Stack>
              </Flex>
            </>
          ) : (
            <>
              {/* Register - Mobile */}
              <Flex
                as="main"
                justifyContent="center"
                flexDirection="column"
                px={isLargerThan768 ? "12vw" : "7vw"}
                py={isLargerThan768 ? "4vw" : "8vw"}
              >
                <Stack
                  spacing={10}
                  justifyContent="center"
                  my={["10vh", "10vh", "11vh", "11vh"]}
                >
                  <Center>
                    <Stack spacing={2} align={"center"}>
                      {" "}
                      <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                        Register
                      </Heading>
                      <HStack spacing={1}>
                        <Text>Have an account?</Text>
                        <Button
                          variant={"link"}
                          color={colorMode === "light" ? "#A7C7E7" : "#90CDF4"}
                          onClick={() => setMode("login")}
                        >
                          Log in
                        </Button>
                      </HStack>
                    </Stack>
                  </Center>
                  <Center>
                    <Box maxW="sm">
                      <form>
                        <FormControl>
                          <FormLabel zIndex={-1}>Name</FormLabel>
                          <Input
                            type="text"
                            placeholder="John Doe"
                            onChange={(e) => setRegisterName(e.target.value)}
                          />
                        </FormControl>
                        <FormControl pt={6}>
                          <FormLabel zIndex={-1}>Username</FormLabel>
                          <Input
                            type="text"
                            placeholder="johndoe"
                            onChange={(e) =>
                              setRegisterUsername(e.target.value)
                            }
                          />
                        </FormControl>
                        <FormControl pt={6}>
                          <FormLabel zIndex={-1}>Email</FormLabel>
                          <Input
                            type="email"
                            placeholder="john@doe.com"
                            onChange={(e) => setRegisterEmail(e.target.value)}
                          />
                        </FormControl>
                        <FormControl pt={6}>
                          <FormLabel zIndex={-1}>Password</FormLabel>
                          <Input
                            type="password"
                            placeholder="********"
                            onChange={(e) =>
                              setRegisterPassword(e.target.value)
                            }
                          />
                        </FormControl>
                        <FormControl pt={6}>
                          <FormLabel zIndex={-1}>Confirm Password</FormLabel>
                          <Input
                            type="password"
                            placeholder="********"
                            onChange={(e) =>
                              setRegisterPasswordConfirm(e.target.value)
                            }
                          />
                        </FormControl>
                      </form>
                      <Button
                        variant={"solid"}
                        mt={6}
                        onClick={() =>
                          handleRegister(
                            RegisterName,
                            RegisterEmail,
                            RegisterUsername,
                            RegisterPassword,
                            RegisterPasswordConfirm
                          )
                        }
                      >
                        Confirm
                      </Button>
                    </Box>
                  </Center>
                </Stack>
              </Flex>
            </>
          )}
        </>
      )}
    </>
  );
}
