import Image from "next/image";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

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
                    <a href="/gallery">
                        <Button variant="link">
                            Gallery
                        </Button>
                    </a>
                    <a href="/blog">
                        <Button variant="link">
                            Blog
                        </Button>
                    </a>
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