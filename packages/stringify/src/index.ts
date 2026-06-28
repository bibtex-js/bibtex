export type EntryType =
  | "article"
  | "book"
  | "booklet"
  | "conference"
  | "inbook"
  | "incollection"
  | "inproceedings"
  | "manual"
  | "mastersthesis"
  | "misc"
  | "phdthesis"
  | "proceedings"
  | "techreport"
  | "unpublished"
  | "online"
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
  /**
   * If true, tries to protect uppercase acronyms with braces {DNA}.
   */
  protectCasing?: boolean;
}

const VERBATIM_FIELDS = new Set(["url", "doi", "eprint", "file"]);
const MACRO_FIELDS = new Set(["month"]);

const ESCAPE_MAP: Record<string, string> = {
  "&": "\\&",
  "%": "\\%",
  "$": "\\$",
  "#": "\\#",
  "_": "\\_",
};

function escapeValue(value: string, isVerbatim: boolean): string {
  if (isVerbatim) {
    return value;
  }
  
  const parts = value.split(/(\$.*?\$)/g);
  
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) continue;
    
    parts[i] = parts[i].replace(/[&%$#_]/g, (match) => ESCAPE_MAP[match] || match);
  }

  return parts.join('');
}

function processPages(pages: string): string {
  return pages.replace(/(?<!-)-(?!-)/g, "--");
}

export function stringify(entries: BibTeXEntry[], { protectCasing = false }: StringifierConfig = {}): string {
  return entries.map((entry) => {
    const formattedFields: string[] = [];
    
    for (const [rawKey, rawValue] of Object.entries(entry.fields)) {
      if (rawValue === undefined || rawValue === null || rawValue === "") continue;
      
      const key = rawKey.toLowerCase();
      let valueStr = Array.isArray(rawValue) ? rawValue.join(" and ") : String(rawValue);
      
      if (key === "pages") {
        valueStr = processPages(valueStr);
      }
      
      valueStr = escapeValue(valueStr, VERBATIM_FIELDS.has(key));
      
      if (protectCasing && !VERBATIM_FIELDS.has(key)) {
        valueStr = valueStr.replace(/\b([A-Z]{2,})\b/g, "{$1}");
      }

      if (MACRO_FIELDS.has(key) && /^[a-z]+$/i.test(valueStr)) {
        formattedFields.push(`  ${key} = ${valueStr.toLowerCase()}`);
      } else {
        formattedFields.push(`  ${key} = {${valueStr}}`);
      }
    }
    
    const fieldsString = formattedFields.join(",\n");
    return `@${entry.type.toLowerCase()}{${entry.key},\n${fieldsString}\n}`;
  }).join("\n\n") + "\n";
}