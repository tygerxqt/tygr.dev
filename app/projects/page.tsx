import ProjectCol from "@/components/projects/col";
import { notion } from "@/lib/notion"
import { Project } from "@/types/project";

async function getProjects() {
    const projects: any = await notion.databases.query({
        database_id: process.env.NOTION_PROJECTS_DATABASE_ID as string,
    });

    let res: Project[] = projects.results.map((p: any) => p.properties);

    return res;
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <>
            <div className="flex flex-col gap-2 pt-2">
                <div className="pb-4">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        ~/projects
                    </h2>
                    <p className="text-sm">
                        An entire list of projects I&apos;ve worked or contributed.
                    </p>
                </div>
                {projects.map((p: Project, i: number) => (
                    <>
                        <ProjectCol title={p.name.title[0].text.content} desc={p.summary.rich_text[0].text.content} href={p.link.url} year={p.year.number} />
                    </>
                ))}
            </div>
        </>
    )
}