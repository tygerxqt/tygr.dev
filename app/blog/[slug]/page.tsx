import { format, parseISO } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Post, cms } from "@/lib/directus";
import { readItem, readItems } from "@directus/sdk";
import readingTime from "reading-time";
import { Metadata } from "next";
import { CustomMDX } from "./custom-mdx";
import { unstable_noStore } from "next/cache";

export async function generateStaticParams() {
    let posts: Post[] = await cms.request(readItems("posts")).then((res) => {
        return res.filter((post) => post.status === "published");
    });

    return posts.map((post) => {
        return {
            slug: post.slug
        }
    });
}

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
    const post = await cms.request(readItem("posts", params.slug)).then((res) => {
        return res;
    });

    if (!post) return;

    let metadata: Metadata = {
        title: post.heading,
        description: post.summary,
        publisher: "tygerxqt",
        metadataBase: new URL(process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://tygr.dev"),

        openGraph: {
            title: post.heading,
            description: post.summary,
            images: [
                {
                    url: process.env.NEXT_PUBLIC_CMS_URL + "/assets/" + post.hero,
                    width: 800,
                    height: 600,
                }
            ],
            locale: "en_US",
            type: "article",
        },
    };

    return metadata;
}

function formatDate(date: string) {
    unstable_noStore();
    let currentDate = new Date();
    if (!date.includes('T')) {
        date = `${date}T00:00:00`;
    }
    let targetDate = new Date(date);

    let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
    let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
    let daysAgo = currentDate.getDate() - targetDate.getDate();

    let formattedDate = '';

    if (yearsAgo > 0) {
        formattedDate = `${yearsAgo}y ago`;
    } else if (monthsAgo > 0) {
        formattedDate = `${monthsAgo}mo ago`;
    } else if (daysAgo > 0) {
        formattedDate = `${daysAgo}d ago`;
    } else {
        formattedDate = 'Today';
    }

    let fullDate = targetDate.toLocaleString('en-us', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return `${fullDate} (${formattedDate})`;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const post: Post = await cms.request(readItem("posts", params.slug)).then((res) => {
        return res;
    });

    if (!post) {
        return notFound();
    }

    return (
        <>
            <div className="p-2 py-4 mx-auto max-w-[800px]">
                <div className="flex flex-col gap-2 pb-2">
                    <h1 className="font-serif text-3xl font-bold sm:text-4xl">{post.heading}</h1>
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-row items-center gap-2">
                            <Image src="/profile.jpg" alt="T" aria-label="Author avatar" width={28} height={28} className="rounded-full" />
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                tygerxqt • {" "}
                            </p>
                            <time dateTime={post.date_created} className="items-center text-sm text-neutral-500 dark:text-neutral-400">
                                {formatDate(post.date_created)}
                            </time>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {readingTime(post.content).text}
                            </p>
                        </div>
                    </div>
                    <Image src={process.env.NEXT_PUBLIC_CMS_URL + "/assets/" + post.hero} alt="hero image" height={400} width={800} className="mt-4 border rounded-lg border-black/10 dark:border-white/10" />
                </div>
                <article className="min-w-full px-2 prose prose-quoteless prose-neutral dark:prose-invert">
                    <CustomMDX source={post.content} />
                </article>
            </div>
        </>
    )
}