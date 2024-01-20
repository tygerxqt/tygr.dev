import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Icons from "@/components/icons";
import SideNav from "./side";

export default function NavBar() {
    return (
        <>
            <nav className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-row items-center justify-between max-w-[800px] w-full gap-4 px-2 py-4">
                    <Link href="/" passHref>
                        <div>
                            <Image width={32} height={32} src="/logos/dark.jpg" alt="logo" className="hidden dark:block" />
                            <Image width={32} height={32} src="/logos/light.jpg" alt="logo" className="dark:hidden" />
                        </div>
                    </Link>

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
                                    <Icons.ChevronDown />
                                    <span className="sr-only">More items</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Link href="/gallery">
                                    <DropdownMenuItem>
                                        <Icons.Image className="w-4 h-4 mr-2" />
                                        <span>Gallery</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/gear">
                                    <DropdownMenuItem>
                                        <Icons.Wrench className="w-4 h-4 mr-2" />
                                        <span>Gear</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/links">
                                    <DropdownMenuItem>
                                        <Icons.Link className="w-4 h-4 mr-2" />
                                        <span>Links</span>
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div>
                        <ThemeToggle />
                        <SideNav>
                            <Button variant="ghost" className="text-black sm:hidden dark:text-white" size="icon">
                                <Icons.Menu />
                            </Button>
                        </SideNav>
                    </div>
                </div>
            </nav>
        </>
    )
}