import { Flex, Input, Box, Button, Text, useToast } from "@chakra-ui/react";
import { AiOutlineCopy } from "react-icons/ai";
import supabase from "../../../lib/SupabaseClient";

export default function IDField() {
    const toast = useToast();
    return (
        <>
            <Box>
                <Text size="sm" pb="1">
                    ID
                </Text>
                <Flex flexDirection={"row"}>
                    <Flex w={"95vw"}>
                        <Input
                            disabled={true}
                            value={supabase.auth.user().id}
                        />
                    </Flex>
                    <Flex pl={4}>
                        <Button onClick={async () => {
                            try {
                                navigator.clipboard.writeText(supabase.auth.user().id)
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
                                description: "ID copied to clipboard.",
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