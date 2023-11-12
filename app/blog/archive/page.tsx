import BlogCard from "@/components/blog/card";
import { Button } from "@/components/ui/button";
import { cms } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function BlogPage() {
    const posts = await cms.request(readItems("posts")).then((res) => {
        return res.filter((post) => post.status === "archived");
    });

    return (
        <>
            <div className="max-w-[800px] w-full flex flex-col items-start gap-2">
                <div className="flex flex-row items-center justify-between w-full gap-2 px-2">
                    <div>
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            ~/blog/archive
                        </h2>
                        <p className="text-sm">
                            All of my archived blog posts.
                        </p>
                    </div>
                    <Link href="/blog">
                        <Button size="sm" className="p-1">
                            <ArrowLeft />
                        </Button>
                    </Link>
                </div>

                <Suspense fallback={<p>Loading...</p>}>
                    {posts.length === 0 && (
                        <div className="flex flex-col items-center justify-center w-full py-8">
                            <p className="text-neutral-500">There are no posts to show at the moment.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 px-2 py-2 sm:px-0 sm:gap-2 sm:grid-cols-2">
                        {posts.filter((post) => post.status === "archived").map((post, idx) => (
                            <BlogCard key={idx} post={post} archive={true} />
                        ))}
                    </div>
                </Suspense>
            </div >
        </>
    )
}