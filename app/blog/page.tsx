import BlogCard from "@/components/blog-card";
import { notion } from "@/lib/notion";
import { BlogPost } from "@/types/blog-post";

async function getPosts() {
    const posts = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_DATABASE_ID as string,
    });

    let res: BlogPost[] = posts.results.map((p: any) => p.properties);

    return res;
}

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <>
            <div className="flex flex-col gap-2 pt-2">
                <div className="pb-4">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        ~/blog
                    </h2>
                    <p className="text-sm">
                        All of my blog posts and tutorials. I write about web development, programming, and games.
                    </p>
                </div>
                {/* {JSON.stringify(posts)} */}
                <div className="grid grid-cols-1 gap-4 px-2 sm:px-0 sm:gap-2 sm:grid-cols-2">
                    {posts.map((p: BlogPost, i: number) => {
                        return (
                            <>
                                <BlogCard title={p.name.title[0].text.content} summary={p.summary.rich_text[0].text.content} image={p.hero.files[0].file.url} slug={p.slug.rich_text[0].text.content} time="1 min left" key={i} />
                            </>
                        )
                    })}
                </div>
            </div>
        </>
    )
}