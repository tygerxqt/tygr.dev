import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'tygr.dev | Projects',
    description: "An entire list of projects I've worked or contributed.",
    keywords: ["tygerxqt projects", "ty mason projects", "tygr dev projects", "tygr projects", "tyger796 projects", "tyger projects"],
}

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex flex-col items-center justify-center w-full">
                {children}
            </div>
        </>
    )
}