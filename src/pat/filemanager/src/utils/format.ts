// Presentation helpers. Dates are formatted with the real Intl API (the catalog
// already sorts them as dates), not string-munged.

const MISSING = new Set(["1969/12/31 19:00:00 US/Eastern", "1969/12/31", "None", ""]);

/** Parse a catalog date string, treating the "no date" sentinels as null. */
function parseDate(value: unknown): Date | null {
    if (value == null || typeof value !== "string" || MISSING.has(value)) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: unknown): string {
    const date = parseDate(value);
    if (!date) return "";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

/**
 * True when the item's effective (publishing) date is set and still in the
 * future — i.e. it is not yet publicly accessible ("inactive portal content").
 */
export function isIneffective(item: Record<string, any>, now: Date = new Date()): boolean {
    const date = parseDate(item?.EffectiveDate);
    return date != null && now < date;
}

/** True when the item's expiration date is set and has already passed. */
export function isExpired(item: Record<string, any>, now: Date = new Date()): boolean {
    const date = parseDate(item?.ExpirationDate);
    return date != null && now > date;
}

export function formatSize(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value !== "number" || !Number.isFinite(value)) return "";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = value;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
        size /= 1024;
        unit += 1;
    }
    return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

/**
 * Resolve a thumbnail url from an item's image_scales metadata.
 *
 * `scale` may be a single scale name or a fallback chain (first present wins):
 * the table asks for "thumb", the grid for a larger ["preview","mini","thumb"].
 * Falls back to the full-size original only when none of the wanted scales exist.
 * Returns null when the item has no preview image.
 */
export function thumbnailUrl(
    item: Record<string, any>,
    scale: string | string[] = "thumb",
    field = "image"
): string | null {
    const scales = item?.image_scales as Record<string, any> | undefined;
    const entry = scales?.[field]?.[0];
    if (!entry) return null;
    const base = (item["@id"] as string)?.replace(/\/+$/, "") || "";
    const wanted = Array.isArray(scale) ? scale : [scale];
    let download: string | undefined;
    for (const name of wanted) {
        const candidate = entry.scales?.[name]?.download;
        if (candidate) {
            download = candidate;
            break;
        }
    }
    if (!download) download = entry.download;
    if (!download) return null;
    return /^https?:\/\//.test(download) ? download : `${base}/${download}`;
}
