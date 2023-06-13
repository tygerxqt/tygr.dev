import Image from "next/image";

export default async function PostPage({ params }: { params: { slug: string, id: string } }) {
    return (
        <>
            <div className="flex flex-col gap-2 pt-2">
                <article>
                    <div className="py-2">
                        <h1 className="pt-4 text-3xl font-bold font-display">
                            {" "}
                        </h1>
                        <Image src={""} alt={""} width={800} height={550} className="my-2 border rounded-lg border-black/10 dark:border-white/10" />
                    </div>
                    <section>

                    </section>
                </article>
            </div>
        </>
    )
}