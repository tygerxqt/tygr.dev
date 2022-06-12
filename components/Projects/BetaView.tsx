import { Button, Divider, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, useDisclosure, Image, Text, useColorMode, ModalFooter, FormControl, FormLabel, Input, FormHelperText, Checkbox, Spacer, useCheckbox, Link, ButtonGroup, Avatar, Tooltip, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import supabase from "../../lib/SupabaseClient";
import UserPopout from "../Accounts/UserPopout";

export default function BetaView({
    title,
    image,
    id,
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode } = useColorMode();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState({} as any);

    useEffect(() => {
        async function fetch() {
            await axios.get(`/api/projects/beta/fetch&project=${id}&user=${supabase.auth.user().id}`).then(response => {
                setRequest(response.data.data);
                setLoading(false);
            }).catch(error => {
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true
                });
                setLoading(false);
            });
        }

        fetch();
    }, [toast, id, loading])

    async function submitRequest() {
        try {
            setLoading(true);
            await axios.post(`/api/projects/beta/request`, {
                project: id,
                user: supabase.auth.user().id
            }).then(response => {
                toast({
                    title: "Success!",
                    description: response.data.data,
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
            }).catch(error => {
                toast({
                    title: "Error!",
                    description: error.response.data.error,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            })
        } catch (err) {
            toast({
                title: "Error!",
                description: err.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button onClick={onOpen} colorScheme={"blue"}>Open beta</Button>

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
                        <Stack spacing={8} pb={"1vh"}>
                            <Stack spacing={2}>
                                <Stack isInline justifyContent={"space-between"} alignItems={"center"}>
                                    <Stack isInline alignItems={"center"}>
                                        <Heading fontSize={["xl", "2xl", "3xl"]}>
                                            Beta signup for {title}
                                        </Heading>
                                    </Stack>
                                </Stack>
                                <Divider />
                                <Text fontSize={['sm', 'md']}>
                                    We have auto filled the form with your Pixel account information, if anything is incorrect please make changes on the <Link href="/profile">profile page</Link>.
                                </Text>
                            </Stack>
                            <Stack>
                                <Heading fontSize={['md', 'lg']}>
                                    Account
                                </Heading>
                                {" "}
                                <ButtonGroup>
                                    <UserPopout type={"menu"} />
                                    <Tooltip hasArrow label="Logout">
                                        <Button onClick={() => {
                                            setLoading(true);
                                            supabase.auth.signOut()
                                            setLoading(false);
                                        }}>
                                            <BiLogOut fontSize="24px" />
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </Stack>
                            {/* @ts-ignore */}

                            {request ? (
                                <>
                                    {request.user && (
                                        <Button isLoading={loading} disabled>
                                            Request is pending. Please check back later.
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => submitRequest()} isLoading={loading}>
                                        Submit
                                    </Button>
                                </>
                            )}

                        </Stack>
                    </ModalBody>
                </ModalContent>
                <ModalFooter />
            </Modal>
        </>
    )
}