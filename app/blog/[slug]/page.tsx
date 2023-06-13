import { allPosts } from "@/.contentlayer/generated";
import { format, parseISO } from "date-fns";
import { getMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const customLink = (props: any) => {
    const href = props.href;

    if (href.startsWith('/')) {
        return (
            <Link href={href} {...props}>
                {props.children}
            </Link>
        );
    }

    if (href.startsWith('#')) {
        return <a {...props} />;
    }

    return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

const MDXComponents = {
    p: (props: any) => (
        <p {...props} className="my-4 leading-relaxed" />
    ),
    code: (props: any) => (
        <>
            <code {...props} className="px-1 font-mono rounded-md bg-neutral-200 dark:bg-neutral-800" />
        </>
    ),
    pre: (props: any) => (
        <>
            <pre {...props} className="p-3 m-2 font-mono rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </>
    ),
    blockquote: (props: any) => (
        <>
            <div {...props} className="px-4 py-1 italic border-l-2 border-black dark:border-white bg-neutral-200 dark:bg-neutral-800" />
        </>
    ),
    img: (props: any) => (
        <>
            <div className="flex justify-center w-auto h-auto my-4">
                <Image src={props.src} alt={props.alt} className="border border-black/10 dark:border-white/10 rounded-xl" />
            </div>
        </>
    ),
    ul: (props: any) => (
        <>
            <ul className="py-2 pl-4 list-disc" {...props} />
        </>
    ),
    ol: (props: any) => (
        <>
            <ol className="py-2 pl-2 list-decimal" {...props} />
        </>
    ),
    li: (props: any) => (
        <>
            <li className="mb-2 list-inside" {...props} />
        </>
    ),
    h1: (props: any) => (
        <h1 {...props} className="mt-8 mb-4 text-4xl font-bold tracking-tight font-display sm:text-5xl" />
    ),
    h2: (props: any) => (
        <h2 {...props} className="mt-8 mb-4 text-3xl font-semibold tracking-tight font-display sm:text-4xl" />
    ),
    h3: (props: any) => (
        <h3 {...props} className="mt-8 mb-4 text-2xl font-semibold tracking-tight font-display sm:text-3xl" />
    ),
    h4: (props: any) => (
        <h4 {...props} className="mt-8 mb-4 text-xl font-semibold tracking-tight font-display sm:text-2xl" />
    ),
    h5: (props: any) => (
        <h5 {...props} className="mt-8 mb-4 text-lg font-semibold tracking-tight font-display sm:text-xl" />
    ),
    h6: (props: any) => (
        <h6 {...props} className="mt-8 mb-4 font-semibold tracking-tight font-display text-md sm:text-lg" />
    ),
    hr: (props: any) => (
        <hr className="my-3" {...props} />
    ),
    a: customLink,
};

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