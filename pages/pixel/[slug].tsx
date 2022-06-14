import { Center, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useMediaQuery from "../../hook/useMediaQuery";
export default function Redirect() {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            window.location.href = `/pixels/${router.query.slug}`;
        }, 1000);
    }, [router])

    const isLargerThan768 = useMediaQuery(768);

    return (
        <>
            <Flex
                as="main"
                justifyContent="center"
                px={isLargerThan768 ? "15vw" : "8vw"}
                py={isLargerThan768 ? "4vw" : "8vw"}
            >
                <Center>
                    <Stack
                        spacing={10}
                        justifyContent="center"
                        my={["20vh", "20vh", "30vh", "30vh"]}
                    >
                        <Center>
                            <Spinner size={"xl"} />
                        </Center>
                        <Center>
                            <Text fontSize="xl" fontWeight="bold">
                                Redirecting...
                            </Text>
                        </Center>
                    </Stack>
                </Center>
            </Flex>
        </>
    )
}