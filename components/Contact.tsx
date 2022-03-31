import { Stack, Heading, Text, chakra, useColorMode, Button, Link, Slide } from "@chakra-ui/react";
import { FaDiscord, FaGithub, FaInstagram, FaTwitch, FaTwitter, FaYoutube } from "react-icons/fa";
import SlideUpWhenVisible from "../hook/slideUpWhenVisable";
import useMediaQuery from "../hook/useMediaQuery";

export default function Contact() {
    const { colorMode } = useColorMode();
    const isLargerThan800 = useMediaQuery(800);
    return (
        <>
            <Stack
                spacing={5}
                h="70vh"
                w="100%"
                alignItems={"center"}
                justifyContent={"center"}
            >
                <SlideUpWhenVisible threshold={undefined}>
                    <Heading fontSize={{ base: "4xl", md: "5xl" }} textAlign={"center"}>
                        Places to find me.
                    </Heading>
                </SlideUpWhenVisible>

                <SlideUpWhenVisible threshold={undefined}>
                    <Text fontSize={"md"} textAlign={"center"}>
                        I&apos;m currently working at{" "}
                        <Link href="https://nordstud.io" isExternal>
                            <Text display={"inline"} fontWeight="semibold" color={colorMode === "light" ? "#5E81AC" : "#90CDF4"}>
                                Nord Studio
                            </Text>
                        </Link>
                        {" "} and {" "}
                        <Link href="https://lofu.studio" isExternal>
                            <Text display={"inline"} fontWeight="semibold" color={colorMode === "light" ? "#5E81AC" : "#90CDF4"}>
                                Lofu Studio.
                            </Text>
                        </Link>
                    </Text>
                </SlideUpWhenVisible>


                <Stack pt={"3vh"} spacing={5} w="100%" alignItems={"center"}>
                    <SlideUpWhenVisible threshold={undefined}>
                        <Stack isInline spacing={4}>
                            <Link href="/github" isExternal>
                                <Button
                                    leftIcon={<FaGithub />}
                                    position="static"
                                    size={isLargerThan800 ? "md" : "sm"}

                                >
                                    GitHub
                                </Button>
                            </Link>
                            <Link href="/discord" isExternal>
                                <Button
                                    leftIcon={<FaDiscord />}
                                    position="static"
                                    size={isLargerThan800 ? "md" : "sm"}
                                >
                                    Discord
                                </Button>
                            </Link>
                            <Link href="/instagram" isExternal>
                                <Button
                                    leftIcon={<FaInstagram />}
                                    position="static"
                                    size={isLargerThan800 ? "md" : "sm"}
                                >
                                    Instagram
                                </Button>
                            </Link>
                        </Stack>
                    </SlideUpWhenVisible>
                    <SlideUpWhenVisible threshold={undefined}>
                        <Stack isInline spacing={4}>
                            <Link href="/twitter" isExternal>
                                <Button
                                    leftIcon={<FaTwitter />}
                                    position="static"
                                    size={isLargerThan800 ? "md" : "sm"}
                                >
                                    Twitter
                                </Button>
                            </Link>
                            <Link href="/twitch" isExternal>
                                <Button
                                    leftIcon={<FaTwitch />}
                                    position="static"
                                    size={isLargerThan800 ? "md" : "sm"}
                                >
                                    Twitch
                                </Button>
                            </Link>
                            <Link href="/youtube" isExternal>
                                <Button
                                    leftIcon={<FaYoutube />}
                                    position="static"
                                    size={isLargerThan800 ? "md" : "sm"}
                                >
                                    YouTube
                                </Button>
                            </Link>
                        </Stack>
                    </SlideUpWhenVisible>
                </Stack>
            </Stack>
        </>
    )
}