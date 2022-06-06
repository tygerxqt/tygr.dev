export interface FeedPost {
    fields: {
        title: string;
        authorId: string;
        date: string;
        hero: {
            fields: {
                file: {
                    url: string;
                }
            }
        }
        body: string;
        data: Object;
    }
}