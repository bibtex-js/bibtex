export interface BibTeXEntry {
  type: string;
  key: string;
  fields: Record<string, string>;
}

export function stringify(entries: BibTeXEntry[]): string {
  return entries
    .map((entry) => {
      const fieldsString = Object.entries(entry.fields)
        .map(([key, value]) => `  ${key} = {${value}}`)
        .join(",\n");
      
      return `@${entry.type}{${entry.key},\n${fieldsString}\n}`;
    })
    .join("\n\n");
}