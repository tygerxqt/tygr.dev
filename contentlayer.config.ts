import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import readingTime from 'reading-time';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

export const Post = defineDocumentType(() => ({
    name: 'Post',
    filePathPattern: `**/*.mdx`,
    contentType: "mdx",
    fields: {
        archived: {
            type: "boolean",
        },
        title: {
            type: 'string',
            description: 'The title of the post',
            required: true,
        },
        summary: {
            type: "string",
            description: "A small summary of what the post is about",
            required: true,
        },
        image: {
            type: "string",
            description: "The hero image of the post",
            required: true,
        },
        date: {
            type: 'date',
            description: 'The date of the post',
            required: true,
        },
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (post) => `${post._raw.flattenedPath}`,
        },
        url: {
            type: "string",
            resolve: (post) => post.archived === true ? `/blog/archive/${post._raw.flattenedPath}` : `/blog/${post._raw.flattenedPath}`
        },
        readingTime: {
            type: "json",
            resolve: (post) => readingTime(post.body.raw).text,
        },
        wordCount: {
            type: "number",
            resolve: (post) => post.body.raw.split(/\s+/gu).length,
        }
    },
}));

const formattingOptions = {
    theme: "vitesse-light",
    keepBackground: false,
    onVisitLine(node: any) {
        // Prevent lines from collapsing in `display: grid` mode, and allow empty
        // lines to be copy/pasted
        if (node.children.length === 0) {
            node.children = [{ type: 'text', value: ' ' }];
        }
    },
    onVisitHighlightedLine(node: any) {
        node.properties.className.push('highlighted');
    },
    onVisitHighlightedWord(node: any) {
        node.properties.className = ['word'];
    },
};


export default makeSource({
    contentDirPath: 'posts',
    documentTypes: [Post],
    mdx: {
        remarkPlugins: [
            remarkGfm
        ],
        // rehypePlugins: [
        //     [rehypePrettyCode, formattingOptions]
        // ]
    }
})