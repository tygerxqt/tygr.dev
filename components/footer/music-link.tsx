"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Track } from "@/lib/spotify";

export default function MusicLink({ track }: { track: { item: Track } }) {
	const [hover, setHover] = useState(false);

	if (typeof window !== "undefined") {
		document.onmousemove = (e) => {
			const img = document.getElementById(track.item.name);
			if (!img) return;

			// make the image follow the cursor
			img.style.left = e.pageX + 20 + "px";
			img.style.top = e.pageY - 200 + "px";
		};
	}

	return (
		<>
			<div className="hidden md:block">
				<Image
					id={track.item.name}
					src={track.item.album.images[0].url}
					alt={track.item.name}
					width={200}
					height={200}
					className="rounded-md md:data-[hover=true]:absolute md:data-[hover=false]:hidden border border-black/10 dark:border-white/10 transition-opacity duration-150"
					data-hover={hover}
				/>
			</div>
			<p className="text-sm sm:text-base">
				Listening to:{" "}
				<Link
					href={track.item.external_urls.spotify}
					target="_blank"
					passHref
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					<span className="font-bold">
						{track.item.name} - {track.item.artists[0].name}
					</span>
				</Link>
			</p>
		</>
	);
}
