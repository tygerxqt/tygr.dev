import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
    return (
        <>
            <div className="flex flex-col items-center pt-4 w-full">
                <div className="flex flex-col min-w-full">
                    <hr className="w-full border border-black/10 dark:border-white/10" />
                    <div className="flex flex-col gap-2 items-center px-2 py-4">
                        {/* Now playing */}
                        <div className="flex justify-center items-center text-neutral-500">
                        </div>

                        {/* Links */}
                        <div className="grid grid-cols-3 justify-between w-full">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <Link href="/">
                                    <Button variant="link" className="p-0 py-1 text-sm sm:text-base">
                                        About
                                    </Button>
                                </Link>
                                <Link href="/projects">
                                    <Button variant="link" className="p-0 py-1 text-sm sm:text-base">
                                        Projects
                                    </Button>
                                </Link>
                                <Link href="/blog">
                                    <Button variant="link" className="p-0 py-1 text-sm sm:text-base">
                                        Blog
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <Link href="/gear">
                                    <Button variant="link" className="p-0 py-1 text-sm sm:text-base">
                                        My Gear
                                    </Button>
                                </Link>
                                <Link href="/gallery">
                                    <Button variant="link" className="p-0 py-1 text-sm sm:text-base">
                                        Gallery
                                    </Button>
                                </Link>
                                <Link href="/links">
                                    <Button variant="link" className="p-0 py-1 text-sm sm:text-base">
                                        Links
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex flex-col gap-2 justify-end items-end">
                                <Link href="https://github.com/tygerxqt">
                                    <Button variant="link" className="p-0 py-1 text-sm sm:text-base">
                                        GitHub
                                    </Button>
                                </Link>
                                <Link href="https://twitter.com/tygerxqt">
                                    <Button variant="link" className="p-0 py-1 text-sm sm:text-base">
                                        Twitter
                                    </Button>
                                </Link>
                                <Link href="https://www.instagram.com/tygerxqt">
                                    <Button variant="link" className="p-0 py-1 text-sm sm:text-base">
                                        Instagram
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}