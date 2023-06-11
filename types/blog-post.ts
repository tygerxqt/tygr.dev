export interface BlogPost {
    summary: Slug;
    hero: Hero;
    status: BlogPostStatus;
    date: BlogPostDate;
    slug: Slug;
    name: Name;
}

export interface BlogPostDate {
    id: string;
    type: string;
    date: DateDate;
}

export interface DateDate {
    start: Date;
    end: null;
    time_zone: null;
}

export interface Hero {
    id: string;
    type: string;
    files: FileElement[];
}

export interface FileElement {
    name: string;
    type: string;
    file: FileFile;
}

export interface FileFile {
    url: string;
    expiry_time: Date;
}

export interface Name {
    id: string;
    type: string;
    title: Title[];
}

export interface Title {
    type: string;
    text: Text;
    annotations: Annotations;
    plain_text: string;
    href: null;
}

export interface Annotations {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
}

export interface Text {
    content: string;
    link: null;
}

export interface Slug {
    id: string;
    type: string;
    rich_text: Title[];
}

export interface BlogPostStatus {
    id: string;
    type: string;
    status: StatusStatus;
}

export interface StatusStatus {
    id: string;
    name: string;
    color: string;
}
