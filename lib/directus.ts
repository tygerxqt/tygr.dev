import { createDirectus, rest, readItems } from "@directus/sdk";

interface Project {
    id: number;
    date_created: Date;
    date_updated: Date;
    name: string;
    summary: string;
    link: string;
    private: boolean;
    year: string;
    image: string;
}

export interface Link {
    id: number;
    date_created: Date;
    date_updated: Date;
    name: string;
    summary: string;
    link: string;
    type: string[];
    private: boolean;
}

export interface Image {
    id: number;
    status: "published" | "draft" | "archived";
    date_created: Date;
    date_updated: Date;
    name: string;
    tags: string[];
    shot_at: Date;
    camera: string;
    image: string;
}

interface Schema {
    projects: Project[];
    links: Link[];
    gallery: Image[];
}

export const cms = createDirectus<Schema>(process.env.NEXT_PUBLIC_CMS_URL as string).with(rest());