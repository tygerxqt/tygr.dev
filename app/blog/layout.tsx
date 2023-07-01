import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'tygr.dev | Blog',
    description: "All of my blog posts and tutorials. I write about web development, programming, and games.",
    keywords: ["tygerxqt blog", "ty mason blog", "tygr dev blog", "tygr blog", "tyger796 blog", "tyger blog"],
}

export default function BlogLayout({
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