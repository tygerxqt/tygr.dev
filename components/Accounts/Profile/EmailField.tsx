import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { useAuth } from "../../../contexts/Auth";
import supabase from "../../../lib/SupabaseClient";

const EmailField = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oldEmail, setOldEmail] = useState(user.email);
  const [email, setEmail] = useState(user.email);

  const handleUpdate = async () => {
    try {
      if (email === oldEmail)
        return toast({
          title: "Unable to update.",
          description: "No changes were made",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      setLoading(true);

      const { error } = await supabase.auth.update({
        email: email,
      });

      if (error) {
        throw error;
      }

      setOldEmail(email);
      toast({
        title: "Success",
        description: "Check your email for a verification link.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      await supabase.auth.signOut();
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
          Email
        </Text>
        {editing ? (
          <Flex flexDirection={"row"}>
            <Flex w={"95vw"}>
              <Input
                disabled={!editing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  setEmail(oldEmail);
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
              <Input disabled={!editing} value={email} />
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

export default EmailField;
