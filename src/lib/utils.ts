
export function toTitleCase(str: string | null | undefined): string {
    if (!str) return "-"
    return str
        .toLowerCase()
        .replace(/(?:^|\s|-)[\S]/g, (char) => char.toUpperCase())
}
