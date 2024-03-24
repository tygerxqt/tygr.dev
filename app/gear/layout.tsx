import { Metadata } from "next";

export const metadata: Metadata = {
	title: "tygr.dev | Gear",
	description:
		"The entire list of the gear I use for productivity, development, and gaming.",
	keywords: [
		"tygrxqt gear",
		"ty mason gear",
		"tygr dev gear",
		"tygr gear",
		"tyger796 gear",
		"tyger gear",
	],
};

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className="flex flex-col items-center justify-center w-full">
				{children}
			</div>
		</>
	);
}
