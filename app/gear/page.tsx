import GearCard from "@/components/gear/card";
import { cms } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export default async function GearPage() {
    const gear = await cms.request(readItems("gear"));

    console.log(gear);

    return (
        <>
            <div className="flex flex-col gap-2 pt-2 w-full max-w-[800px]">
                <div className="pb-4">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        ~/gear
                    </h2>
                    <p className="text-sm">
                        The entire list of the gear I use for productivity, development, and gaming.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    {gear.map((tool, i: number) => (
                        <GearCard tool={tool} key={i} />
                    ))}
                </div>
            </div>
        </>
    )
}