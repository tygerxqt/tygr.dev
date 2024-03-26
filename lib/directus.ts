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

export interface Tool {
	id: number;
	date_updated?: Date;
	dob?: Date;
	dod?: Date;
	name: string;
	summary: string;
	category: string;
	status:
		| "alive"
		| "replaced"
		| "repaired"
		| "broken"
		| "discontinued"
		| "dead";
	url: string;
}

export interface Post {
	slug: string;
	status: "published" | "archived" | "draft";
	date_created: string;
	user_updated?: string;
	date_updated?: string;
	content: string;
	heading: string;
	hero: string;
	summary: string;
}

interface Schema {
	projects: Project[];
	links: Link[];
	gallery: Image[];
	gear: Tool[];
	posts: Post[];
}

export const cms = createDirectus<Schema>(
	process.env.NEXT_PUBLIC_CMS_URL as string
).with(rest());
