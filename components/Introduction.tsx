import { Stack, Heading, Button, Text, SimpleGrid, SlideFade, Flex, Box, Image, useColorMode, Link } from "@chakra-ui/react";
import { type ButtonProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";
import useMediaQuery from "../hook/useMediaQuery";

export const MotionButton = motion<ButtonProps>(Button)

export default function Introduction() {
    const { colorMode } = useColorMode();
    const isLargerThan800 = useMediaQuery(800);
    const isLargerThan400 = useMediaQuery(400);
    return (
        <>
            <SimpleGrid columns={isLargerThan800 ? 2 : 1} spacing={8}>
                <Stack spacing={10} justifyContent="flex-start" alignItems="flex-start" mt={16}>
                    <SlideFade
                        in={true}
                        transition={{ enter: { duration: 0.4, delay: 0.7 } }}
                    >
                        <Heading
                            fontSize="display2"
                            color={colorMode === "light" ? "#A7C7E7" : "#90CDF4"}
                            fontWeight="medium"
                            position={"relative"}
                        >
                            Hey there, I&apos;m...
                        </Heading>
                    </SlideFade>
                    <SlideFade
                        in={true}
                        transition={{ enter: { duration: 0.4, delay: 0.8 } }}
                    >
                        <Heading
                            fontSize="display"
                            letterSpacing={{ sm: "-1.2px", md: "-1.8px" }}
                            fontWeight="bold"
                            mt={-14}
                            mb={2}
                        >
                            tygerxqt.
                        </Heading>
                        <Text fontSize="display2" fontWeight={"semibold"}>
                            A self-taught Web/IOT Developer.
                        </Text>
                    </SlideFade>

                    {/* Description */}

                    <SlideFade
                        in={true}
                        transition={{ enter: { duration: 0.4, delay: 0.9 } }}
                    >
                        <Text fontSize="display3" color="#8F9094">
                            💻 Working on projects over at Nord Studio.
                            <br />
                            <Stack isInline spacing={2}>
                                <Box>📷</Box>
                                <Box>Creating content at Lofu Studio.</Box>
                            </Stack>
                        </Text>
                    </SlideFade>

                    {/* Buttons */}

                    <SlideFade
                        in={true}
                        transition={{ enter: { duration: 0.4, delay: 1.0 } }}
                    >
                        {isLargerThan400 ? (
                            <Stack isInline spacing={4} >
                                <Link href="/github">
                                    <Button
                                        leftIcon={<FaGithub />}
                                        transition="0.3s"
                                        position="static"
                                        size={isLargerThan800 ? "md" : "sm"}
                                    >
                                        GitHub
                                    </Button>
                                </Link>
                                <Link href="/discord">
                                    <Button
                                        leftIcon={<FaDiscord />}
                                        transition="0.3s"
                                        position="static"
                                        size={isLargerThan800 ? "md" : "sm"}
                                    >
                                        Discord
                                    </Button>
                                </Link>
                                <Link href="/twitter">
                                    <Button
                                        leftIcon={<FaTwitter />}
                                        transition="0.3s"
                                        position="static"
                                        size={isLargerThan800 ? "md" : "sm"}
                                    >
                                        Twitter
                                    </Button>
                                </Link>
                            </Stack>
                        ) : (
                            <Box>
                                <Link href="/github">
                                    <Button
                                        leftIcon={<FaGithub />}
                                        transition="0.3s"
                                        position="static"
                                        size={isLargerThan800 ? "md" : "sm"}
                                        mr={2}
                                        mb={2}
                                    >
                                        GitHub
                                    </Button>
                                </Link>
                                <Link href="/discord">
                                    <Button
                                        leftIcon={<FaDiscord />}
                                        transition="0.3s"
                                        position="static"
                                        size={isLargerThan800 ? "md" : "sm"}
                                        mr={2}
                                        mb={2}
                                    >
                                        Discord
                                    </Button>
                                </Link>
                                <Link href="/twitter">
                                    <Button
                                        leftIcon={<FaTwitter />}
                                        transition="0.3s"
                                        position="static"
                                        size={isLargerThan800 ? "md" : "sm"}
                                        mr={2}
                                        mb={2}
                                    >
                                        Twitter
                                    </Button>
                                </Link>
                            </Box>
                        )}

                    </SlideFade>
                </Stack>
                <SlideFade
                    in={true}
                    transition={{ enter: { duration: 0.4, delay: 1.2 } }}
                >
                    <Flex
                        marginLeft={{ base: 100, md: 125, lg: 175 }}
                        mt={16}
                        alignItems="normal"
                        justifyContent="center"
                        display={isLargerThan800 ? "block" : "none"}
                    >
                        <Box
                            maxW={{ base: "312px", md: "412px", lg: "512px" }}
                            maxH={{ base: "312px", md: "412px", lg: "512px" }}
                        >
                            <Image
                                src={"https://avatars.githubusercontent.com/u/59417077?v=4"}
                                w="100%"
                                h="100%"
                                placeholder="blur"
                                borderRadius={'full'}
                                maxW={{ base: "312px", md: "452px", lg: "612px" }}
                                maxH={{ base: "312px", md: "452px", lg: "612px" }}
                                alt={"tygerxqt"}
                            />
                        </Box>
                    </Flex>
                </SlideFade>
            </SimpleGrid>
        </>
    )
}