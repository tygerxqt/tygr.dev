import { Box, Icon, Skeleton, Stack, Tag, TagLabel, TagLeftIcon, Flex, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillBug, AiFillHeart, AiFillCrown } from "react-icons/ai";
import { BiDonateHeart, BiCode } from "react-icons/bi";
import { RiParkingFill } from "react-icons/ri";
import useMediaQuery from "../../hook/useMediaQuery";
import supabase from "../../lib/SupabaseClient";

export default function Badges() {
    const user = supabase.auth.user();
    const session = supabase.auth.session();
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(false)
    const isLargerThan400 = useMediaQuery(400);
    useEffect(() => {
        setLoading(true);
        fetch(`/api/users/${user.id}?token=${session.access_token}`)
            .then((res) => res.json())
            .then((data) => {
                const filtered = Object.keys(data.badges[0].badges).filter((key) => data.badges[0].badges[key]);
                setBadges(filtered);
            }).finally(() => setLoading(false));
    }, [user, session]);

    const getTag = (tag) => {
        let values = []
        switch (tag) {
            case 'admin': {
                values[0] = 'blue'
                values[1] = AiFillCrown
            }
                break;
            case 'cute': {
                values[0] = 'pink'
                values[1] = AiFillHeart
            }
                break;
            case 'bug': {
                values[0] = 'green'
                values[1] = AiFillBug
            }
                break;
            case 'pixel': {
                values[0] = 'white'
                values[1] = RiParkingFill
            }
                break;
            case 'donator': {
                values[0] = 'red'
                values[1] = BiDonateHeart
            }
                break;
            case 'contributor': {
                values[0] = 'yellow'
                values[1] = BiCode
            }
                break;
        }
        return values
    }

    // const Tags = badges.map((item) => (
    //     <Tag
    //         key={item}
    //         colorScheme={getTag(item)[0]}
    //         size={isLargerThan800 ? 'lg' : 'sm'}
    //         ml={2}
    //         mt={2}
    //     >
    //         <TagLeftIcon as={getTag(item)[1]} marginEnd={0}></TagLeftIcon>
    //     </Tag>
    // ))

    const TagsMini = badges.map((item) => (
        <Icon as={getTag(item)[1]} key={item} fontSize={"24px"} />
    ))

    return (
        <>
            <Skeleton isLoaded={!loading}>
                {isLargerThan400 ? (
                    <Stack isInline spacing={2}>
                        {TagsMini}
                    </Stack>
                ) : (
                    <Stack isInline>
                        <Box>
                            {TagsMini}
                        </Box>
                    </Stack>
                )}
            </Skeleton>
        </>
    )
}