import ProjectCol from "@/components/projects/col";
import { cms } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export default async function ProjectsPage() {
    const projects = await cms.request(readItems("projects"));

    return (
        <>
            <div className="flex flex-col gap-2 pt-2 w-full max-w-[800px]">
                <div className="pb-4">
                    <h2 className="text-2xl font-bold sm:text-3xl font-display">
                        Projects
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        I&apos;ve made a lot of things over the years, here&apos;s a few of them.
                    </p>
                </div>
                {projects.map((p, i: number) => (
                    <>
                        <ProjectCol title={p.name} desc={p.summary} href={p.link} year={p.year} img={`${process.env.NEXT_PUBLIC_CMS_URL}/assets/${p.image}`} />
                    </>
                ))}
            </div>
        </>
    )
}