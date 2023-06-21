import ProjectCol from "@/components/projects/col";
import { notion } from "@/lib/notion"
import { ProjectProps } from "@/types/project";

async function getProjects() {
    const projects: any = await notion.databases.query({
        database_id: process.env.NOTION_PROJECTS_DATABASE_ID as string,
    });

    let res: ProjectProps[] = projects.results.map((p: any) => p.properties);
    let filtered = res.filter((p) => p.private.checkbox.valueOf() === false);

    return filtered;
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <>
            <div className="flex flex-col gap-2 pt-2 w-full max-w-[800px]">
                <div className="pb-4">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        ~/projects
                    </h2>
                    <p className="text-sm">
                        An entire list of projects I&apos;ve worked or contributed.
                    </p>
                </div>
                {projects.map((p: ProjectProps, i: number) => (
                    <>
                        <ProjectCol title={p.name.title[0].text.content} desc={p.summary.rich_text[0].text.content} href={p.link.url} year={p.year.number} img={p.image.files[0].file.url} />
                    </>
                ))}
            </div>
        </>
    )
}