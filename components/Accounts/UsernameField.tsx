import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import supabase from "../../lib/SupabaseClient";

interface IProps {
    user: User;
}

const UsernameField: React.FC<IProps> = ({ user }) => {
    const toast = useToast();
    const [editing, setEditing] = useState(false);
    const [oldUsername, setOldUsername] = useState(user.user_metadata.username);
    const [username, setUsername] = useState(user.user_metadata.username);

    const handleUpdate = async () => {
        try {
            if (username === oldUsername) return toast({
                title: "Unable to update.",
                description: "No changes were made",
                status: "info",
                duration: 3000,
                isClosable: true,
            });

            const { user, error } = await supabase.auth.update({
                data: {
                    username: username,
                }
            });

            if (error) throw error;

            toast({
                title: "Success",
                description: "Username updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            setOldUsername(username);
        } catch (err) {
            toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setEditing(false);
        }
    }

    return (
        <>
            <Box>
                <Text size="sm" pb="1">
                    Username
                </Text>
                {editing ? (
                    <Flex flexDirection={"row"}>
                        <Flex w={"95vw"}>
                            <Input disabled={!editing} value={username} onChange={(e) => setUsername(e.target.value)} />
                        </Flex>
                        <Flex pl={4}>
                            <Button onClick={() => handleUpdate()}>
                                <AiOutlineCheck />
                            </Button>
                        </Flex>
                        <Flex pl={2}>
                            <Button onClick={() => {
                                setUsername(oldUsername);
                                setEditing(false);
                            }}>
                                <AiOutlineClose />
                            </Button>
                        </Flex>
                    </Flex>
                ) : (
                    <Flex flexDirection={"row"}>
                        <Flex w={"95vw"}>
                            <Input disabled={!editing} value={username} />
                        </Flex>
                        <Flex pl={4}>
                            <Button onClick={() => setEditing(true)}>
                                <AiOutlineEdit />
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </Box>
        </>
    )
}

export default UsernameField;