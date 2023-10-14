import { cms } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import { Key, Suspense } from "react";

export default async function GalleryPage() {
    const raw = await cms.request(readItems("gallery"));

    return (
        <>
            <main className="mx-auto max-w-[1960px] p-0 sm:p-2 md:p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {raw.map((image: { image: any; name: string; }, index: Key | null | undefined) => {
                        return (
                            <button key={index}>
                                <div className="h-[500px]">
                                    <Suspense fallback={<p>Loading...</p>}>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_CMS_URL}/assets/${image.image}`}
                                            alt={image.name}
                                            width={768}
                                            height={600}
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