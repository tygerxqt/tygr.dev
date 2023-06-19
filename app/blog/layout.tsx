export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex flex-col items-center justify-center w-full max-w-[800px]">
                {children}
            </div>
        </>
    )
}