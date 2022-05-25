import { Skeleton, Tag, TagLeftIcon, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillBug } from "react-icons/ai";
import { BiDonateHeart, BiCode } from "react-icons/bi";
import { BsTerminalFill } from "react-icons/bs";
import { RiParkingFill } from "react-icons/ri";
import { MdLocalPolice } from "react-icons/md";
import useMediaQuery from "../../hook/useMediaQuery";
import supabase from "../../lib/SupabaseClient";

export default function CompactBadges() {
    const user = supabase.auth.user();
    const session = supabase.auth.session();
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(false)
    const isLargerThan500 = useMediaQuery(500);
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
                values[0] = "Admin"
                values[1] = 'blue'
                values[2] = MdLocalPolice
            }
                break;
            case 'bug': {
                values[0] = "Bug Hunter"
                values[1] = 'green'
                values[2] = AiFillBug
            }
                break;
            case 'pixel': {
                values[0] = "Pixel Subscriber"
                values[1] = 'white'
                values[2] = RiParkingFill
            }
                break;
            case 'donator': {
                values[0] = "Donator"
                values[1] = 'red'
                values[2] = BiDonateHeart
            }
                break;
            case 'contributor': {
                values[0] = "Contributor"
                values[1] = 'orange'
                values[2] = BiCode
            }
                break;
            case 'beta': {
                values[0] = "Beta Tester"
                values[1] = 'purple'
                values[2] = BsTerminalFill
            }
                break;
        }
        return values
    }

    const Tags = badges.map((item) => (
        <>
            <Tooltip hasArrow placement={"top"} label={getTag(item)[0]} key={item} >
                <Tag
                    key={item}
                    colorScheme={getTag(item)[1]}
                    size={'md'}
                >
                    <TagLeftIcon as={getTag(item)[2]} marginEnd={0}></TagLeftIcon>
                </Tag>
            </Tooltip>
        </>
    ));

    return (
        <>
            {Tags}
        </>
    );
}