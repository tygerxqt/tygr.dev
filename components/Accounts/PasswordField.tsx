import {
  Box,
  Text,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  Flex,
  Input,
  Button,
  DrawerBody,
  FormLabel,
  IconButton,
  InputGroup,
  InputRightElement,
  FormControl,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { AiOutlineEdit } from "react-icons/ai";
import supabase from "../../lib/SupabaseClient";
import * as React from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useUser } from "../../contexts/user";

const PasswordField = () => {
  const { signOut } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [passwordHidden, setPasswordHidden] = React.useState(true);
  const toggleHidden = () => {
    if (passwordHidden === true) {
      setPasswordHidden(false);
    } else {
      setPasswordHidden(true);
    }
  };

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const update = async () => {
    try {
      setLoading(true);
      setPasswordHidden(true);
      if (!password) throw Error("Please provide a password.");
      if (password != confirmPassword) {
        throw new Error("Passwords are not the same.");
      }
      const { error } = await supabase.auth.update({
        password: password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password Updated!",
        description:
          "Your password has been updated successfully. Please log back in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      signOut();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Text size="sm" pb="1">
          Password
        </Text>
        <Flex flexDirection={"row"}>
          <Flex w={"95vw"}>
            <Input disabled={true} value={"********"} />
          </Flex>
          <Flex pl={4}>
            <Button onClick={onOpen}>
              <AiOutlineEdit />
            </Button>
          </Flex>
        </Flex>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Update password</DrawerHeader>
            <DrawerBody>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputRightElement>
                    <IconButton
                      variant="link"
                      aria-label={
                        passwordHidden ? "Reveal password" : "Mask password"
                      }
                      icon={passwordHidden ? <HiEyeOff /> : <HiEye />}
                      onClick={toggleHidden}
                    />
                  </InputRightElement>
                  <Input
                    name="password"
                    type={passwordHidden ? "password" : "text"}
                    required
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
                <FormLabel pt={8}>Confirm password</FormLabel>
                <InputGroup>
                  <InputRightElement>
                    <IconButton
                      variant="link"
                      aria-label={
                        passwordHidden ? "Reveal password" : "Mask password"
                      }
                      icon={passwordHidden ? <HiEyeOff /> : <HiEye />}
                      onClick={toggleHidden}
                    />
                  </InputRightElement>
                  <Input
                    name="password"
                    type={passwordHidden ? "password" : "text"}
                    required
                    disabled={loading}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </InputGroup>
                <Button
                  variant={"solid"}
                  w="full"
                  mt={6}
                  disabled={loading}
                  onClick={() => update()}
                >
                  {loading ? <Spinner /> : "Confirm"}
                </Button>
              </FormControl>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};

export default PasswordField;
