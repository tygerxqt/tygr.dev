import { format, parseISO } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import MDXComponents from "../../mdx-components";
import { Post, cms } from "@/lib/directus";
import { readItem, readItems } from "@directus/sdk";
import readingTime from "reading-time";
import { getMDXComponent } from "mdx-bundler/client";
import { bundleMDX } from "mdx-bundler";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { Metadata } from "next";

export async function generateStaticParams() {
    let posts: Post[] = await cms.request(readItems("posts")).then((res) => {
        return res.filter((post) => post.status === "archived");
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

export default async function ArchivedPostPage({ params }: { params: { slug: string } }) {
    const post: Post = await cms.request(readItem("posts", params.slug)).then((res) => {
        return res;
    });

    if (!post) {
        return notFound();
    }

    const formattingOptions = {
        theme: "vitesse-light",
        keepBackground: false,
        onVisitLine(node: any) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }];
            }
        },
        onVisitHighlightedLine(node: any) {
            node.properties.className.push('highlighted');
        },
        onVisitHighlightedWord(node: any) {
            node.properties.className = ['word'];
        },
    };

    const { code, frontmatter } = await bundleMDX({
        source: post.content,
        cwd: process.cwd(),
        mdxOptions(options, frontmatter) {
            // remark-gfm hasn't been updated: https://github.com/unifiedjs/unified/issues/227#issuecomment-1683760629
            // options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
            options.rehypePlugins = [...(options.rehypePlugins ?? []), [rehypePrettyCode, formattingOptions]]

            return options;
        },
    });

    const MDXComponent = getMDXComponent(code);

    return (
        <>
            <article className="p-2 py-4 mx-auto max-w-[800px]">
                <div className="flex flex-col gap-2 pb-2">
                    <h1 className="text-3xl font-black font-display sm:text-4xl">{post.heading}</h1>
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-row items-center gap-2">
                            <Image src={"https://secure.gravatar.com/avatar/871c2885d0acbbc08be33547816255e3?size=512"} alt="T" aria-label="Author avatar" width={28} height={28} className="rounded-full" />
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                tygerxqt • {" "}
                            </p>
                            <time dateTime={post.date_created} className="items-center text-sm text-neutral-500 dark:text-neutral-400">
                                {format(parseISO(post.date_created), 'LLLL d, yyyy')}
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
                <MDXComponent components={MDXComponents} />
            </article>
        </>
    )
}