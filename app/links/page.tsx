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

    const linksByType: { [x: string]: LinkProps[] } = links.reduce((acc: any, link) => {
        const type = link.type.select.name.toLowerCase();
        if (!acc[type]) acc[type] = [];
        acc[type].push(link);
        return acc;
    }, {});

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
                {linksByType && Object.keys(linksByType).map((type, i) => (
                    <div key={i} className="flex flex-col gap-2 pb-2">
                        <h3 className="text-lg font-bold capitalize underline-offset-2">{type}s</h3>
                        {linksByType[type].map((link, i) => (
                            <LinkItem key={i} link={link} />
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}