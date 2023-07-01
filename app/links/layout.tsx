import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'tygr.dev | Links',
    description: "A bunch of useful links ranging from all my social media, resources that are helpful, to even my wishlist.",
    keywords: ["tygerxqt links", "ty mason links", "tygr dev links", "tygr links", "tyger796 links", "tyger links"],
}

export default function LinksLayout({
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