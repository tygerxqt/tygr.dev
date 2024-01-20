"use client";

import Image from "next/image";
import Link from "next/link";
import { Drawer } from "vaul";
import Icons from "../icons";
import { Button } from "../ui/button";

export default function SideNav({ children }: { children?: React.ReactNode }) {
    return (
        <Drawer.Root direction="right" shouldScaleBackground={true}>
            <Drawer.Trigger asChild>
                {children}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/50" />
                <Drawer.Content className="bg-neutral-200 dark:bg-neutral-800 rounded-l-[10px] flex flex-col rounded-t-[10px] h-full w-[200px] mt-24 fixed bottom-0 right-0">
                    <div className="flex-1 h-full p-4 bg-neutral-200 dark:bg-neutral-900">
                        <div className="max-w-md mx-auto">
                            <div className="flex flex-row items-center justify-between">
                                <Link href="/" passHref>
                                    <div>
                                        <Image width={32} height={32} src="/logos/dark.jpg" alt="logo" className="hidden dark:block" />
                                        <Image width={32} height={32} src="/logos/light.jpg" alt="logo" className="dark:hidden" />
                                    </div>
                                </Link>
                                <Drawer.Close>
                                    <Button size="icon" variant="ghost">
                                        <Icons.X className="w-6 h-6" />
                                    </Button>
                                </Drawer.Close>
                            </div>
                            <hr className="my-4 border-b border-black/10 dark:border-white/10" />
                            <div className="flex flex-col items-start w-full gap-4">
                                <Link href="/" passHref className="w-full">
                                    <Button variant="bordered" className="flex flex-row w-full gap-2">
                                        <Icons.User className="w-6 h-6" /> About
                                    </Button>
                                </Link>
                                <Link href="/projects" passHref className="w-full">
                                    <Button variant="bordered" className="flex flex-row w-full gap-2">
                                        <Icons.Package className="w-6 h-6" /> Projects
                                    </Button>
                                </Link>
                                <Link href="/blog" passHref className="w-full">
                                    <Button variant="bordered" className="flex flex-row w-full gap-2">
                                        <Icons.Paperclip className="w-6 h-6" /> Blog
                                    </Button>
                                </Link>
                                <Link href="/gallery" passHref className="w-full">
                                    <Button variant="bordered" className="flex flex-row w-full gap-2">
                                        <Icons.Image className="w-6 h-6" /> Gallery
                                    </Button>
                                </Link>
                                <Link href="/gear" passHref className="w-full">
                                    <Button variant="bordered" className="flex flex-row w-full gap-2">
                                        <Icons.Wrench className="w-6 h-6" /> Gear
                                    </Button>
                                </Link>
                                <Link href="/links" passHref className="w-full">
                                    <Button variant="bordered" className="flex flex-row w-full gap-2">
                                        <Icons.Link className="w-6 h-6" /> Links
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}