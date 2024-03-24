import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
	return (
		<>
			<footer className="flex flex-row items-center justify-center w-full">
				<div className="flex flex-col items-center pt-4 w-full max-w-[800px]">
					<div className="flex flex-col min-w-full">
						<hr className="w-full border border-black/10 dark:border-white/10" />
						<div className="flex flex-col items-center gap-2 px-2 py-4">
							{/* Now playing */}
							<div className="flex items-center justify-center text-neutral-500">
								{/* TODO: Implement Spotify now playing / Lastfm now playing */}
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
									<Link href="https://github.com/tygrxqt">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											GitHub
										</Button>
									</Link>
									<Link href="https://bsky.app/profile/tygr.dev">
										<Button
											variant="link"
											className="p-0 py-1 text-sm sm:text-base"
										>
											Bluesky
										</Button>
									</Link>
									<Link href="https://www.instagram.com/tygrxqt">
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
