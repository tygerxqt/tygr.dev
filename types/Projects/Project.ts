export default interface Project {
    id: number;
    published: boolean;
    beta: boolean;
    archived: boolean;
    featured: boolean;
    title: string;
    description: string;
    image: string;
    github_link?: string;
    deploy_link?: string;
    tags: [string];
}