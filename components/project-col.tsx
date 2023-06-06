export default function ProjectCol({ href, title, desc, year }: { href: string, title: string, desc: string, year: number}) {
    return (
        <>
            <a className="flex flex-row items-center p-2 w-full rounded-md hover:bg-neutral-200" target="_blank" href={href}>
                <p className="gap-1 font-semibold">
                    {title} {" "}
                    <span className="text-sm font-normal text-neutral-500">
                        • {desc}
                    </span>
                </p>
                <hr className="flex-1 mx-2 border border-black/10 dark:border-white/10" />
                <span className="text-sm font-medium text-neutral-500">
                    {year}
                </span>
            </a>
        </>
    )
}