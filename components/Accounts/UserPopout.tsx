import { Button, Avatar, Spinner, Text, Flex, Box, Menu, MenuButton, MenuGroup, MenuList, Image } from "@chakra-ui/react";
import { useAuth } from "../../contexts/Auth";
import CompactBadges from "./Badges/CompactBadges";

export default function UserPopout({
    type
}) {
    const { user, userData } = useAuth();

    switch (type) {
        default: {
            return (
                <>
                    <Text>Invalid mode option.</Text>
                </>
            )
        }
        case "menu": {
            return (
                <>
                    {userData === undefined ? (
                        <>
                            <Button isLoading>
                                <Spinner />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Menu>
                                <MenuButton as={Button} leftIcon={<Avatar src={userData.avatar} size="xs" />} px={2}>
                                    {user.user_metadata.username + "#" + user.user_metadata.tag}
                                </MenuButton>
                                <MenuList pt={0}>
                                    <Image
                                        src={userData.banner}
                                        w={"350px"}
                                        h={"150px"}
                                        objectFit="cover"
                                        alt={"banner"}
                                        borderRadius="5px 5px 0px 0px"
                                        fallbackSrc={`${process.env.NEXT_PUBLIC_URL}/api/banners/default.jpg`}
                                    />
                                    <Flex
                                        flexDirection="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        w={"full"}
                                        px={"10px"}
                                        pt={"8px"}
                                    >
                                        <Image
                                            src={userData.avatar}
                                            rounded="full"
                                            w={"96px"}
                                            h={"96px"}
                                            mt={"-15%"}
                                            border={"2px"}
                                            borderColor={"#111111"}
                                            alt={"avatar"}
                                            fallbackSrc={`${process.env.NEXT_PUBLIC_URL}/api/avatars/default.jpg`}
                                        />
                                        <Box>
                                            <CompactBadges />
                                        </Box>
                                    </Flex>
                                    <MenuGroup title={`${user.user_metadata.username}#${user.user_metadata.tag}`} p={0} fontSize={"xl"} />
                                </MenuList>
                            </Menu>
                        </>
                    )}
                </>
            )
        }
    }
}