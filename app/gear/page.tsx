import GearCard from "@/components/gear/card";
import { Tool, cms } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export default async function GearPage() {
	const rawGear = await cms.request(readItems("gear"));

	function categoriseItems(items: any, field: any) {
		const categories: any = {};

		rawGear.forEach((item) => {
			const value = item["category"];

			if (!categories[value]) {
				categories[value] = [];
			}

			categories[value].push(item);
		});

		return categories;
	}

	const tools: { [key: string]: Array<Tool> } = categoriseItems(
		rawGear,
		"category"
	);

	return (
		<>
			<div className="flex flex-col gap-2 pt-2 w-full max-w-[800px]">
				<div className="pb-4">
					<h2 className="text-2xl font-bold sm:text-3xl font-display">
						My Gear
					</h2>
					<p className="text-sm">
						The entire list of the gear I use for productivity, development, and
						gaming.
					</p>
				</div>
				<div className="flex flex-col gap-8 pb-4">
					{Object.keys(tools).map((category) => (
						<div key={category} className="flex flex-col gap-3">
							<div className="flex flex-col gap-2">
								<h1 className="text-xl font-bold">
									{category[0].toUpperCase() +
										category.slice(1, category.length)}
								</h1>
								<hr className="border border-black/10 dark:border-white/10" />
							</div>
							<div className="flex flex-col items-center w-full gap-4">
								{tools[category].map((tool) => (
									<GearCard key={tool.id} tool={tool} />
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
