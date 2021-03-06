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
  useToast
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import useMediaQuery from "../../hook/useMediaQuery";
import Navbar from "../UI/Navbar";
import { useAuth } from "../../contexts/Auth";
import axios from "axios";
import supabase from "../../lib/SupabaseClient";
import Link from "next/link";

export default function Auth() {
  const { signIn, user } = useAuth();
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

  const setModeToLoginMobile = async () => {
    // @ts-ignore
    document.getElementById("register-mobile").reset();
    setMode("login");
  };

  const setModeToRegisterMobile = async () => {
    // @ts-ignore
    document.getElementById("login-mobile").reset();
    setMode("register");
  };

  const setModeToLoginDesktop = async () => {
    // @ts-ignore
    document.getElementById("register-desktop").reset();
    setMode("login");
  };

  const setModeToRegisterDesktop = async () => {
    // @ts-ignore
    document.getElementById("login-desktop").reset();
    setMode("register");
  };

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        if (!email || !password) {
          return toast({
            title: "Error",
            description: "You need to provide an email and password.",
            status: "error",
            duration: 9000,
            isClosable: true
          });
        }
        // set client cookie
        signIn(email, password);

        await axios.post("/api/auth/cookie", {
          event: user ? "SIGNED_IN" : "SIGNED_OUT",
          session: supabase.auth.session(),
        });

        toast({
          title: "Success",
          description: `Logged in as ${email}!`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [toast, signIn, user]
  );

  const handleRegister = useCallback(
    async (
      name: string,
      email: string,
      username: string,
      password: string,
      passwordConfirm: string
    ) => {
      setLoading(true);
      try {
        if (password !== passwordConfirm)
          throw new Error("Passwords do not match");
        if (!email) throw new Error("Email is required");
        if (!name) throw Error("Please provide your full name.");
        if (!username) throw Error("Please provide your username.");
      } catch (err) {
        setLoading(false);
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }

      await axios.post("/api/auth/signup", {
        name: name,
        email: email,
        username: username,
        password: password,
      }).then(async response => {
        setLoading(false);
        toast({
          title: "Success",
          description: `${response.data.data}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }).catch(error => {
        setLoading(false);
        toast({
          title: "Error",
          description: error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
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
                                setModeToRegisterDesktop();
                              }}
                            >
                              Sign Up
                            </Button>
                          </HStack>
                        </Stack>
                        <Box maxW="sm">
                          <form id="login-desktop">
                            <FormControl>
                              <FormLabel>Email</FormLabel>
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
                                <FormLabel>Password</FormLabel>
                                <Link href={"/recovery"} passHref>
                                  <Button variant={"link"} pb={2} >
                                    Forgot Password?
                                  </Button>
                                </Link>
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
                            setModeToRegisterMobile();
                          }}
                        >
                          Sign Up
                        </Button>
                      </HStack>
                    </Stack>
                  </Center>
                  <Center>
                    <Box maxW="sm">
                      <form id="login-mobile">
                        <FormControl>
                          <FormLabel>Email</FormLabel>
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
                            <FormLabel>Password</FormLabel>
                            <Link href={"/recovery"} passHref>
                              <Button variant={"link"} pb={2} >
                                Forgot Password?
                              </Button>
                            </Link>
                          </Flex>
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
          {isLargerThan768 ? (
            <>
              <Flex as="main" justifyContent="center" flexDirection="column">
                <Stack justifyContent="center">
                  <Flex flexDirection={"row"}>
                    <Flex width={"35vw"} height={"100vh"}>
                      <Box my={"20vh"} mx={"15%"} zIndex={2}>
                        {" "}
                        <Stack mb={8} spacing={2}>
                          <Heading fontSize={{ md: "4xl", lg: "6xl" }}>
                            Register
                          </Heading>
                          <HStack spacing={1}>
                            <Text>Already have an account?</Text>
                            <Button
                              variant={"link"}
                              color={
                                colorMode === "light" ? "#A7C7E7" : "#90CDF4"
                              }
                              onClick={() => {
                                setModeToLoginDesktop();
                              }}
                            >
                              Log in
                            </Button>
                          </HStack>
                        </Stack>
                        <Box maxW="sm">
                          <form id="register-desktop">
                            <FormControl>
                              <FormLabel  >Name</FormLabel>
                              <Input
                                type="text"
                                placeholder="John Doe"
                                onChange={(e) =>
                                  setRegisterName(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormControl pt={6}>
                              <FormLabel  >Email</FormLabel>
                              <Input
                                type="email"
                                placeholder="john@doe.com"
                                onChange={(e) =>
                                  setRegisterEmail(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormControl pt={6}>
                              <FormLabel  >Username</FormLabel>
                              <Input
                                type="text"
                                placeholder="johndoe"
                                onChange={(e) =>
                                  setRegisterUsername(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormControl pt={6}>
                              <FormLabel  >Password</FormLabel>
                              <Input
                                type="password"
                                placeholder="********"
                                onChange={(e) =>
                                  setRegisterPassword(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormControl pt={6}>
                              <FormLabel  >
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
                    <Stack spacing={0} align={"center"}>
                      {" "}
                      <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                        Register
                      </Heading>
                      <HStack spacing={1}>
                        <Text>Already have an account?</Text>
                        <Button
                          variant={"link"}
                          color={colorMode === "light" ? "#A7C7E7" : "#90CDF4"}
                          onClick={() => setModeToLoginMobile()}
                        >
                          Log in
                        </Button>
                      </HStack>
                    </Stack>
                  </Center>
                  <Center>
                    <Box maxW="sm">
                      <form id="register-mobile">
                        <FormControl>
                          <FormLabel>Name</FormLabel>
                          <Input
                            type="text"
                            placeholder="John Doe"
                            onChange={(e) => setRegisterName(e.target.value)}
                          />
                        </FormControl>
                        <FormControl pt={6}>
                          <FormLabel>Username</FormLabel>
                          <Input
                            type="text"
                            placeholder="johndoe"
                            onChange={(e) =>
                              setRegisterUsername(e.target.value)
                            }
                          />
                        </FormControl>
                        <FormControl pt={6}>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            placeholder="john@doe.com"
                            onChange={(e) => setRegisterEmail(e.target.value)}
                          />
                        </FormControl>
                        <FormControl pt={6}>
                          <FormLabel  >Password</FormLabel>
                          <Input
                            type="password"
                            placeholder="********"
                            onChange={(e) =>
                              setRegisterPassword(e.target.value)
                            }
                          />
                        </FormControl>
                        <FormControl pt={6}>
                          <FormLabel>Confirm Password</FormLabel>
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
