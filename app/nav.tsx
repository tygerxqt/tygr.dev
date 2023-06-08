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
            <nav className="flex flex-row gap-4 justify-between items-center px-2 py-4 w-full">
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
                                    <ImageIcon className="mr-2 w-4 h-4" />
                                    <span>Gallery</span>
                                </DropdownMenuItem>
                            {/* </Link> */}
                            {/* <Link href="/tools"> */}
                                <DropdownMenuItem disabled>
                                    <Wrench className="mr-2 w-4 h-4" />
                                    <span>Tools</span>
                                </DropdownMenuItem>
                            {/* </Link> */}
                            {/* <Link href="/links"> */}
                                <DropdownMenuItem disabled>
                                    <LinkIcon className="mr-2 w-4 h-4" />
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