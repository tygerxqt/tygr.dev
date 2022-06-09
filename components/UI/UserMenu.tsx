import { Menu, MenuButton, Avatar, MenuList, Flex, Box, MenuGroup, MenuDivider, MenuItem, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { AiFillIdcard } from "react-icons/ai";
import { BiCamera, BiCode, BiLogOut } from "react-icons/bi";
import { MdAccountCircle, MdDashboard, MdFeedback } from "react-icons/md";
import { RiParkingFill } from "react-icons/ri";
import supabase from "../../lib/SupabaseClient";
import CompactBadges from "../Accounts/Badges/CompactBadges";

export default function UserMenu({ avatar, banner, pixel }) {
    return (
        <>
            <Menu>
                <MenuButton
                    as={Avatar}
                    ml={"3vw"}
                    src={avatar}
                    size="md"
                />
                <MenuList pt={0}>
                    <Image
                        src={banner}
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
                            src={avatar}
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
                    <MenuGroup title={`${supabase.auth.user().user_metadata.username}#${supabase.auth.user().user_metadata.tag}`} p={0} fontSize={"xl"}>
                        <MenuDivider />
                        <Link href="/profile" passHref>
                            <MenuItem closeOnSelect={true} icon={<MdAccountCircle fontSize={"16px"} />}>Profile</MenuItem>
                        </Link>
                        <Link href="/account" passHref>
                            <MenuItem closeOnSelect={true} icon={<AiFillIdcard fontSize={"16px"} />}>Account</MenuItem>
                        </Link>
                        {pixel ? (
                            <>
                                <MenuDivider />
                                <MenuGroup>
                                    <Link href="/dashboard" passHref>
                                        <MenuItem closeOnSelect={true} icon={<MdDashboard fontSize={"16px"} />}>Dashboard</MenuItem>
                                    </Link>
                                    <Link href="/feed" passHref>
                                        <MenuItem closeOnSelect={true} icon={<MdFeedback fontSize={"16px"} />}>Feed</MenuItem>
                                    </Link>
                                    <Link href="/photography" passHref>
                                        <MenuItem closeOnSelect={true} icon={<BiCamera fontSize={"16px"} />}>Photography</MenuItem>
                                    </Link>
                                </MenuGroup>
                                <Link href="/projects/beta" passHref>
                                    <MenuItem closeOnSelect={true} icon={<BiCode fontSize={"16px"} />}>Early access</MenuItem>
                                </Link>

                            </>
                        ) : (
                            <>
                                <Link href="/pixels" passHref>
                                    <MenuItem closeOnSelect={true} icon={<RiParkingFill fontSize={"16px"} />}>Pixels</MenuItem>
                                </Link>
                            </>
                        )}
                    </MenuGroup>
                    <MenuGroup>
                        <MenuDivider />
                        <MenuItem
                            closeOnSelect={true}
                            icon={<BiLogOut fontSize={"16px"} />}
                            onClick={() => {
                                supabase.auth.signOut();
                                window.location.reload();
                            }}
                        >
                            Sign out
                        </MenuItem>
                    </MenuGroup>
                </MenuList>
            </Menu>
        </>
    )
}