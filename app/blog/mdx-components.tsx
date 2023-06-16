import Link from "next/link";
import Image from "next/image";

const customLink = (props: any) => {
    const href = props.href;

    if (href.startsWith('/')) {
        return (
            <Link href={href} {...props}>
                {props.children}
            </Link>
        );
    }

    if (href.startsWith('#')) {
        return <a {...props} />;
    }

    return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

const MDXComponents = {
    p: (props: any) => (
        <p {...props} className="my-4 leading-relaxed" />
    ),
    code: (props: any) => (
        <>
            <code {...props} className="px-1 font-mono rounded-md bg-neutral-200 dark:bg-neutral-800" />
        </>
    ),
    pre: (props: any) => (
        <>
            <pre {...props} className="p-3 m-2 font-mono rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </>
    ),
    blockquote: (props: any) => (
        <>
            <div {...props} className="px-4 py-1 italic border-l-2 border-black dark:border-white bg-neutral-200 dark:bg-neutral-800" />
        </>
    ),
    img: (props: any) => (
        <>
            <div className="flex justify-center w-auto h-auto my-4">
                <Image src={props.src} alt={props.alt} width={800} height={400} className="border border-black/10 dark:border-white/10 rounded-xl" />
            </div>
        </>
    ),
    ul: (props: any) => (
        <>
            <ul className="py-2 pl-4 list-disc" {...props} />
        </>
    ),
    ol: (props: any) => (
        <>
            <ol className="py-2 pl-2 list-decimal" {...props} />
        </>
    ),
    li: (props: any) => (
        <>
            <li className="mb-2 list-inside" {...props} />
        </>
    ),
    h1: (props: any) => (
        <h1 {...props} className="mt-8 mb-4 text-4xl font-bold tracking-tight font-display sm:text-5xl" />
    ),
    h2: (props: any) => (
        <h2 {...props} className="mt-8 mb-4 text-3xl font-semibold tracking-tight font-display sm:text-4xl" />
    ),
    h3: (props: any) => (
        <h3 {...props} className="mt-8 mb-4 text-2xl font-semibold tracking-tight font-display sm:text-3xl" />
    ),
    h4: (props: any) => (
        <h4 {...props} className="mt-8 mb-4 text-xl font-semibold tracking-tight font-display sm:text-2xl" />
    ),
    h5: (props: any) => (
        <h5 {...props} className="mt-8 mb-4 text-lg font-semibold tracking-tight font-display sm:text-xl" />
    ),
    h6: (props: any) => (
        <h6 {...props} className="mt-8 mb-4 font-semibold tracking-tight font-display text-md sm:text-lg" />
    ),
    hr: (props: any) => (
        <hr className="my-3" {...props} />
    ),
    a: customLink,
};

export default MDXComponents;