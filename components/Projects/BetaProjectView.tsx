import { Button, ButtonGroup, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Text, Image, useColorMode, Stack, Badge, Box, Divider, Link, Textarea, useToast, Spinner, Avatar, Flex, IconButton, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import useMediaQuery from "../../hook/useMediaQuery";
import dateFormat from "dateformat";
import supabase from "../../lib/SupabaseClient";
import NextLink from "next/link";

export default function ProjectView({
    title,
    description,
    image,
    githubLink,
    deployLink,
    tags,
    beta,
    published,
    archived,
    id,
    userData
}) {
    const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();
    const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure(); const { colorMode } = useColorMode();
    const isLargerThan600 = useMediaQuery(600);
    const isLargerThan480 = useMediaQuery(480);

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const toast = useToast();
    useEffect(() => {
        async function fetch() {
            await axios.get(`/api/projects/comments/${id}`).then(response => {
                setComments(response.data.data);
                setLoading(false);
            }).catch(error => {
                toast({
                    title: "Error",
                    description: error.response.data.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "top-left"
                });
            });
        }

        fetch();
    }, [toast, loading, id]);

    async function handleCommentPost() {
        try {
            await axios.post(`/api/projects/comments/post`, {
                comment: comment,
                project_id: id
            }).then(response => {
                setLoading(true);
                setComment("");
                toast({
                    title: "Success",
                    description: "Comment posted successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                    position: "top-left"
                });
            }).catch(error => {
                toast({
                    title: "Error",
                    description: error.response.data.error,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "top-left"
                });
            });
        } catch (error) {
            console.log(error);
        } finally {
            setComment("");
        }
    }

    async function deleteComment(id) {
        await axios.delete(`/api/projects/comments/${id}/delete`).then(response => {
            setLoading(true);
            toast({
                title: "Success!",
                description: response.data.data,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
        }
        ).catch(error => {
            toast({
                title: "Error.",
                description: error.response.data.error,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
        });
    }

    return (
        <>
            {isLargerThan600 ? (
                <>
                    <Button onClick={onOpenModal}>View project</Button>
                </>
            ) : (
                <>
                    <Button onClick={onOpenDrawer}>View project</Button>
                </>
            )}

            <Modal onClose={onCloseModal} isOpen={isOpenModal} size={"4xl"} scrollBehavior={"outside"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader p={0}>
                        <Image
                            width={1250}
                            height={600}
                            w="auto"
                            h="auto"
                            src={image}
                            transition="0.3s"
                            placeholder="blur"
                            borderRadius="10px 10px 0px 0px"
                            alt="project image"
                        ></Image>
                    </ModalHeader>
                    <ModalCloseButton rounded={"xl"} bgColor={colorMode === "dark" ? "#242424" : "#FFFFFF"} />
                    <ModalBody mt={"2vh"}>
                        <Stack spacing={8}>
                            <Stack spacing={2}>
                                <Stack isInline justifyContent={"space-between"} alignItems={"center"}>
                                    <Stack isInline alignItems={"center"}>
                                        <Heading fontSize={["xl", "2xl", "3xl"]}>
                                            {title}
                                        </Heading>
                                        <Text fontSize={"2xl"}>
                                            {beta === true ? (
                                                <Badge colorScheme='blue' fontWeight={"thin"} variant="outline" ml="2">
                                                    Beta
                                                </Badge>
                                            ) : <div />}
                                            {published === false ? (
                                                <Badge colorScheme='red' fontWeight={"thin"} variant="outline" ml="2">
                                                    Private
                                                </Badge>
                                            ) : <div />}
                                            {archived === true ? (
                                                <Badge colorScheme='green' fontWeight={"thin"} variant="outline" ml="2">
                                                    Archived
                                                </Badge>
                                            ) : <div />}
                                        </Text>
                                    </Stack>
                                </Stack>
                                {isLargerThan480 ? (
                                    <Stack isInline>{tags}</Stack>
                                ) : (
                                    <Stack isInline>
                                        <Box>
                                            {tags}
                                        </Box>
                                    </Stack>
                                )}
                                <Divider />
                                <Text fontSize={['sm', 'md']}>
                                    {description}
                                </Text>
                            </Stack>
                            <Stack>
                                {isLargerThan480 ? (
                                    <>
                                        <ButtonGroup spacing={4} >
                                            {githubLink && (
                                                <Link href={githubLink} isExternal>
                                                    <Button>
                                                        Source Code
                                                    </Button>
                                                </Link>
                                            )}
                                            {deployLink && (
                                                <Link href={deployLink} isExternal>
                                                    <Button>
                                                        Project site
                                                    </Button>
                                                </Link>
                                            )}
                                            {githubLink && (
                                                <Link href={githubLink + "/issues/new"} isExternal>
                                                    <Button>
                                                        Report a bug
                                                    </Button>
                                                </Link>
                                            )}
                                        </ButtonGroup>
                                    </>
                                ) : (
                                    <>
                                        <ButtonGroup spacing={4}>
                                            {githubLink && (
                                                <Link href={githubLink} isExternal>
                                                    <Button>
                                                        Source Code
                                                    </Button>
                                                </Link>
                                            )}
                                            {deployLink && (
                                                <Link href={deployLink} isExternal>
                                                    <Button>
                                                        Project site
                                                    </Button>
                                                </Link>
                                            )}
                                        </ButtonGroup>
                                        <ButtonGroup spacing={4}>
                                            {githubLink && (
                                                <Link href={githubLink + "/issues/new"} isExternal>
                                                    <Button mt={2}>
                                                        Report a bug
                                                    </Button>
                                                </Link>
                                            )}
                                        </ButtonGroup>
                                    </>
                                )}

                            </Stack>
                            <Stack spacing={5}>
                                <Stack>
                                    <Heading fontSize={["md", "lg", "xl"]}>
                                        Comments
                                    </Heading>
                                </Stack>
                                <Stack spacing={5}>
                                    <Textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                                    <ButtonGroup spacing={2}>
                                        <Button colorScheme="blue" onClick={() => { handleCommentPost() }}>
                                            Send
                                        </Button>
                                    </ButtonGroup>
                                </Stack>
                                {comments[0] && (
                                    <Divider />
                                )}
                                <Stack spacing={4}>
                                    {loading ? (
                                        <>
                                            <Spinner />
                                        </>
                                    ) : (
                                        <>
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
                                                                        {userData.badges.admin && (
                                                                            <IconButton icon={<AiFillDelete fontSize={"16px"} />} size={"sm"} aria-label={""} onClick={() => deleteComment(comment.id)} />
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
                                            }
                                            )}
                                        </>
                                    )}
                                </Stack>
                            </Stack>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Drawer isOpen={isOpenDrawer} onClose={onCloseDrawer} size={"lg"} placement={"left"}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader p={0}>
                        <Image
                            width={1250}
                            height={600}
                            w="auto"
                            h="auto"
                            src={image}
                            transition="0.3s"
                            placeholder="blur"
                            borderRadius="10px 10px 0px 0px"
                            alt="project image"
                        ></Image>
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing={8}>
                            <Stack spacing={2}>
                                <Stack isInline justifyContent={"space-between"} alignItems={"center"}>
                                    <Stack isInline alignItems={"center"}>
                                        <Heading fontSize={["xl", "2xl", "3xl"]}>
                                            {title}
                                        </Heading>
                                        <Text fontSize={"2xl"}>
                                            {beta === true ? (
                                                <Badge colorScheme='blue' fontWeight={"thin"} variant="outline" ml="2">
                                                    Beta
                                                </Badge>
                                            ) : <div />}
                                        </Text>
                                    </Stack>
                                </Stack>
                                {isLargerThan480 ? (
                                    <Stack isInline>{tags}</Stack>
                                ) : (
                                    <Stack isInline>
                                        <Box>
                                            {tags}
                                        </Box>
                                    </Stack>
                                )}
                                <Divider />
                                <Text fontSize={['sm', 'md']}>
                                    {description}
                                </Text>
                            </Stack>
                            <SimpleGrid columns={3} spacing={4}>
                                {githubLink && (
                                    <NextLink href={githubLink} passHref>
                                        <Button fontSize={{ base: "sm", sm: "md" }}>
                                            Source Code
                                        </Button>
                                    </NextLink>
                                )}
                                {deployLink && (
                                    <NextLink href={deployLink} passHref>
                                        <Button fontSize={{ base: "sm", sm: "md" }}>
                                            Project site
                                        </Button>
                                    </NextLink>
                                )}
                                {githubLink && (
                                    <NextLink href={githubLink + "/issues/new"} passHref>
                                        <Button fontSize={{ base: "sm", sm: "md" }}>
                                            Report a bug
                                        </Button>
                                    </NextLink>
                                )}
                            </SimpleGrid>

                            <Stack spacing={5}>
                                <Stack>
                                    <Heading fontSize={["md", "lg", "xl"]}>
                                        Comments
                                    </Heading>
                                </Stack>
                                <Stack spacing={5}>
                                    <Textarea placeholder={supabase.auth.session() ? "Add a comment..." : "Login to add a comment"} value={comment} onChange={(e) => setComment(e.target.value)} disabled={supabase.auth.session() ? false : true} />
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
                                    {loading ? (
                                        <>
                                            <Spinner />
                                        </>
                                    ) : (
                                        <>
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
                                                                        {userData.badges.admin && (
                                                                            <IconButton icon={<AiFillDelete fontSize={"16px"} />} size={"sm"} aria-label={""} onClick={() => deleteComment(comment.id)} />
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
                                            }
                                            )}
                                        </>
                                    )}
                                </Stack>
                            </Stack>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}