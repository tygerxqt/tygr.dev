import { Button, Avatar, Spinner, Text, Flex, Box, Menu, MenuButton, MenuGroup, MenuList, Image, useMenu } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import supabase from "../../lib/SupabaseClient";
import { UserProfile } from "../../types/UserProfile";
import CompactBadges from "./Badges/CompactBadges";

export default function UserPopout({
    type
}) {
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile>({} as UserProfile);

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            const { data, status: dataStatus } = await axios.get(`/api/users/${user.id}?token=${session.access_token}`);
            if (dataStatus != 200) throw new Error(data.message);
            setUserData(data as UserProfile);
            setLoading(false);
            setUpdate(false);
        }

        if (session) {
            fetch();
        } else {
            setLoading(false);
        }
    }, [update]);

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