export default interface FeaturedProjects {
    [index: number]: {
        fields: {
            id: number,
            published: boolean,
            beta: boolean,
            archived: boolean,
            featured: boolean,
            title: string,
            description: string,
            image: {
                metadata: Object,
                sys: Object,
                fields: {
                    title: string,
                    description: string,
                    file: {
                        url: string,
                        details: {
                            size: number,
                            image: {
                                width: number,
                                height: number,
                            },
                        },
                        fileName: string,
                        contentType: string,
                    }
                }
            },
            githubLink: string,
            deployLink: string,
            tags: [index: string],
        }
    }
}