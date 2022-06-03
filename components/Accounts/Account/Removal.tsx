import { Stack, Heading, Divider, ButtonGroup, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, Box, Input, AlertDialogFooter, useDisclosure, useToast, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import supabase from "../../../lib/SupabaseClient";

export default function Removal() {
    const [email, setEmail] = useState("");
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const user = supabase.auth.user();
        if (email === user.email) {
            setVerified(true);
        }
    }, [email]);

    const { isOpen: DeleteIsOpen, onOpen: DeleteOnOpen, onClose: DeleteOnClose } = useDisclosure();
    const cancelRef = React.useRef();

    const toast = useToast();

    async function deleteAccount() {
        try {
            const { data, status } = await axios.post("/api/users/delete", {
                token: supabase.auth.session().access_token,
            });

            if (status != 200) {
                throw data.error
            }

            toast({
                title: "Account deleted",
                description: data.message,
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            supabase.auth.signOut();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    return (
        <>
            <Stack spacing={5}>
                <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
                    Removal
                </Heading>
                <Divider />
                <Text fontSize={{ base: "md", md: "lg" }}>
                    Deleting your account means <b>all</b> your data will be deleted from our database. You can&apos;t undo this action.
                </Text>
                <ButtonGroup spacing={5}>
                    <Button colorScheme="red" onClick={DeleteOnOpen}>
                        Delete account
                    </Button>
                    <AlertDialog
                        isOpen={DeleteIsOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={DeleteOnClose}
                        isCentered={true}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    Delete Account
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure? This action is irreversible.
                                    <br />
                                    Please type in your email to confirm.
                                    <Box mt={4}>
                                        <Input placeholder='Email' type='email' disabled={verified} onChange={(e) => setEmail(e.target.value)} />
                                    </Box>
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={DeleteOnClose}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme='red' onClick={() => deleteAccount()} ml={3} disabled={!verified}>
                                        Delete
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                    {/* <Button colorScheme="red" variant={"outline"}>
                    Disable account
                  </Button> */}
                </ButtonGroup>
            </Stack>
        </>
    )
}