export interface ImageProps {
    "Camera Used": CameraUsed;
    "Date Taken": DateTaken;
    Tags: Tags;
    Image: ImageClass;
    Name: Name;
}

export interface CameraUsed {
    id: string;
    type: string;
    rich_text: RichText[];
}

export interface RichText {
    type: Type;
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
    color: AnnotationsColor;
}

export enum AnnotationsColor {
    Default = "default",
}

export interface Text {
    content: string;
    link: null;
}

export enum Type {
    Text = "text",
}

export interface DateTaken {
    id: string;
    type: string;
    date: DateClass;
}

export interface DateClass {
    start: Date;
    end: null;
    time_zone: null;
}

export interface ImageClass {
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
    title: RichText[];
}

export interface Tags {
    id: string;
    type: string;
    multi_select: MultiSelect[];
}

export interface MultiSelect {
    id: string;
    name: NameEnum;
    color: MultiSelectColor;
}

export enum MultiSelectColor {
    Blue = "blue",
    Gray = "gray",
    Red = "red",
}

export enum NameEnum {
    Flower = "flower",
    Outside = "outside",
    Structure = "structure",
}
