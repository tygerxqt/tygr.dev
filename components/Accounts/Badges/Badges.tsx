import { Tag, TagLeftIcon, Tooltip } from "@chakra-ui/react";
import { AiFillBug } from "react-icons/ai";
import { BiDonateHeart, BiCode } from "react-icons/bi";
import { BsTerminalFill } from "react-icons/bs";
import { RiParkingFill } from "react-icons/ri";
import { MdLocalPolice } from "react-icons/md";
import { useAuth } from "../../../contexts/Auth";

function ThouBadges() {
    const { userData } = useAuth();
    const array = Object.keys(userData.badges).filter((key) => userData.badges[key]);
    if (userData.pixel === true) {
        array.push("pixel");
    }

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

    const Tags = array.map((item) => (
        <>
            <Tooltip hasArrow placement={"top"} label={getTag(item)[0]} key={item} >
                <Tag
                    key={item}
                    colorScheme={getTag(item)[1]}
                    size={'lg'}
                    ml={2}
                >
                    <TagLeftIcon key={item} as={getTag(item)[2]} marginEnd={0}></TagLeftIcon>
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

export default function Badges() {


    const { userData } = useAuth();

    return (
        <>
            {userData === undefined ? (
                null
            ) : (
                <ThouBadges />
            )}
        </>
    );
}