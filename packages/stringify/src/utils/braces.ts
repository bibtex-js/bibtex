import { MalformedBibTeXError } from "../types";

export function validateBraces(value: string, fieldName: string, entryKey: string): void {
    let depth = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === "\\") {
            i++;
            continue;
        }

        if (value[i] === "{") depth++;
        else if (value[i] === "}") depth--;

        if (depth < 0) {
            throw new MalformedBibTeXError(`Unbalanced closing brace '}' in field '${fieldName}' of entry '${entryKey}'`);
        }
    }

    if (depth > 0) {
        throw new MalformedBibTeXError(`Unbalanced opening brace '{' in field '${fieldName}' of entry '${entryKey}'`);
    }

    let trailingBackslashes = 0;
    for (let i = value.length - 1; i >= 0; i--) {
        if (value[i] === "\\") trailingBackslashes++;
        else break;
    }
    if (trailingBackslashes % 2 !== 0) {
        throw new MalformedBibTeXError(`Trailing backslash escapes structural brace in field '${fieldName}' of entry '${entryKey}'`);
    }
}

export function recoverBraces(value: string): string {
    let result = "";
    let depth = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === "\\") {
            result += value[i];
            if (i + 1 < value.length) {
                result += value[i + 1];
                i++;
            }
            continue;
        }

        if (value[i] === "{") {
            depth++;
            result += "{";
        } else if (value[i] === "}") {
            if (depth > 0) {
                depth--;
                result += "}";
            }
        } else {
            result += value[i];
        }
    }

    let trailingBackslashes = 0;
    for (let i = result.length - 1; i >= 0; i--) {
        if (result[i] === "\\") trailingBackslashes++;
        else break;
    }
    if (trailingBackslashes % 2 !== 0) {
        result = result.substring(0, result.length - 1);
    }

    for (let i = 0; i < depth; i++) {
        result += "}";
    }

    return result;
}
