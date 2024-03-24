import { Post } from "@/lib/directus";
import Image from "next/image";
import Link from "next/link";
import readingTime from "reading-time";

export default function BlogCard({
	post,
	archive = false,
}: {
	post: Post;
	archive?: boolean;
}) {
	return (
		<>
			<Link href={`/blog/` + (archive ? "archive/" : "") + `${post.slug}`}>
				<button className="w-full min-h-[550px] border border-black/10 dark:border-white/10 flex flex-col p-0 m-0 rounded-lg text-start sm:hover:-translate-y-1 transition-transform">
					<Image
						src={process.env.NEXT_PUBLIC_CMS_URL + "/assets/" + post.hero}
						alt="blog post"
						height={550}
						width={600}
						className="flex-1 object-cover rounded-lg grow"
					/>
					<div className="bottom-0 left-0 right-0 w-full rounded-lg backdrop-blur">
						<div className="absolute bottom-0 w-full p-3 border-t rounded-b-lg backdrop-blur border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80">
							<div className="flex flex-row justify-between w-full gap-2">
								<h1 className="items-center text-xl font-black sm:text-2xl font-display">
									{post.heading}
								</h1>
								<p className="text-right">{readingTime(post.content).text}</p>
							</div>
							<p>{post.summary}</p>
						</div>
					</div>
				</button>
			</Link>
		</>
	);
}
