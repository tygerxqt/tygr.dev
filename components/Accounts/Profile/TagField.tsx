import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import supabase from "../../../lib/SupabaseClient";

const TagField = () => {
    const user = supabase.auth.user();
    const toast = useToast();
    const [editing, setEditing] = useState(false);
    const [oldTag, setOldTag] = useState(user.user_metadata.tag);
    const [tag, setTag] = useState(user.user_metadata.tag);

    const handleUpdate = async () => {
        try {
            if (tag === oldTag) {
                return toast({
                    title: "Unable to update.",
                    description: "No changes were made",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
            }

            const { error: tableError } = await supabase
                .from("users")
                .update({ tag: tag })
                .eq("id", user.id);

            if (tableError) {
                if (tableError.code === "23505") {
                    setTag(oldTag);
                    throw new Error("Tag is already taken.");
                }
                setTag(oldTag);
                throw tableError;
            }

            const { error: metadataError } = await supabase.auth.update({
                data: {
                    tag: tag,
                },
            });

            if (metadataError) {
                throw new Error("Metadata Error: " + metadataError.message);
            }

            toast({
                title: "Success",
                description: "Tag updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            setTag(tag);
            setOldTag(tag);
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
                            <Input
                                disabled={!editing}
                                value={tag}
                                type="number"
                                onChange={(e) => setTag(e.target.value)}
                            />
                        </Flex>
                        <Flex pl={4}>
                            <Button onClick={() => handleUpdate()} colorScheme={"green"}>
                                <AiOutlineCheck />
                            </Button>
                        </Flex>
                        <Flex pl={2}>
                            <Button
                                onClick={() => {
                                    setTag(oldTag);
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
                            <Input disabled={!editing} value={tag} />
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
