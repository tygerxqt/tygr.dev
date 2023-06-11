import Image from "next/image"
import Link from "next/link"

export default function BlogCard({ title, summary, image, slug, time }: { title: string, summary: string, image: string, slug: string, time: string }) {
    return (
        <>
            <Link href={`/blog/${slug}`}>
                <button className="w-full min-h-[550px] border border-black/10 dark:border-white/10 flex flex-col p-0 m-0 rounded-lg text-start sm:hover:-translate-y-1 transition-transform">
                    <Image src={image} alt="blog post" height={550} width={1920} className="flex-1 object-cover rounded-lg grow" />
                    <div className="bottom-0 left-0 right-0 w-full rounded-lg backdrop-blur">
                        <div className="absolute bottom-0 w-full p-3 border-t rounded-b-lg border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur">
                            <div className="flex flex-row justify-between w-full gap-2">
                                <h1 className="items-center text-xl font-black sm:text-2xl font-display">
                                    {title}
                                </h1>
                                <p>
                                    {time}
                                </p>
                            </div>
                            <p>
                                {summary}
                            </p>
                        </div>
                    </div>
                </button>
            </Link>
        </>
    )
} 