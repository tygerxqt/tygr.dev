import { Flex, Box, VStack, Stack, SimpleGrid, Badge, Image, Text } from "@chakra-ui/react";
import useMediaQuery from "../../../hook/useMediaQuery";
import Badges from "../Badges/Badges";
import CompactBadges from "../Badges/CompactBadges";
import MiniBadges from "../Badges/MiniBadges";

export default function Preview({ user, userData }) {
    const isLargerThan850 = useMediaQuery(850);
    const isLargerThan400 = useMediaQuery(400);
    const isLargerThan500 = useMediaQuery(500);
    const isLargerThan1360 = useMediaQuery(1360);
    const isLargerThan1215 = useMediaQuery(1215);

    return (
        <>
            <Flex flexDirection={"column"}>
                <Box border={"1px"} borderColor={"black"} rounded={"lg"} pb={4}>
                    <VStack spacing={4}>
                        <Image
                            src={userData.banner}
                            w={"1200px"}
                            h={"200px"}
                            objectFit="cover"
                            alt={"banner"}
                        />
                        <Flex
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            w={"full"}
                            px={{ base: "1rem", md: "1.5rem", lg: "2rem" }}
                        >
                            <Image
                                src={userData.avatar}
                                rounded="full"
                                w={"128px"}
                                h={"128px"}
                                mt={"-12.5%"}
                                border={"2px"}
                                borderColor={"#111111"}
                                alt={"avatar"}
                            />

                            {/* Mobile view */}
                            {isLargerThan850 ? (
                                <></>
                            ) : (
                                <>
                                    {isLargerThan400 ? (
                                        <>
                                            {isLargerThan500 ? (
                                                <Stack isInline spacing={2}>
                                                    <Badges />
                                                </Stack>
                                            ) : (
                                                <Stack isInline spacing={2}>
                                                    <MiniBadges />
                                                </Stack>
                                            )}
                                        </>
                                    ) : (
                                        <Box>
                                            <CompactBadges />
                                        </Box>
                                    )}
                                </>
                            )}

                            {/* Desktop view */}
                            {isLargerThan850 ? (
                                <>
                                    {isLargerThan1360 ? (
                                        <Stack isInline spacing={2} >
                                            <Badges />
                                        </Stack>
                                    ) : (
                                        <>
                                            {isLargerThan1215 ? (
                                                <Stack isInline spacing={2}>
                                                    <MiniBadges />
                                                </Stack>
                                            ) : (
                                                <Stack isInline spacing={2}>
                                                    <CompactBadges />
                                                </Stack>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}

                        </Flex>
                        <Flex
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            w={"full"}
                            px={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }}
                        >
                            <Stack spacing={0}>
                                <Text fontSize="26px" fontWeight="bold">
                                    {user.user_metadata.username}
                                    {userData.cutie === true ? (
                                        <Badge ml='2' colorScheme='pink'>
                                            Cutie
                                        </Badge>
                                    ) : <div />}
                                </Text>
                                <Text fontSize="14px">{user.email}</Text>
                            </Stack>
                            <div />
                        </Flex>
                    </VStack>
                </Box>
            </Flex>
        </>
    )
}