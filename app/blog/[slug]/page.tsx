import { notion } from "@/lib/notion";
import { RichText } from "@/types/block";
import { Block } from "@/types/block";
import { BlogPost } from "@/types/blog-post";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";

function Text({ rich_text }: { rich_text: RichText[] }) {
    const elements = rich_text.map((value, i) => {
        const {
            annotations: { bold, code, color, italic, strikethrough, underline },
            text,
        } = value;

        return (
            <span
                key={i}
                className={[
                    bold ? "font-bold" : "",
                    code ? "font-mono bg-neutral-200 dark:bg-neutral-800 px-1 rounded-sm" : "",
                    italic ? "italic" : "",
                    strikethrough ? "line-through" : "",
                    underline ? "underline" : "",
                ].join(" ")}
                style={color !== "default" ? { color } : {}}
            >
                {text.link ? (
                    <a href={text.link.url} className="flex-row flex-wrap text-blue-500 hover:underline" target={text.link.url.startsWith("/") ? "" : "_blank"}>
                        {text.content}
                        {/* <ArrowUpRight className="w-4 h-4 data-[hidden=true]:hidden flex-wrap" data-hidden={text.link.url.startsWith("/")} /> */}
                    </a>
                ) : text.content}
            </span>
        );
    });

    if (elements.length <= 1) {
        return elements[0];
    } else {
        return <>{elements}</>;
    }
};

const renderBlock = (block: Block) => {
    const { type, id, } = block;

    switch (type) {
        case "paragraph":
            return (
                <p className="pb-2">
                    <Text rich_text={block.paragraph.rich_text} />
                </p>
            );
        case "heading_1":
            return (
                <h1 className="pb-4 text-3xl font-bold font-display">
                    <Text rich_text={block.heading_1.rich_text} />
                </h1>
            );
        case "heading_2":
            return (
                <h2 className="py-2 pt-4 text-2xl font-semibold font-display">
                    <Text rich_text={block.heading_2.rich_text} />
                </h2>
            );
        case "heading_3":
            return (
                <h3 className="pb-2">
                    <Text rich_text={block.heading_3.rich_text} />
                </h3>
            );
        case "bulleted_list_item":
            return (
                <li className="pb-2">
                    <Text rich_text={block.bulleted_list_item.rich_text} />
                </li>
            );
        case "numbered_list_item":
            return (
                <li className="pb-2">
                    <Text rich_text={block.numbered_list_item.rich_text} />
                </li>
            );
        case "to_do":
            return (
                <div>
                    <label htmlFor={id}>
                        <input type="checkbox" id={id} checked={block.to_do.checked} readOnly className="select-none" />{" "}
                        <Text rich_text={block.to_do.rich_text} />
                    </label>
                </div>
            );
        case "quote":
            return (
                <>
                    <div className="py-1 pl-2 my-2 italic border-l-2 border-black bg-neutral-200 dark:bg-neutral-800 dark:border-white">
                        <Text rich_text={block.quote.rich_text} />
                    </div>
                </>
            );

        // case "toggle":
        //     return (
        //         <details>
        //             <summary>
        //                 <Text rich_text={block.paragraph.rich_text} />
        //             </summary>
        //             {block.children?.map((block) => (
        //                 <Fragment key={block.id}>{renderBlock(block)}</Fragment>
        //             ))}
        //         </details>
        //     );
        // case "child_page":
        //     return <p>{value.title}</p>;
        case "image":
            const src =
                block.image.type === "external" ? block.image.external.url : block.image.file.url;
            // const caption = block.image.caption.length > 1 ? "" : block.image.caption.map((c) => c.plain_text).join("");
            // console.log(block.image.caption[0].plain_text as string)

            return (
                <figure className="pb-">
                    <img src={src} alt={"caption"} className="my-2 border rounded-lg border-black/10 dark:border-white/10" />
                    {true && <figcaption className="pl-2 italic border-l-2 border-black bg-neutral-200 dark:bg-neutral-800 dark:border-white">{JSON.stringify(block.image.caption)}</figcaption>}
                </figure>
            );
        default:
            console.log(`Unsupported block (${type === "unsupported" ? "unsupported by Notion API" : type})`);
            return <div />;
    }
};

async function fetchBlocks(slug: string) {
    const rawPosts: any = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_DATABASE_ID as string,
        filter: {
            property: "status",
            status: {
                "equals": "Published"
            },
            and: [
                {
                    property: "slug",
                    rich_text: {
                        equals: slug
                    }
                }
            ]
        },
    });

    const post: BlogPost = rawPosts.results[0].properties;

    if (rawPosts.results.length < 1) return {
        blocks: null,
        post: null
    };

    let blocksRes: any = await notion.blocks.children.list({
        block_id: rawPosts.results[0].id,
    });

    const blocks: Block[] = blocksRes.results;

    return {
        blocks: blocks,
        post: post
    }
}

export default async function PostPage({ params }: { params: { slug: string, id: string } }) {
    const { blocks, post } = await fetchBlocks(params.slug);

    if (!blocks || !post) {
        return <div />;
    }

    return (
        <>
            <div className="flex flex-col gap-2 pt-2">
                <article>
                    <div className="py-2">

                        <h1 className="pt-4 text-3xl font-bold font-display">
                            {post.name.title[0].plain_text}
                        </h1>
                        <Image src={post.hero.files[0].file.url} alt={post.hero.files[0].name} width={800} height={550} className="my-2 border rounded-lg border-black/10 dark:border-white/10" />
                    </div>

                    <section>
                        {blocks.map((block) => {
                            return (
                                <Fragment key={block.id}>
                                    {renderBlock(block)}
                                </Fragment>
                            );
                        })}
                    </section>
                </article>
            </div>
        </>
    )
}

export async function generateStaticParams() {
    const database = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_DATABASE_ID as string,
        filter: {
            property: "status",
            status: {
                equals: "Published"
            }
        }
    });

    let properties: BlogPost[] = database.results.map((p: any) => p.properties);

    if (properties.length < 1) return;

    return properties.map((p) => ({ "slug": p.slug.rich_text[0].plain_text }));
}