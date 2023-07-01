import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'tygr.dev | Archived Blog',
  description: "All of my archived blog posts.",
  keywords: ["tygerxqt archived blog", "ty mason archived blog", "tygr dev archived blog", "tygr archived blog", "tyger796 archived blog", "tyger archived blog"],
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