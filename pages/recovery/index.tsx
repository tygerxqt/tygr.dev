import { Flex, Stack, Box, Heading, HStack, Button, FormControl, FormLabel, Input, Center, Text, Image, toast, useToast } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "../../components/UI/Navbar";
import useMediaQuery from "../../hook/useMediaQuery";
import supabase from "../../lib/SupabaseClient";

export default function Recovery() {
    const toast = useToast();
    const isLargerThan768 = useMediaQuery(768);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function resetPassword() {
        setLoading(true);
        if (!email || !email.includes("@")) {
            setLoading(false);
            return toast({
                title: "Error!",
                description: `You need to provide a valid email address.`,
                duration: 3000,
                isClosable: true,
                status: "error",
            });

        }
        const { error, data } = await supabase.auth.api.resetPasswordForEmail(email);
        if (error) {
            toast({
                title: "Error!",
                description: `${error.message}`,
                duration: 3000,
                isClosable: true,
                status: "error",
            });
            setLoading(false);
        } else {
            toast({
                title: "Success!",
                description: "If an account with this email exists, we will send a verification link. Please check your email.",
                duration: 5000,
                isClosable: true,
                status: "success",
            });
            setLoading(false);
        }
    }
    return (
        <>
            <Navbar enableTransition={false} />
            {isLargerThan768 ? (
                <>
                    <Flex as="main" justifyContent="center" flexDirection="column">
                        <Stack justifyContent="center">
                            <Flex flexDirection={"row"}>
                                <Flex width={"35vw"} height={"100vh"}>
                                    <Box mt={"35vh"} mx={"15%"} zIndex={2}>
                                        {" "}
                                        <Stack mb={8} spacing={2}>
                                            <Heading fontSize={{ md: "4xl", lg: "6xl" }}>
                                                Recovery
                                            </Heading>
                                            <HStack spacing={1}>
                                                <Text>Enter your email below to recover your account.</Text>
                                            </HStack>
                                        </Stack>
                                        <Box maxW="sm">
                                            <form id="login-desktop">
                                                <FormControl>
                                                    <FormLabel>Email</FormLabel>
                                                    <Input
                                                        type="email"
                                                        placeholder="hello@apple.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </FormControl>
                                            </form>
                                        </Box>
                                        <Button
                                            variant={"solid"}
                                            w="full"
                                            mt={6}
                                            isLoading={loading}
                                            disabled={loading}
                                            onClick={async () => await resetPassword()}
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
                    {/* Mobile */}
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
                                        Recovery
                                    </Heading>
                                    <HStack spacing={1}>
                                        <Text>Enter your email below to recover your account.</Text>
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
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </FormControl>
                                    </form>
                                    <Button
                                        variant={"solid"}
                                        mt={6}
                                        w="full"
                                        isLoading={loading}
                                        disabled={loading}
                                        onClick={async () => await resetPassword()}
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
    )
}