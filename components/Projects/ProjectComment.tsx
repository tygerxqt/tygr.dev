import { Box, Stack, Avatar, Text, Flex, IconButton, useToast } from "@chakra-ui/react";
import axios from "axios";
import dateFormat from "dateformat";
import { AiFillDelete } from "react-icons/ai";
import supabase from "../../lib/SupabaseClient";

export default function ProjectComment({ username, tag, avatar, date, body, id, userData }) {
    const toast = useToast();
    async function deleteComment() {
        await axios.delete(`/api/projects/comments/${id}/delete`).then(response => {
            toast({
                title: "Success!",
                description: response.data.data,
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        }
        ).catch(error => {
            toast({
                title: "Error.",
                description: error.response.data.error,
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        });
    }
    return (
        <>
            <Box border={"1px"} borderColor={"#242424"} p={4} rounded={"xl"}>
                <Stack spacing={3}>
                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                        <Stack isInline spacing={2} align="center">
                            <Avatar src={avatar} size={"sm"} />
                            <Text fontSize={["sm", "md"]} fontWeight={"medium"}>
                                {username}#{tag}
                            </Text>
                            <Text>&bull;</Text>
                            <Text fontSize={["sm", "md"]} fontWeight={"medium"}>{dateFormat(Date.parse(date), "mm/dd/yy hh:MM tt")}</Text>
                        </Stack>
                        <Stack isInline spacing={2}>
                            {userData.badges.admin && (
                                <IconButton icon={<AiFillDelete fontSize={"16px"} />} size={"sm"} aria-label={""} onClick={() => deleteComment()} />
                            )}
                        </Stack>
                    </Flex>
                    <Text fontSize={["sm", "md"]}>
                        {body}
                    </Text>
                </Stack>
            </Box>
        </>
    )
}