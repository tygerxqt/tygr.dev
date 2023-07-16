"use client"

import { allPosts } from "@/.contentlayer/generated";
import BlogCard from "@/components/blog/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { compareDesc } from "date-fns";
import { Archive } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BlogPage() {
    const posts = allPosts.filter(post => post.archived === false).sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
    const [query, setQuery] = useState("");

    return (
        <>
            <div className="max-w-[800px] w-full flex flex-col items-start gap-2">
                <div>
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        ~/blog
                    </h2>
                    <p className="text-sm">
                        All of my blog posts and tutorials. I write about web development, programming, and games.
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between w-full gap-2 pb-4">
                    <Input className="max-w-[400px]" placeholder="Search articles..." value={query} onChange={(e) => setQuery(e.target.value.toLowerCase())} />
                    <Link href="/blog/archive">
                        <Button size="sm" className="p-1">
                            <Archive />
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col items-center justify-center w-full py-8">
                    {posts.length === 0 && (
                        <p className="text-neutral-500">There are no posts to show at the moment.</p>
                    )}
                </div>
                <div className="grid grid-cols-1 gap-4 px-2 sm:px-0 sm:gap-2 sm:grid-cols-2">
                    {posts.filter((post) => post.title.toLowerCase().includes(query) || post.summary.toLowerCase().includes(query)).map((post, idx) => (
                        <BlogCard key={idx} post={post} />
                    ))}
                </div >
            </div >
        </>
    )
}