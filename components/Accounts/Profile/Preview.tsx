import { Flex, Box, VStack, Stack, Badge, Image, Text, chakra } from "@chakra-ui/react";
import { useAuth } from "../../../contexts/Auth";
import useMediaQuery from "../../../hook/useMediaQuery";
import Badges from "../Badges/Badges";
import CompactBadges from "../Badges/CompactBadges";
import MiniBadges from "../Badges/MiniBadges";

export default function Preview() {
    const { user, userData } = useAuth();
    const isLargerThan1200 = useMediaQuery(1200);
    const isLargerThan400 = useMediaQuery(400);
    const isLargerThan600 = useMediaQuery(600);
    const isLargerThan1360 = useMediaQuery(1360);
    const isLargerThan1215 = useMediaQuery(1215);

    return (
        <>
            <Flex flexDirection={"column"}>
                <Box border={"1px"} borderColor={"black"} rounded={"xl"} pb={4}>
                    <VStack spacing={4}>
                        <Image
                            src={userData.banner}
                            w={"1200px"}
                            h={"200px"}
                            objectFit="cover"
                            alt={"banner"}
                            borderRadius="10px 10px 0px 0px"
                            fallbackSrc={`${process.env.NEXT_PUBLIC_URL}/api/banners/default.jpg`}
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
                                fallbackSrc={`${process.env.NEXT_PUBLIC_URL}/api/avatars/default.jpg`}
                            />

                            {/* Mobile view */}
                            {isLargerThan1200 ? (
                                <></>
                            ) : (
                                <>
                                    {isLargerThan400 ? (
                                        <>
                                            {isLargerThan600 ? (
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
                            {isLargerThan1200 ? (
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
                                    <chakra.span
                                        color={"#B9BBBE"}
                                    >
                                        #{user.user_metadata.tag}
                                    </chakra.span>
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