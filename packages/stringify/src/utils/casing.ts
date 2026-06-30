const CASING_FIELDS = new Set(["title", "booktitle", "abstract"]);

export function shouldProtectCasing(key: string, mode: "clean" | "markup"): boolean {
    return mode === "clean" && CASING_FIELDS.has(key);
}

export function protectCasing(value: string): string {
    return value.replace(/(?<=^|[\s\p{P}])([\p{L}0-9]+)(?=[\s\p{P}]|$)/gu, (match) => {
        const numUpper = (match.match(/\p{Lu}/gu) || []).length;

        // clean mode protect uppercase letters
        if (numUpper > 0) {
            return `{${match}}`;
        }
        return match;
    });
}
