import { Button, Avatar, Spinner, Text, Flex, Box, Menu, MenuButton, MenuGroup, MenuList, Image, useMenu, toast, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import supabase from "../../lib/SupabaseClient";
import { UserProfile } from "../../types/Account/UserProfile";
import CompactBadges from "./Badges/CompactBadges";

export default function UserPopout({
    type
}) {
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile>({} as UserProfile);
    const toast = useToast();

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            try {
                await axios.get(`/api/users/@me`).then(response => {
                    setUserData(response.data as UserProfile)
                }).catch(err => {
                    throw new Error(err)
                })
            } catch (err) {
                toast({
                    title: "Error",
                    description: "An error occurred while fetching your profile",
                    status: "error",
                    duration: 9000,
                    isClosable: true
                })
            } finally {
                setLoading(false);
                setUpdate(false);
            }
        }

        if (session) {
            fetch();
        } else {
            setLoading(false);
        }
    }, [update, toast]);

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
                    {loading ? (
                        <>
                            <Button isLoading>
                                <Spinner />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Menu>
                                <MenuButton as={Button} leftIcon={<Avatar src={userData.avatar} size="xs" />} px={"2"}>
                                    {supabase.auth.user().user_metadata.username + "#" + supabase.auth.user().user_metadata.tag}
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
                                    <MenuGroup title={`${supabase.auth.user().user_metadata.username}#${supabase.auth.user().user_metadata.tag}`} p={0} fontSize={"xl"} />
                                </MenuList>
                            </Menu>
                        </>
                    )}
                </>
            )
        }
    }
}