"use client";

import { animate } from "motion";
import React from "react";

export default function NameSwitch(
	{
		names,
	}: {
		names: string[];
	},
	props: React.HTMLAttributes<HTMLSpanElement>
) {
	// pick and random name out of the list, but not the current one
	const [mounted, setMounted] = React.useState(false);
	const [name, setName] = React.useState<string>(names[0]);
	const [lastIndex, setLastIndex] = React.useState<number>(0);

	React.useEffect(() => {
		setMounted(true);

		const interval = setInterval(() => {
			let newIndex = Math.floor(Math.random() * names.length);
			if (newIndex === lastIndex) {
				newIndex = (newIndex + 1) % names.length;
			}
			setLastIndex(newIndex);
			setName(names[newIndex]);
		}, 4000);

		if (mounted) {
			animate(
				"#name",
				{
					opacity: [0, 1, 1, 0],
					top: ["-1rem", "0px", "0px", "-1rem"],
				},
				{
					duration: 4,
					easing: [[0.25, 0.1, 0.25, 1], [0.25, 0.1, 0.25, 1], "ease"],
					offset: [0, 0.125, 0.875, 1],
				}
			);
		}

		return () => clearInterval(interval);
	}, [lastIndex, mounted, names]);

	return (
		<>
			{mounted ? (
				<div className="relative h-8 md:h-9">
					<span {...props} className="absolute h-10 overflow-hidden" id="name">
						{name}.
					</span>
				</div>
			) : (
				<span {...props}>{name}.</span>
			)}
		</>
	);
}
