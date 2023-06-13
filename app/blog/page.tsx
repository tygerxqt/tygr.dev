import { allPosts } from "@/.contentlayer/generated";
import BlogCard from "@/components/blog/card";
import { compareDesc } from "date-fns";

export default async function BlogPage() {
    const posts = allPosts.filter(post => post.archived === false).sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
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
                <div className="grid grid-cols-1 gap-4 px-2 sm:px-0 sm:gap-2 sm:grid-cols-2">
                    {posts.map((post, idx) => (
                        <BlogCard key={idx} {...post} />
                    ))}
                </div>
            </div>
        </>
    )
}