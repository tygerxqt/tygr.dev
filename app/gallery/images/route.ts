import { notion } from "@/lib/notion";
import { ImageProps } from "@/types/image";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const raw = await notion.databases.query({
        database_id: process.env.NOTION_GALLERY_DATABASE_ID as string,
    });

    const res: ImageProps[] = raw.results.map((p: any) => p.properties);

    const data = res.map((image) => {
        return {
            src: image.Image.files[0].file.url,
            alt: image.Name.title[0].plain_text,
        }
    });

    return NextResponse.json(data, {
        status: 200,
        headers: {
            "Cache-Control": `max-age=3600`,
        },
    })
}

export const revalidate = 3600;

