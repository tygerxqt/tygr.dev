export interface Block {
    object: string;
    id: string;
    parent: Parent;
    created_time: Date;
    last_edited_time: Date;
    created_by: TedBy;
    last_edited_by: TedBy;
    has_children: boolean;
    children: any | undefined;
    archived: boolean;
    type: string;
    // stuff 👍
    paragraph: Paragraph;
    heading_1: Heading;
    heading_2: Heading;
    heading_3: Heading;
    bulleted_list_item: Paragraph;
    numbered_list_item: Paragraph;
    to_do: ToDo;
    toggle: Paragraph;
    image: Image;
    quote: Paragraph;
}

export interface TedBy {
    object: string;
    id: string;
}

export interface Paragraph {
    rich_text: RichText[];
    color: string;
}

export interface Heading extends Paragraph {
    is_toggleable: boolean;
}

export interface ToDo {
    rich_text: RichText[];
    checked: boolean;
    color: string;
}

export interface Image {
    caption: RichText[];
    type: string;
    file: File;
    external: External;
}

export interface External {
    url: string;
}

export interface File {
    url: string;
    expiry_time: Date;
}

export interface RichText {
    type: string;
    text: Text;
    annotations: Annotations;
    plain_text: string;
    href: string;
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
    link: Link;
}

export interface Link {
    url: string;
}

export interface Parent {
    type: string;
    page_id: string;
}
