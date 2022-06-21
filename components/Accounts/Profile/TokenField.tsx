import { Flex, Input, Box, Button, Text, useToast } from "@chakra-ui/react";
import { AiOutlineCopy } from "react-icons/ai";
import supabase from "../../../lib/SupabaseClient";

export default function TokenField() {
    const toast = useToast();
    return (
        <>
            <Box>
                <Text size="sm" pb="1">
                    Token (Developers only)
                </Text>
                <Flex flexDirection={"row"}>
                    <Flex w={"95vw"}>
                        <Input
                            disabled={true}
                            type={"password"}
                            value={supabase.auth.session().access_token}
                        />
                    </Flex>
                    <Flex pl={4}>
                        <Button onClick={async () => {
                            try {
                                navigator.clipboard.writeText(supabase.auth.session().access_token)
                            } catch (err) {
                                toast({
                                    title: "Error",
                                    description: err.message,
                                    status: "error",
                                    duration: 5000,
                                    isClosable: true,
                                });
                            }
                            toast({
                                title: "Success",
                                description: "Token copied to clipboard.",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                            });
                        }}>
                            <AiOutlineCopy />
                        </Button>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}