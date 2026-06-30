import { BibTeXEntry, StringifierConfig, MalformedBibTeXError } from "./types";
import { escapeValue } from "./utils/escaping";
import { shouldProtectCasing, protectCasing } from "./utils/casing";
import { processPages } from "./utils/pages";
import { validateBraces, recoverBraces } from "./utils/braces";

const VERBATIM_FIELDS = new Set(["url", "doi", "eprint", "file"]);
const VALID_MONTHS = new Set(["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]);

export function stringify(entries: BibTeXEntry[], config: StringifierConfig = {}): string {
    const mode = config.mode ?? "clean";
    const onError = config.onError ?? "throw";

    return entries.map((entry) => {
        try {
            if (/[\s,{}]/.test(entry.key)) {
                throw new Error(`Invalid BibTeX citation key: "${entry.key}". Contains illegal formatting characters.`);
            }

            const formattedFields: string[] = [];
            const sortedKeys = Object.keys(entry.fields).sort();

            for (const rawKey of sortedKeys) {
                const rawValue = entry.fields[rawKey];
                if (rawValue === undefined || rawValue === null || rawValue === "") continue;

                const key = rawKey.toLowerCase();
                let valueStr = Array.isArray(rawValue) ? rawValue.join(" and ") : String(rawValue);

                if (key === "pages") {
                    valueStr = processPages(valueStr);
                }

                if (mode === "markup") {
                    try {
                        validateBraces(valueStr, key, entry.key);
                    } catch (err) {
                        if (err instanceof MalformedBibTeXError) {
                            if (onError === "omit") continue; // skip this field
                            if (onError === "recover") valueStr = recoverBraces(valueStr);
                            else throw err; // throw mode
                        } else {
                            throw err;
                        }
                    }
                }

                const isVerbatim = VERBATIM_FIELDS.has(key);
                valueStr = escapeValue(valueStr, key, isVerbatim, mode);

                if (shouldProtectCasing(key, mode)) {
                    valueStr = protectCasing(valueStr);
                }

                if (key === "month" && VALID_MONTHS.has(valueStr.toLowerCase())) {
                    formattedFields.push(`  ${key} = ${valueStr.toLowerCase()}`);
                } else {
                    formattedFields.push(`  ${key} = {${valueStr}}`);
                }
            }

            const fieldsString = formattedFields.length > 0 ? formattedFields.join(",\n") + "," : "";
            return `@${entry.type.toLowerCase()}{${entry.key},\n${fieldsString}\n}`;
        } catch (err) {
            if (err instanceof MalformedBibTeXError && onError === "omit") {
                return ""; // skip
            }
            throw err;
        }
    }).filter(Boolean).join("\n\n") + (entries.length > 0 ? "\n" : "");
}
