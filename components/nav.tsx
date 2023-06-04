import Image from "next/image";
import { Button } from "./ui/button";

export default function Nav() {
    return (
        <>
            <nav className="flex flex-row items-center justify-between gap-4 py-4 pb-8 w-full px-2">
                <div>
                    <Image width={32} height={32} src="/logos/dark.jpg" alt="logo" className="hidden dark:block" />
                    <Image width={32} height={32} src="/logos/light.jpg" alt="logo" className="dark:hidden" />
                </div>

                <div>
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
                    <a href="/photos">
                        <Button variant="link">
                            Photos
                        </Button>
                    </a>
                    <a href="/blog">
                        <Button variant="link">
                            Blog
                        </Button>
                    </a>
                </div>
            </nav>
        </>
    )
}