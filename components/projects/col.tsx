"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProjectCol({
	href,
	title,
	desc,
	year,
	img,
}: {
	href: string;
	title: string;
	desc: string;
	year: string;
	img: string;
}) {
	const [hover, setHover] = useState(false);

	if (typeof window !== "undefined") {
		document.onmousemove = (e) => {
			const img = document.getElementById(title);
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
					id={title}
					src={img}
					alt={title}
					width={400}
					height={200}
					className="rounded-md md:data-[hover=true]:absolute md:data-[hover=false]:hidden border border-black/10 dark:border-white/10 transition-opacity duration-150"
					data-hover={hover}
				/>
			</div>
			<a
				className="flex flex-row items-center w-full p-2 overflow-hidden rounded-md whitespace-nowrap text-ellipsis hover:bg-neutral-200 dark:hover:bg-neutral-800"
				target="_blank"
				rel="noopener noreferrer"
				href={href}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
				<p className="gap-1 font-semibold">
					{title}{" "}
					<span className="inline-block text-sm font-normal text-neutral-500">
						• {desc}
					</span>
				</p>
				<span className="hidden w-full sm:flex sm:flex-row sm:items-center ">
					<hr className="flex-1 mx-2 border border-black/10 dark:border-white/10" />
					<span className="text-sm font-medium text-neutral-500">{year}</span>
				</span>
			</a>
		</>
	);
}
