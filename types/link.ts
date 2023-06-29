export interface LinkProps {
    link: Link;
    type: Type;
    name: Name;
    summary: Summary;
}

export interface Name {
    id: string;
    type: string;
    title: Richtext[];
}

export interface Type {
    id: string;
    type: string;
    select?: any;
}

export interface Link {
    id: string;
    type: string;
    rich_text: Richtext[];
}

export interface Summary {
    id: string;
    type: string;
    rich_text: Richtext[];
}

export interface Richtext {
    type: string;
    text: Text;
    annotations: Annotations;
    plain_text: string;
    href?: any;
}

export interface Annotations {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
}