import { ImageProps } from "@/types/image";
import Image from "next/image";
import { Suspense } from "react";

export default async function GalleryPage() {
    const data = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_GALLERY_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            accept: 'application/json',
            'Notion-Version': '2022-06-28',
            'content-type': 'application/json'
        },
        next: {
            revalidate: 3600
        }
    }).then((res) => res.json()).then((json) => json.results);

    const props: ImageProps[] = data.map((p: any) => p.properties);

    const sources = props.map(async (prop) => {
        // Get the blur data url

        // const buffer = await fetch(prop.Image.files[0].file.url, { next: { revalidate: 3600 } }).then(async (res) =>
        //     Buffer.from(await res.arrayBuffer())
        // );

        // const { base64 } = await getPlaiceholder(buffer);

        return {
            src: prop.Image.files[0].file.url,
            // blurDataURL: base64,
            alt: prop.Name.title[0].plain_text
        }
    });

    const images = await Promise.all(sources);

    return (
        <>
            <main className="mx-auto max-w-[1960px] p-0 sm:p-2 md:p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {images.map((image, index) => {
                        return (
                            <button key={index}>
                                <div className="h-[400px]">
                                    <Suspense fallback={<p>Loading...</p>}>
                                        <Image
                                            {...image}
                                            width={1920}
                                            height={1080}
                                            quality={75}
                                            className="object-cover w-full h-full border rounded-lg border-black/10 dark:border-white/10"
                                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                                        />
                                    </Suspense>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </main>
        </>
    )
}