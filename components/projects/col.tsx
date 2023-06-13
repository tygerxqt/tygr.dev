export default function ProjectCol({ href, title, desc, year }: { href: string, title: string, desc: string, year: number }) {
    return (
        <>
            <a className="flex flex-row items-center w-full p-2 overflow-hidden rounded-md whitespace-nowrap text-ellipsis hover:bg-neutral-200 dark:hover:bg-neutral-800" target="_blank" href={href}>
                <p className="gap-1 font-semibold">
                    {title} {" "}
                    <span className="inline-block text-sm font-normal text-neutral-500">
                        • {desc}
                    </span>
                </p>
                <span className="hidden w-full sm:flex sm:flex-row sm:items-center ">
                    <hr className="flex-1 mx-2 border border-black/10 dark:border-white/10" />
                    <span className="text-sm font-medium text-neutral-500">
                        {year}
                    </span>
                </span>
            </a>
        </>
    )
}