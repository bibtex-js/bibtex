export function processPages(pages: string): string {
    const normalized = pages.replace(/[\u2013\u2014]/g, "-");
    return normalized.replace(/(^|[^-])-(?=[^-]|$)/g, "$1--");
}
