import Image from "next/image";
import { Button } from "../components/ui/button";
import { ArrowDown, ChevronDown, ImageIcon, LinkIcon, Menu, Wrench } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Nav() {
    return (
        <>
            <nav className="flex flex-row items-center justify-between w-full gap-4 px-2 py-4">
                <div>
                    <Image width={32} height={32} src="/logos/dark.jpg" alt="logo" className="hidden dark:block" />
                    <Image width={32} height={32} src="/logos/light.jpg" alt="logo" className="dark:hidden" />
                </div>

                <div className="hidden sm:flex">
                    <a href="/">
                        <Button variant="link">
                            About
                        </Button>
                    </a>
                    <a href="/projects">
                        <Button variant="link">
                            Projects
                        </Button>
                    </a>
                    <a href="/blog">
                        <Button variant="link">
                            Blog
                        </Button>
                    </a>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="outline-none">
                            <Button variant="link">
                                <ChevronDown />
                                <span className="sr-only">More items</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {/* <Link href="/gallery"> */}
                            <DropdownMenuItem disabled>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                <span>Gallery</span>
                            </DropdownMenuItem>
                            {/* </Link> */}
                            {/* <Link href="/gear"> */}
                            <DropdownMenuItem disabled>
                                <Wrench className="w-4 h-4 mr-2" />
                                <span>Gear</span>
                            </DropdownMenuItem>
                            {/* </Link> */}
                            {/* <Link href="/links"> */}
                            <DropdownMenuItem disabled>
                                <LinkIcon className="w-4 h-4 mr-2" />
                                <span>Links</span>
                            </DropdownMenuItem>
                            {/* </Link> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div>
                    <ThemeToggle />
                    <Button variant="ghost" className="text-black sm:hidden dark:text-white" size="icon">
                        <Menu />
                    </Button>
                </div>
            </nav>
        </>
    )
}