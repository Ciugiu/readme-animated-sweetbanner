import { ICONIFY_API_BASE } from "./constants";

/**
 * Get the Iconify SVG URL for an icon
 * @param iconName Full icon name in format "prefix:icon-name"
 */
export function getIconifyUrl(iconName: string): string {
    if (!iconName || !iconName.includes(":")) {
        // Fallback for old-style slugs without prefix
        return `${ICONIFY_API_BASE}/logos/${iconName}.svg`;
    }
    const [prefix, name] = iconName.split(":");
    return `${ICONIFY_API_BASE}/${prefix}/${name}.svg`;
}

/**
 * Get icon URL - supports both Iconify format and custom URLs
 */
export function getIconUrl(iconSlug: string, customUrl?: string): string {
    if (customUrl) {
        return customUrl;
    }
    return getIconifyUrl(iconSlug);
}

export async function fetchImageAsBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Failed to fetch image:", error);
        return "";
    }
}
