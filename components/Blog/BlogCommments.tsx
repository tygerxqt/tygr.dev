import { Box, Stack, Avatar, Text, Flex, IconButton, useToast, Button, ButtonGroup, Divider, Heading, Textarea, Center, Spinner } from "@chakra-ui/react";
import axios from "axios";
import dateFormat from "dateformat";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useAuth } from "../../contexts/Auth";
import supabase from "../../lib/SupabaseClient";

export default function BlogComment({ metadata }) {
    const { userData, user } = useAuth();
    const toast = useToast();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            await axios.get(`/api/blog/comments/${metadata.sys.id}`).then(response => {
                setComments(response.data.data);
                setLoading(false);
            }).catch(error => {
                toast({
                    title: "Failed to load comments.",
                    description: error.response.data.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "top-left"
                });
                setLoading(false);
            });
        }

        fetch();
    }, [toast, loading, metadata]);

    async function handleCommentPost() {
        try {
            if (!supabase.auth.session()) {
                throw new Error("Please login first.");
            }
            await axios.post(`/api/blog/comments/post`, {
                comment: comment,
                id: metadata.sys.id
            }).then(response => {
                setLoading(true);
                setComment("");
                toast({
                    title: "Success",
                    description: "Comment posted successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-left"
                });
            }).catch(error => {
                toast({
                    title: "Error",
                    description: error.response.data.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-left"
                });
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-left"
            })
        } finally {
            setComment("");
        }
    }

    async function deleteComment(id) {
        if (!supabase.auth.session()) {
            throw new Error("Please login first.");
        }
        try {
            await axios.delete(`/api/blog/comments/${id}/delete`).then(response => {
                setLoading(true);
                toast({
                    title: "Success!",
                    description: response.data.data,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-left"
                });
            }
            ).catch(error => {
                toast({
                    title: "Error.",
                    description: error.response.data.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-left"
                });
            });
        } catch (error) {
            toast({
                title: "Error.",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-left"
            })
        }
    }

    return (
        <>
            {loading ? (
                <>
                    <Center>
                        <Spinner />
                    </Center>
                </>
            ) : (
                <>
                    <Stack spacing={5}>
                        <Stack>
                            <Heading fontSize={["md", "lg", "xl"]}>
                                Comments
                            </Heading>
                        </Stack>
                        <Stack spacing={5}>
                            <Textarea placeholder={supabase.auth.session() ? "Add a comment..." : "Login to add a comment"} disabled={supabase.auth.session() ? false : true} value={comment} onChange={(e) => setComment(e.target.value)} />
                            <ButtonGroup spacing={2}>
                                <Button colorScheme="blue" onClick={() => { handleCommentPost() }} disabled={supabase.auth.session() ? false : true}>
                                    Send
                                </Button>
                            </ButtonGroup>
                        </Stack>
                        {comments[0] && (
                            <Divider />
                        )}
                        <Stack spacing={4}>
                            {comments.sort((a, b) => a - b).reverse().map((comment) => {
                                return (
                                    <>
                                        <Box border={"1px"} borderColor={"#242424"} p={4} rounded={"xl"}>
                                            <Stack spacing={3}>
                                                <Flex justifyContent={"space-between"} alignItems={"center"}>
                                                    <Stack isInline spacing={2} align="center">
                                                        <Avatar src={comment.avatar} size={"sm"} />
                                                        <Text fontSize={["sm", "md"]} fontWeight={"medium"}>
                                                            {comment.username}#{comment.tag}
                                                        </Text>
                                                        <Text>&bull;</Text>
                                                        <Text fontSize={["sm", "md"]} fontWeight={"medium"}>{dateFormat(Date.parse(comment.created_at), "dd/mm/yy")}</Text>
                                                    </Stack>
                                                    <Stack isInline spacing={2}>
                                                        {user && (
                                                            <>
                                                                {comment.user === user.id && (
                                                                    <IconButton icon={<AiFillDelete fontSize={"16px"} />} size={"sm"} aria-label={""} onClick={() => deleteComment(comment.id)} />
                                                                )}
                                                            </>
                                                        )}

                                                    </Stack>
                                                </Flex>
                                                <Text fontSize={["sm", "md"]}>
                                                    {comment.body}
                                                </Text>
                                            </Stack>
                                        </Box>
                                    </>
                                );
                            })}
                        </Stack>
                    </Stack>
                </>
            )}
        </>
    )
}