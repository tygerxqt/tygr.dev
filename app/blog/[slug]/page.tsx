import { allPosts } from "@/.contentlayer/generated";
import { format, parseISO } from "date-fns";
import { getMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import MDXComponents from "../mdx-components";

export async function generateStaticParams() {
    return allPosts.map((post) => ({
        slug: post._raw.flattenedPath,
    }))
}

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
    const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)
    if (!post) throw new Error(`Post not found for slug: ${params.slug}`)
    return {
        title: post.title,
        description: post.summary,
        image: post.image,
        date: post.date,
        type: 'article',
    }
}

export default async function PostPage({ params }: { params: { slug: string, } }) {
    const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

    if (!post) notFound();

    if (post.archived) redirect(`/blog/archive/${post.slug}`);

    const MDXContent = getMDXComponent(post.body.code);

    return (
        <>
            <article className="p-2 py-4 mx-auto">
                <div className="flex flex-col gap-2 pb-2">
                    <h1 className="text-3xl font-black font-display sm:text-4xl">{post.title}</h1>
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-row items-center gap-2">
                            <Image src={"https://secure.gravatar.com/avatar/871c2885d0acbbc08be33547816255e3?size=512"} alt="T" aria-label="Author avatar" width={28} height={28} className="rounded-full" />
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                tygerxqt • {" "}
                            </p>
                            <time dateTime={post.date} className="items-center text-sm text-neutral-500 dark:text-neutral-400">
                                {format(parseISO(post.date), 'LLLL d, yyyy')}
                            </time>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {post.readingTime}
                            </p>
                        </div>
                    </div>
                    <Image src={post.image} alt="hero image" height={550} width={800} className="mt-4 border rounded-lg border-black/10 dark:border-white/10" />
                </div>
                <MDXContent components={MDXComponents} />
            </article>
        </>
    )
}