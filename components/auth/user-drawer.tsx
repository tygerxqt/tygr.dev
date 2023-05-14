"use client";

import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerFooter
} from "@/components/ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, FileText, LogOut, User } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import AuthDrawer from "./auth-drawer";
import { useAuth } from "./context";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function UserDrawer() {
    const [open, setOpen] = useState(false);
    const { user, avatar, banner, logOut } = useAuth();

    return (
        <>
            {user ? (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild className="cursor-pointer">
                        <Avatar className="border border-black/10 dark:border dark:border-white/10">
                            <AvatarImage src={avatar} alt="Avatar" aria-label="User Avatar" />
                            <AvatarFallback>{user?.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                    </DrawerTrigger>
                    <DrawerContent position="bottom" size="content" className="p-0 border-t rounded-t-lg border-black/10 dark:border-white/10" closeButton={true}>
                        <DrawerHeader className="p-0">
                            <AspectRatio ratio={2 / 1}>
                                {!user.verified && (
                                    <div className="h-[32px] w-full absolute z-[51] top-0 bg-[#EBCB8B] text-black dark:text-black">
                                        <div className="flex flex-row items-center rounded-none justify-start gap-2 max-h-[32px] p-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            <p className="text-sm font-semibold">Please check your email for a verification link.</p>
                                        </div>
                                    </div>
                                )}
                                <Image src={banner} width={640} height={0} alt="banner" className="object-cover w-full h-full" />
                            </AspectRatio>
                        </DrawerHeader>
                        <div className="flex flex-col h-[4.4rem] px-3 text-xl font-semibold -translate-y-14 min-h-20">
                            <Avatar className="w-20 h-20 mb-2 border border-black/10 dark:border-white/10">
                                <AvatarImage src={avatar} alt="Avatar" aria-label="User Avatar" />
                                <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-row items-center justify-between rounded-none">
                                <div>
                                    <span className="text-black dark:text-white">
                                        {user.name}
                                    </span>
                                </div>
                                <div>
                                    {/* Badges go here */}
                                </div>
                            </div>
                        </div>
                        <DrawerFooter className="flex flex-col text-center border-t sm:flex-col sm:justify-center border-black/20 dark:border-white/20">
                            <Link href="/profile">
                                <Button className="flex flex-row items-center w-full rounded-none" variant="ghost">
                                    <User className="w-4 h-4 mr-2" />
                                    <span>
                                        Profile
                                    </span>
                                </Button>
                            </Link>
                            <Link href="/account">
                                <Button className="flex flex-row items-center w-full rounded-none" variant="ghost">
                                    <FileText className="w-4 h-4 mr-2" />
                                    <span>
                                        Account
                                    </span>
                                </Button>
                            </Link>
                            <hr className="w-full border-black/10 dark:border-white/10" />
                            <Button className="flex flex-row items-center rounded-none" variant="ghost" onClick={() => logOut()}>
                                <LogOut className="w-4 h-4 mr-2" />
                                <span>
                                    Log out
                                </span>
                            </Button>
                        </DrawerFooter>
                    </DrawerContent >
                </Drawer >
            ) : (
                <AuthDrawer>
                    <Button size={"sm"}>Login</Button>
                </AuthDrawer>
            )}
        </>
    )
}