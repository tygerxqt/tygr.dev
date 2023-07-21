import Image from "next/image";
import { Suspense } from "react";

export default async function GalleryPage() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/gallery/images`, { next: { revalidate: 3600 } });
    const images = await data.json() as {
        src: string,
        alt: string
    }[];

    return (
        <>
            <main className="mx-auto max-w-[1960px] p-0 sm:p-2 md:p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {images.map((image, index) => {
                        return (
                            <button key={index}>
                                <div className="h-[400px]">
                                    <Suspense fallback={<p>Loading...</p>}>
                                        <Image src={image.src} alt={image.alt} width={1200} height={800} className="object-cover w-full h-full border rounded-lg border-black/10 dark:border-white/10" />
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