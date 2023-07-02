import { notion } from "@/lib/notion"
import { ImageProps } from "@/types/image";
import Image from "next/image";

async function getImages() {
    const raw = await notion.databases.query({
        database_id: process.env.NOTION_GALLERY_DATABASE_ID as string,
    });

    const res: ImageProps[] = raw.results.map((p: any) => p.properties);

    return res;
}

export default async function GalleryPage() {
    const images = await getImages();

    return (
        <>
            <main className="mx-auto max-w-[1960px] p-4">
                <div className="gap-4 columns-1 sm:columns-2 xl:columns-3 2xl:columns-4">
                    {images.map((i: ImageProps, index: number) => (
                        <Image
                            alt={i.Name.title[0].text.content}
                            className="mt-4 transition transform border rounded-lg border-black/10 dark:border-white/10 brightness-90 will-change-auto group-hover:brightness-110"
                            style={{ transform: "translate3d(0, 0, 0)" }}
                            src={i.Image.files[0].file.url}
                            key={index}
                            width={720}
                            height={480}
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                        />
                    ))}
                </div>
            </main>
        </>
    )
}