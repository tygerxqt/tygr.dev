import { Tool } from "@/lib/directus";
import Link from "next/link";
import Icons from "@/components/icons";

export default function GearItem({ tool }: { tool: Tool }) {
	return (
		<>
			<div className="flex flex-col justify-between w-full">
				<Link href={tool.url} passHref target="_blank">
					<div className="flex flex-col gap-0">
						<div className="flex flex-row items-center w-full gap-2">
							<h2 className="text-lg font-medium">{tool.name}</h2>
							<Icons.External className="w-4 h-4 text-neutral-600 dark:text-neutral-500" />
						</div>
						<p className="text-sm dark:text-neutral-400 text-neutral-500">
							{tool.summary}
						</p>
					</div>
				</Link>
			</div>
		</>
	);
}
