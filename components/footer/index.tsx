import { Button } from "@/components/ui/button";
import { getNowPlaying } from "@/lib/spotify";
import Link from "next/link";
import MusicLink from "@/components/footer/music-link";

export default async function Footer() {
	const rawPlaying = await getNowPlaying();
	const nowPlaying = await rawPlaying.json();

	return (
		<>
			<footer className="flex flex-row items-center justify-center w-full">
				<div className="flex flex-col items-center pt-4 w-full max-w-[800px]">
					<div className="flex flex-col min-w-full">
						<hr className="w-full border border-black/10 dark:border-white/10" />
						<div className="flex flex-col items-center gap-2 px-2 py-4">
							{/* Now playing */}
							<div className="flex items-center justify-center my-2 text-neutral-500">
								<svg className="w-6 h-6 mr-2" viewBox="0 0 168 168">
									<path
										fill="#fff"
										d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l.001-.004zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 014.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z"
									/>
								</svg>
								{nowPlaying.is_playing ? (
									<MusicLink track={nowPlaying} />
								) : (
									<div className="flex flex-row gap-1">
										<p className="text-sm font-medium sm:text-base">
											Not Playing
										</p>
										<Link
											href="https://open.spotify.com/user/z4is4ny666qn1njee0k6g77o2"
											passHref
											target="_blank"
										>
											<span className="text-primary-500">- Spotify</span>
										</Link>
									</div>
								)}
							</div>

							{/* Links */}
							<div className="grid justify-between w-full grid-cols-3">
								<div className="flex flex-col items-start justify-start gap-2">
									<Link href="/">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											About
										</Button>
									</Link>
									<Link href="/projects">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											Projects
										</Button>
									</Link>
									<Link href="/blog">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											Blog
										</Button>
									</Link>
								</div>
								<div className="flex flex-col items-center justify-center gap-2">
									<Link href="/gear">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											My Gear
										</Button>
									</Link>
									<Link href="/gallery">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											Gallery
										</Button>
									</Link>
									<Link href="/links">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											Links
										</Button>
									</Link>
								</div>
								<div className="flex flex-col items-end justify-end gap-2">
									<Link href="https://github.com/tygrdev">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											GitHub
										</Button>
									</Link>
									<Link href="https://twitter.com/tygrdev">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											Twitter
										</Button>
									</Link>
									<Link href="https://www.instagram.com/tygrdev">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											Instagram
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
