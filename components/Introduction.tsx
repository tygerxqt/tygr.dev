import { Stack, Heading, Button, Text, SimpleGrid, SlideFade, Flex, Box } from "@chakra-ui/react";
import { type ButtonProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BsGithub, BsTwitter, BsInstagram, BsDiscord } from "react-icons/bs";
import useMediaQuery from "../hook/useMediaQuery";

export const MotionButton = motion<ButtonProps>(Button)

export default function Introduction() {
    const isLargerThan1200 = useMediaQuery(1200);
    const buttonSize = isLargerThan1200 ? "md" : "sm"
    return (
        <>
            <Stack
                pt={'8vh'}
            >
                <SlideFade
                    in={true}
                    transition={{ enter: { duration: 0.4, delay: 0.7 } }}
                >
                    <Heading fontSize="display3" fontWeight="medium">
                        Hey there, I&apos;m...
                    </Heading>
                </SlideFade>
                <SlideFade
                    in={true}
                    transition={{ enter: { duration: 0.4, delay: 0.8 } }}
                >
                    <Heading fontSize="display" fontWeight="bold" mt={-7}>
                        tygerxqt.
                    </Heading>
                    <Text fontSize="display2">
                        A self-taught Web/IOT Developer.
                    </Text>
                </SlideFade>
            </Stack>
            <SlideFade in={true} transition={{ enter: { duration: 0.3, delay: 1 } }}>
                <Flex pb={'15vh'}>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
                        <Button
                            as="a"
                            variant="outline"
                            size={buttonSize}
                            href="/github"
                            leftIcon={<BsGithub />}
                        >
                            Github
                        </Button>
                        <Button
                            as="a"
                            variant="outline"
                            size={buttonSize}
                            href="/twitter"
                            leftIcon={<BsTwitter />}
                        >
                            Twitter
                        </Button>
                        <Button
                            as="a"
                            variant="outline"
                            size={buttonSize}
                            href="/instagram"
                            leftIcon={<BsInstagram />}
                        >
                            Instagram
                        </Button>
                        <Button
                            as="a"
                            variant="outline"
                            size={buttonSize}
                            href="/discord"
                            leftIcon={<BsDiscord />}
                        >
                            Discord
                        </Button>
                    </SimpleGrid>
                </Flex>
            </SlideFade>
        </>
    )
}