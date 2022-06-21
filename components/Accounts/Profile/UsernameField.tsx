import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { useAuth } from "../../../contexts/Auth";
import supabase from "../../../lib/SupabaseClient";

const UsernameField = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [oldUsername, setOldUsername] = useState(user.user_metadata.username);
  const [username, setUsername] = useState(user.user_metadata.username);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (username === oldUsername) {
      setEditing(false);
      return toast({
        title: "Unable to update.",
        description: "No changes were made",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(true);
    await axios.put(`/api/users/update`, { tag: user.user_metadata.tag, username: username }).then(async response => {
      await supabase.auth.update({
        data: {
          username: username,
        }
      });
      toast({
        title: "Success",
        description: response.data.data,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }).catch(err => {
      toast({
        title: "Unable to update.",
        description: err.response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    });

    setUsername(username);
    setOldUsername(username);
    setEditing(false);
  };

  return (
    <>
      <Box>
        <Text size="sm" pb="1">
          Username
        </Text>
        {editing ? (
          <Flex flexDirection={"row"}>
            <Flex w={"95vw"}>
              <Input
                disabled={!editing}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Flex>
            <Flex pl={4}>
              <Button onClick={() => handleUpdate()} colorScheme={"green"} disabled={loading} isLoading={loading}>
                <AiOutlineCheck />
              </Button>
            </Flex>
            <Flex pl={2}>
              <Button
                onClick={() => {
                  setUsername(oldUsername);
                  setEditing(false);
                }}
                colorScheme={"red"}
                disabled={loading}
              >
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
  );
};

export default UsernameField;
