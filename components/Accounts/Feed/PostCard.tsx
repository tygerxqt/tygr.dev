import { Box, Stack, Heading, Avatar, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function PostCard({ post }) {
    return (
        <>
            <Link href={`/feed/${post.fields.folder}/${post.fields.slug}`} passHref>
                <Box as="a" border={"1px"} borderColor={"#242424"} rounded={"xl"} p={4}>
                    <Stack spacing={5}>
                        <Stack spacing={2}>
                            <Heading fontSize={{ base: "2xl", md: "4xl" }}>
                                {post.fields.title}
                            </Heading>
                            <Stack isInline alignItems={"center"}>
                                <Avatar
                                    name="tygerxqt"
                                    size="xs"
                                    src="https://avatars.githubusercontent.com/u/59417077?v=4"
                                />
                                <Text fontSize={["xs", "xs", "sm", "sm"]}>
                                    tygerxqt#0001
                                </Text>
                            </Stack>
                        </Stack>
                        <Text fontSize={{ base: "md", md: "lg" }}>
                            {post.fields.summary}
                        </Text>
                    </Stack>
                </Box>
            </Link>
        </>
    )
}