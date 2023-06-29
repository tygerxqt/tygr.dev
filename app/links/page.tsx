import LinkItem from "@/components/links/link";
import { notion } from "@/lib/notion"
import { LinkProps } from "@/types/link";

async function getLinks() {
    const data: any = await notion.databases.query({
        database_id: process.env.NOTION_LINKS_DATABASE_ID as string,
    });

    const props: LinkProps[] = data.results.map((p: any) => p.properties);

    return props;
}


export default async function LinksPage() {
    const links = await getLinks();

    return (
        <>
            <div className="flex flex-col gap-2 pt-2 w-full max-w-[800px]">
                <div className="pb-4">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        ~/links
                    </h2>
                    <p className="text-sm">
                        A bunch of useful links ranging from all my social media, resources that are helpful, to even my wishlist.
                    </p>
                </div>
                {links.map((link, i) => (
                    <LinkItem key={i} link={link} />
                ))}
            </div>
        </>
    )
}