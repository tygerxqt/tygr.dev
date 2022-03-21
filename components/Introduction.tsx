import { Stack, Heading, Flex, Button, Text, HStack, Grid, SimpleGrid } from "@chakra-ui/react";
import { BsGithub, BsTwitter, BsInstagram, BsDiscord, BsYoutube, BsTwitch } from "react-icons/bs";
import NextLink from 'next/link';

export default function Introduction() {
    return (
        <>
            <Stack>
                <Heading fontSize="display3" fontWeight="medium" position={"absolute"}>
                    Hey there, I&apos;m...
                </Heading>
                <Heading fontSize="display" fontWeight="bold" m="0">
                    tygerxqt.
                </Heading>
                <Text fontSize="display2">
                    A self-taught Web/IOT Developer.
                </Text>
            </Stack>
            <SimpleGrid columns={{ base: 3, sm: 3, md: 6 }} spacing={8}>
                <Button
                    as="a"
                    variant="outline"
                    size="lg"
                    href="/github"
                >
                    <BsGithub size="24px" />
                </Button>
                <Button
                    as="a"
                    variant="outline"
                    size="lg"
                    href="/twitter"
                >
                    <BsTwitter size="24px" />
                </Button>
                <Button
                    as="a"
                    variant="outline"
                    size="lg"
                    href="/instagram"
                >
                    <BsInstagram size="24px" />
                </Button>

                <Button
                    as="a"
                    variant="outline"
                    size="lg"
                    href="/discord"
                >
                    <BsDiscord size="24px" />
                </Button>
                <Button
                    as="a"
                    variant="outline"
                    size="lg"
                    href="/youtube"
                >
                    <BsYoutube size="24px" />
                </Button>
                <Button
                    as="a"
                    variant="outline"
                    size="lg"
                    href="/twitch"
                >
                    <BsTwitch size="24px" />
                </Button>
            </SimpleGrid>
        </>
    )
}