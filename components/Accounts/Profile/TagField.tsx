import { Box, Button, Flex, Input, PinInput, PinInputField, Stack, Tag, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import supabase from "../../../lib/SupabaseClient";

const TagField = () => {
    const session = supabase.auth.session();
    const user = supabase.auth.user();
    const toast = useToast();
    const [editing, setEditing] = useState(false);
    const [digit1, setDigit1] = useState(user.user_metadata.tag.substring(0, 1));
    const [digit2, setDigit2] = useState(user.user_metadata.tag.substring(1, 2));
    const [digit3, setDigit3] = useState(user.user_metadata.tag.substring(2, 3));
    const [digit4, setDigit4] = useState(user.user_metadata.tag.substring(3, 4));

    const [oldTag, setOldTag] = useState<string>(user.user_metadata.tag);

    const handleUpdate = async () => {
        const newTag = digit1 + digit2 + digit3 + digit4;
        if (oldTag.toString() === newTag.toString()) {
            return toast({
                title: "Unable to update.",
                description: "No changes were made",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        }

        axios.put(`/api/users/update?token=${session.access_token}`, { tag: digit1 + digit2 + digit3 + digit4, username: user.user_metadata.username }).then(async response => {
            await supabase.auth.update({
                data: {
                    tag: newTag,
                }
            });
            toast({
                title: "Success",
                description: response.data.data,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }).catch(err => {
            console.log(JSON.stringify(err))
            return toast({
                title: "Unable to update.",
                description: err.response.data.error,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        });

        setOldTag(digit1 + digit2 + digit3 + digit4);
        setEditing(false);
    };

    return (
        <>
            <Box>
                <Text size="sm" pb="1">
                    Tag
                </Text>
                {editing ? (
                    <Flex flexDirection={"row"}>
                        <Flex w={"95vw"}>
                            <Stack isInline>
                                <PinInput defaultValue={user.user_metadata.tag}>
                                    <PinInputField onChange={(e) => setDigit1(e.target.value)} />
                                    <PinInputField onChange={(e) => setDigit2(e.target.value)} />
                                    <PinInputField onChange={(e) => setDigit3(e.target.value)} />
                                    <PinInputField onChange={(e) => setDigit4(e.target.value)} />
                                </PinInput>
                            </Stack>
                        </Flex>
                        <Flex pl={4}>
                            <Button
                                onClick={() => {
                                    handleUpdate()
                                }}
                                colorScheme={"green"}
                            >
                                <AiOutlineCheck />
                            </Button>
                        </Flex>
                        <Flex pl={2}>
                            <Button
                                onClick={() => {
                                    setDigit1(oldTag.substring(0, 1));
                                    setDigit2(oldTag.substring(1, 2));
                                    setDigit3(oldTag.substring(2, 3));
                                    setDigit4(oldTag.substring(3, 4));
                                    setEditing(false);
                                }}
                                colorScheme={"red"}
                            >
                                <AiOutlineClose />
                            </Button>
                        </Flex>
                    </Flex>
                ) : (
                    <Flex flexDirection={"row"}>
                        <Flex w={"95vw"}>
                            <Input disabled={!editing} value={user.user_metadata.tag} />
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
    );
};

export default TagField;
