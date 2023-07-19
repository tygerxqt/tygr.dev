import Carousel, { CarouselItem } from "@/components/gallery/carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
                <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => {
                        return (
                            <div className="h-[400px] "><Image src={image.Image.files[0].file.url} alt={image.Name.title[0].plain_text} width={1920} height={1080} className="object-cover w-full h-full border rounded-lg border-black/10 dark:border-white/10" /></div>
                        )
                    })}
                </div>
            </main>
        </>
    )
}