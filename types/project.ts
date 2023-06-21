export interface ProjectProps {
    summary: Summary;
    private: Private;
    link: Link;
    year: Year;
    name: Name;
    image: Image;
}

export interface Link {
    id: string;
    type: string;
    url: string;
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

export interface Private {
    id: string;
    type: string;
    checkbox: boolean;
}

export interface Summary {
    id: string;
    type: string;
    rich_text: Title[];
}

export interface Year {
    id: string;
    type: string;
    number: number;
}

interface Image {
    id: string;
    type: string;
    files: File[];
}

interface File {
    name: string;
    type: string;
    file: {
        url: string;
        expiry_time: string;
    };
}