import { MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast, Text, Center, Divider, Box, Stack, IconButton, AvatarBadge } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiLinkExternal, BiSad } from "react-icons/bi";
import { FaBell } from "react-icons/fa";
import supabase from "../../lib/SupabaseClient";

export default function Notifications() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([] as any[]);

    useEffect(() => {
        async function fetch() {
            await axios.get(`/api/users/${supabase.auth.user().id}?token=${supabase.auth.session().access_token}`).then(response => {
                setNotifications(response.data.notifications);
            }).catch(error => {
                toast({
                    title: "Error",
                    description: error,
                    status: "error",
                    duration: 9000,
                    isClosable: true
                });
            }).finally(() => {
                setLoading(false);
            });
        }

        fetch();
    }, [toast, loading]);

    async function deleteNotification(id) {
        try {
            setLoading(true);
            await axios.delete(`/api/notifications/delete?token=${supabase.auth.session().access_token}&id=${id}`).then(response => {
                toast({
                    title: "Success!",
                    description: response.data.data,
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
            }).catch(err => {
                throw err.response.data.error;
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error,
                status: "error",
                duration: 9000,
                isClosable: true
            });
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? (
                <>
                    <Spinner />
                </>
            ) : (
                <>
                    <MenuItem icon={<FaBell fontSize={"16px"} />} onClick={onOpen}>
                        Notifications <Box as="span" fontSize={"14px"} color={"gray.500"}>{notifications.length}</Box>
                    </MenuItem>

                    <Modal onClose={onClose} isOpen={isOpen} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Notifications</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {notifications[0] ? (
                                    <>
                                        {notifications.map((notification) => (
                                            <>
                                                <Box p={4} border={"1px"} borderColor={"#242424"} rounded={"lg"}>
                                                    <Stack isInline justifyContent={"space-between"}>
                                                        <Center>
                                                            <Text>{notification.message}</Text>
                                                        </Center>
                                                        <IconButton icon={<AiFillDelete fontSize={"16px"} />} size={"sm"} aria-label={""} onClick={() => deleteNotification(notification.id)} />
                                                        {notification.redirect && (
                                                            <Link href={notification.redirect} passHref>
                                                                <IconButton icon={<BiLinkExternal fontSize={"16px"} />} size={"sm"} aria-label={""} />
                                                            </Link>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <Center>
                                            <Text fontSize={["sm", "md", "lg"]}>
                                                You have no new notifications.
                                            </Text>
                                        </Center>

                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter />
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    )
};
