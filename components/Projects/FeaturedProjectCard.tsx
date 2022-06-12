import { Button, ButtonGroup, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Text, Image, useColorMode, Stack, Badge, Box, Divider, Link, Textarea, toast, useToast, Spinner, Avatar, Flex, IconButton, ScaleFade, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaGithub, FaExternalLinkAlt, FaReact } from "react-icons/fa";
import useMediaQuery from "../../hook/useMediaQuery";
import supabase from "../../lib/SupabaseClient";
import dateFormat from "dateformat";
import { SiTypescript, SiJavascript, SiNextdotjs, SiElectron, SiCplusplus, SiCsharp } from "react-icons/si";
import { VscTerminalBash } from "react-icons/vsc";

export default function FeaturedProjectCard({
    title,
    description,
    image,
    githubLink,
    deployLink,
    tags,
    beta,
    id,
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode } = useColorMode();
    const isLargerThan480 = useMediaQuery(480);
    const isLargerThan800 = useMediaQuery(800);

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hover, setHover] = useState(false);

    const toast = useToast();
    useEffect(() => {
        async function fetch() {
            if (!supabase.auth.session()) {
                return setLoading(false);
            }
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
    }, [toast, loading, isOpen, id]);

    const getTag = (tag) => {
        let values = []
        switch (tag) {
            case 'TypeScript': {
                values[0] = 'blue'
                values[1] = SiTypescript
            }
                break;
            case 'JavaScript': {
                values[0] = 'yellow'
                values[1] = SiJavascript
            }
                break;
            case 'Bash': {
                values[0] = 'grey'
                values[1] = VscTerminalBash
            }
                break;
            case 'React': {
                values[0] = 'blue'
                values[1] = FaReact
            }
                break;
            case 'NextJS': {
                values[0] = 'grey'
                values[1] = SiNextdotjs
            }
                break;
            case 'Electron': {
                values[0] = 'white'
                values[1] = SiElectron
            }
                break;
            case 'C++': {
                values[0] = 'blue'
                values[1] = SiCplusplus
            }
                break;
            case 'C#': {
                values[0] = 'purple'
                values[1] = SiCsharp
            }
                break;
            default: {
                values[0] = 'white'
            }

        }
        return values
    }

    const Tags = tags.map((item) => (
        <Tag
            key={item}
            colorScheme={getTag(item)[0]}
            size={isLargerThan800 ? 'md' : 'sm'}
        >
            <TagLeftIcon as={getTag(item)[1]}></TagLeftIcon>
            <TagLabel>{item}</TagLabel>
        </Tag>
    ))

    return (
        <>
            <Stack
                borderRadius={"10px"}
                minH={"320px"}
                maxH={"500px"}
                border={"1px"}
                borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
            >
                <ScaleFade in={true}>
                    <Box cursor={"pointer"} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onOpen}>
                        {hover ? (
                            <>
                                <Image
                                    width={1250}
                                    height={600}
                                    w="auto"
                                    h="auto"
                                    src={image}
                                    transition="filter 0.2s ease-in"
                                    filter={"blur(2px)"}
                                    placeholder="blur"
                                    borderRadius="10px 10px 0px 0px"
                                    alt="project image"
                                ></Image>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </Box>
                    <Stack px={4} py={2}>
                        <Stack isInline justifyContent={"space-between"} alignItems={"center"}>
                            <Text fontFamily="Ubuntu" fontSize={"2xl"}>
                                {title}
                                {beta === true ? (
                                    <Badge colorScheme='blue' fontWeight={"thin"} variant="outline" ml="2">
                                        Beta
                                    </Badge>
                                ) : <div />}
                            </Text>
                            <Stack
                                isInline
                                justifyContent={"flex-end"}
                                alignItems={"center"}
                                spacing={4}
                            >
                                {githubLink && (
                                    <Link
                                        href={githubLink}
                                        color={colorMode === "light" ? "black" : "white"}
                                        isExternal
                                    >
                                        <FaGithub size={23} />
                                    </Link>
                                )}
                                {deployLink && (
                                    <Link
                                        href={deployLink}
                                        color={colorMode === "light" ? "black" : "white"}
                                        isExternal
                                    >
                                        <FaExternalLinkAlt size={23} />
                                    </Link>
                                )}
                            </Stack>
                        </Stack>
                        {isLargerThan480 ? (
                            <Stack isInline>{Tags}</Stack>
                        ) : (
                            <Stack isInline>
                                <Box>
                                    {Tags}
                                </Box>
                            </Stack>
                        )}
                        <Divider />
                        <Text fontSize={['sm', 'md']}>
                            {description}
                        </Text>
                    </Stack>
                </ScaleFade>
            </Stack>

            <Modal onClose={onClose} isOpen={isOpen} size={"4xl"} scrollBehavior={"outside"}>
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
                                        </Text>
                                    </Stack>
                                </Stack>
                                {isLargerThan480 ? (
                                    <Stack isInline>{Tags}</Stack>
                                ) : (
                                    <Stack isInline>
                                        <Box>
                                            {Tags}
                                        </Box>
                                    </Stack>
                                )}
                                <Divider />
                                <Text fontSize={['sm', 'md']}>
                                    {description}
                                </Text>
                            </Stack>
                            <Stack>
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
                                    {githubLink && (
                                        <Link href={githubLink + "/issues/new"} isExternal>
                                            <Button>
                                                Report a bug
                                            </Button>
                                        </Link>
                                    )}
                                </ButtonGroup>
                            </Stack>
                            <Stack spacing={5}>
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
                                                                        <Text fontSize={["sm", "md"]} fontWeight={"medium"}>{dateFormat(Date.parse(comment.date), "mm/dd/yy hh:MM tt")}</Text>
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
        </>
    )
}