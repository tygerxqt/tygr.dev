import { notion } from "@/lib/notion";
import { RichText } from "@/types/block";
import { Block } from "@/types/block";
import { BlogPost } from "@/types/blog-post";
import { Fragment } from "react";
import { text } from "stream/consumers";

// function Text({ block }: { block: Block }) {
//     if (!block || !block.paragraph) return null;

//     return block.paragraph.rich_text.map((p, i) => {
//         return (
//             <span key={i} className={[
//                 p.annotations.bold ? "" : "",
//                 p.annotations.code ? "" : "",
//                 p.annotations.italic ? "" : "",
//                 p.annotations.strikethrough ? "" : "",
//                 p.annotations.underline ? "" : "",
//             ].join(" ")}>
//                 {p.text.link ? <a href={p.text.link.url}>{p.text.content}</a> : p.text.content}
//             </span>
//         )
//     })
// }

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
                    bold ? "" : "",
                    code ? "" : "",
                    italic ? "" : "",
                    strikethrough ? "" : "",
                    underline ? "" : "",
                ].join(" ")}
                style={color !== "default" ? { color } : {}}
            >
                {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
            </span>
        );
    });

    return elements[0];
};

const renderBlock = (block: Block) => {
    const { type, id, } = block;

    switch (type) {
        case "paragraph":
            return (
                <p>
                    <Text rich_text={block.paragraph.rich_text} />
                </p>
            );
        case "heading_1":
            return (
                <h1>
                    <Text rich_text={block.heading_1.rich_text} />
                </h1>
            );
        case "heading_2":
            return (
                <h2>
                    <Text rich_text={block.heading_2.rich_text} />
                </h2>
            );
        case "heading_3":
            return (
                <h3>
                    <Text rich_text={block.heading_3.rich_text} />
                </h3>
            );
        case "bulleted_list_item":
            return (
                <li>
                    <Text rich_text={block.bulleted_list_item.rich_text} />
                </li>
            );
        case "numbered_list_item":
            return (
                <li>
                    <Text rich_text={block.numbered_list_item.rich_text} />
                </li>
            );
        case "to_do":
            return (
                <div>
                    <label htmlFor={id}>
                        <input type="checkbox" id={id} defaultChecked={block.to_do.checked} />{" "}
                        <Text rich_text={block.to_do.rich_text} />
                    </label>
                </div>
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
            const caption = ""

            return (
                <figure>
                    <img src={src} alt={caption} />
                    {caption && <figcaption>{caption}</figcaption>}
                </figure>
            );
        default:
            console.log(`Unsupported block (${type === "unsupported" ? "unsupported by Notion API" : type})`);
            return <div />;
    }
};

async function fetchBlocks(slug: string) {
    const rawPosts = await notion.databases.query({
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

    if (rawPosts.results.length < 1) return null;

    let blocksRes: any = await notion.blocks.children.list({
        block_id: rawPosts.results[0].id,
    });

    const blocks: Block[] = blocksRes.results;

    return blocks;
}

export default async function PostPage({ params }: { params: { slug: string, id: string } }) {
    const blocks = await fetchBlocks(params.slug);

    if (!blocks) {
        return <div />;
    }

    return (
        <>
            <div className="flex flex-col gap-2 pt-2">
                <article>
                    <section>
                        {blocks.map((block) => (
                            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
                        ))}
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