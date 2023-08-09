import { Tool } from "@/lib/directus";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaShoppingCart } from "react-icons/fa";

export default function GearCard({ tool }: { tool: Tool }) {
    return (
        <>
            <div className="flex flex-col w-full border rounded-lg border-black/10 dark:border-white/10">
                <Image src={`${process.env.NEXT_PUBLIC_CMS_URL}/assets/${tool.image}`} alt={tool.name} width={800} height={400} className="border-b rounded-tl-lg rounded-tr-lg border-black/10 dark:border-white/10" />

                <div className="flex flex-row gap-8 p-3">
                    <div className="flex flex-col justify-between w-full ">
                        <div className="flex flex-row gap-2">
                            {tool.dob && (
                                <div className="px-2 py-1 mb-1 text-xs font-semibold border rounded-lg border-black/10 dark:border-white/10 text-neutral-400">
                                    Born: {new Date(tool.dob).toLocaleDateString()}
                                </div>
                            )}
                            {tool.dod && (
                                <div className="px-2 py-1 mb-1 text-xs font-semibold border rounded-lg border-black/10 dark:border-white/10 text-neutral-400">
                                    Died: {new Date(tool.dod).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-0">
                            <h2 className="text-2xl font-semibold">
                                {tool.name}
                            </h2>
                            <p className="text-sm dark:text-neutral-400">{tool.summary}</p>
                        </div>
                    </div>
                    <Link href={tool.url} passHref target="_blank">
                        <Button size={"icon"} className="px-2 py-1 h-[36px] w-[36px]">
                            <FaShoppingCart fill="currentColor" className="w-full h-full" />
                        </Button>
                    </Link>
                </div>
            </div >
        </>
    )
}