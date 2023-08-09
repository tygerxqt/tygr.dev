import { Link, cms } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";

export default async function LinksPage() {
    const links = await cms.request(readItems("links"));

    const linksByType = links.reduce((acc: any, link) => {
        // Only one type can be selected at a time
        const type = link.type[0].toLowerCase();
        if (!acc[type]) acc[type] = [];
        acc[type].push(link);
        return acc;
    }, {});

    return (
        <>
            <div className="flex flex-col gap-2 pt-2 w-full max-w-[800px]">
                <div className="pb-4">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        ~/links
                    </h2>
                    <p className="text-sm">
                        A bunch of useful links ranging from all my social media, resources that are helpful, to even my wishlist.
                    </p>
                </div>
                {linksByType && Object.keys(linksByType).map((type, i) => (
                    <div key={i} className="flex flex-col gap-2 pb-2">
                        <h3 className="text-lg font-bold capitalize underline-offset-2">{type}s</h3>
                        {linksByType[type].map((link: Link, i: number) => (
                            <a className="flex flex-row items-center w-full p-2 overflow-hidden rounded-md whitespace-nowrap text-ellipsis hover:bg-neutral-200 dark:hover:bg-neutral-800" target="_blank" rel="noopener noreferrer" href={link.link}>
                                <p className="flex flex-row items-center gap-2 font-semibold">
                                    <Image src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.link}&size=16`} width={16} height={16} alt="" aria-label={`Favicon for ${link.name}`} />
                                    {" "}
                                    <span className="inline-block text-sm font-normal text-neutral-500">
                                        {link.name}
                                    </span>
                                </p>
                                <span className="flex flex-row items-center w-full">
                                    <hr className="flex-1 mx-2 border border-black/10 dark:border-white/10 min-w-[24px]" />
                                    <span className="hidden text-sm font-medium text-neutral-500 sm:block">
                                        {link.summary}
                                    </span>
                                    <span className="text-sm font-medium text-neutral-500 sm:hidden">
                                        {link.link.replace(/(https?:\/\/)?(www.)?/i, '').split('/')[0]}
                                    </span>
                                </span>
                            </a>
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}