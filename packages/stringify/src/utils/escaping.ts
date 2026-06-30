const ESCAPE_MAP_MARKUP: Record<string, string> = {
    "&": "\\&",
    "%": "\\%",
    "$": "\\$",
    "#": "\\#",
    "_": "\\_",
};

const ESCAPE_MAP_CLEAN: Record<string, string> = {
    "&": "\\&",
    "%": "\\%",
    "$": "\\$",
    "#": "\\#",
    "_": "\\_",
    "^": "\\^{}",
    "~": "\\~{}",
    "\\": "\\textbackslash{}",
    "{": "\\{",
    "}": "\\}",
};

export function escapeValue(value: string, fieldKey: string, isVerbatim: boolean, mode: "clean" | "markup"): string {
    if (isVerbatim) return value;

    if (mode === "clean") {
        if (fieldKey !== "abstract" && fieldKey !== "note") {
            value = value.replace(/\n/g, " ");
        }
        return value.replace(/[&%$#_^~\\{}]/g, (match) => ESCAPE_MAP_CLEAN[match]);
    }

    const numDollars = (value.match(/\$/g) || []).length;
    if (numDollars % 2 !== 0) {
        return value.replace(/[&%$#_]/g, (match) => ESCAPE_MAP_MARKUP[match]);
    }

    const parts = value.split(/(\$.*?\$)/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            parts[i] = parts[i].replace(/[&%$#_]/g, (match) => ESCAPE_MAP_MARKUP[match]);
        }
    }
    return parts.join("");
}
