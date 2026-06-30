export type EntryType =
    | "article" | "book" | "booklet" | "conference" | "inbook"
    | "incollection" | "inproceedings" | "manual" | "mastersthesis"
    | "misc" | "phdthesis" | "proceedings" | "techreport"
    | "unpublished" | "online"
    | (string & {});

export type BibTeXFieldValue = string | number | string[] | undefined;

export interface BibTeXFields {
    author?: string[];
    editor?: string[];
    title?: string;
    year?: string | number;
    month?: string | number;
    journal?: string;
    booktitle?: string;
    publisher?: string;
    address?: string;
    volume?: string | number;
    number?: string | number;
    pages?: string;
    doi?: string;
    url?: string;
    note?: string;
    abstract?: string;
    [customField: string]: BibTeXFieldValue;
}

export interface BibTeXEntry {
    type: EntryType;
    key: string;
    fields: BibTeXFields;
}

export interface StringifierConfig {
    mode?: "clean" | "markup";
    onError?: "throw" | "omit" | "recover";
}

export class MalformedBibTeXError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MalformedBibTeXError";
    }
}
