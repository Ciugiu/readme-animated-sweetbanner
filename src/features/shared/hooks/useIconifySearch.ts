import { useState, useCallback, useRef, useEffect } from "react";
import type { UnifiedIcon, IconifySearchResponse } from "@/features/shared/types";
import { ICONIFY_API_BASE, ICONIFY_SEARCH_LIMIT } from "@/features/shared/constants";
import { getIconifyUrl } from "@/features/shared/utils";

/**
 * Extract colors from SVG content and find the dominant one
 * Looks for fill, stroke, and stop-color attributes
 */
function extractDominantColorFromSvg(svgContent: string): string | null {
    const colorRegex = /(?:fill|stroke|stop-color)\s*[=:]\s*["']?(#[0-9A-Fa-f]{3,8}|rgb\([^)]+\)|[a-zA-Z]+)["']?/gi;
    const colorCounts = new Map<string, number>();

    let match;
    while ((match = colorRegex.exec(svgContent)) !== null) {
        let color = match[1]?.toLowerCase();
        if (!color) continue;

        if (color === "none" || color === "transparent" || color === "inherit" || color === "currentcolor") {
            continue;
        }

        if (color === "#000" || color === "#000000" || color === "black") {
            continue;
        }
        if (color === "#fff" || color === "#ffffff" || color === "white") {
            continue;
        }

        if (/^#[0-9a-f]{3}$/i.test(color)) {
            color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
        }

        if (color.startsWith("rgb(")) {
            const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1]).toString(16).padStart(2, "0");
                const g = parseInt(rgbMatch[2]).toString(16).padStart(2, "0");
                const b = parseInt(rgbMatch[3]).toString(16).padStart(2, "0");
                color = `#${r}${g}${b}`;
            }
        }

        if (/^#[0-9a-f]{6}$/i.test(color)) {
            colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
        }
    }

    let dominantColor: string | null = null;
    let maxCount = 0;

    for (const [color, count] of colorCounts) {
        if (count > maxCount) {
            maxCount = count;
            dominantColor = color;
        }
    }

    return dominantColor;
}

/**
 * Fetch SVG and extract its dominant color
 */
async function fetchSvgDominantColor(url: string, signal?: AbortSignal): Promise<string> {
    try {
        const response = await fetch(url, { signal });
        if (!response.ok) return "#888888";

        const svgContent = await response.text();
        const dominantColor = extractDominantColorFromSvg(svgContent);

        return dominantColor || "#888888";
    } catch {
        return "#888888";
    }
}

const DEFAULT_ICONS: UnifiedIcon[] = [
    { name: "logos:react", displayName: "react", prefix: "logos", color: "#61DAFB", url: "" },
    { name: "logos:typescript-icon", displayName: "typescript-icon", prefix: "logos", color: "#3178C6", url: "" },
    { name: "logos:javascript", displayName: "javascript", prefix: "logos", color: "#F7DF1E", url: "" },
    { name: "logos:nodejs-icon", displayName: "nodejs-icon", prefix: "logos", color: "#339933", url: "" },
    { name: "logos:python", displayName: "python", prefix: "logos", color: "#3776AB", url: "" },
    { name: "logos:vue", displayName: "vue", prefix: "logos", color: "#4FC08D", url: "" },
    { name: "logos:angular-icon", displayName: "angular-icon", prefix: "logos", color: "#DD0031", url: "" },
    { name: "logos:svelte-icon", displayName: "svelte-icon", prefix: "logos", color: "#FF3E00", url: "" },
    { name: "mdi:github", displayName: "github", prefix: "mdi", color: "#ffffff", url: "" },
    { name: "logos:docker-icon", displayName: "docker-icon", prefix: "logos", color: "#2496ED", url: "" },
    { name: "logos:rust", displayName: "rust", prefix: "logos", color: "#000000", url: "" },
    { name: "logos:go", displayName: "go", prefix: "logos", color: "#00ADD8", url: "" },
    { name: "logos:java", displayName: "java", prefix: "logos", color: "#007396", url: "" },
    { name: "logos:kotlin-icon", displayName: "kotlin-icon", prefix: "logos", color: "#7F52FF", url: "" },
    { name: "logos:swift", displayName: "swift", prefix: "logos", color: "#F05138", url: "" },
    { name: "logos:c-plusplus", displayName: "c-plusplus", prefix: "logos", color: "#00599C", url: "" },
    { name: "logos:html-5", displayName: "html-5", prefix: "logos", color: "#E34F26", url: "" },
    { name: "logos:css-3", displayName: "css-3", prefix: "logos", color: "#1572B6", url: "" },
    { name: "logos:tailwindcss-icon", displayName: "tailwindcss-icon", prefix: "logos", color: "#06B6D4", url: "" },
    { name: "logos:nextjs-icon", displayName: "nextjs-icon", prefix: "logos", color: "#000000", url: "" },
].map(icon => ({ ...icon, url: getIconifyUrl(icon.name) }));

export function useIconifySearch() {
    const [icons, setIcons] = useState<UnifiedIcon[]>(DEFAULT_ICONS);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const colorFetchControllerRef = useRef<AbortController | null>(null);

    const searchIcons = useCallback(async (query: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        if (colorFetchControllerRef.current) {
            colorFetchControllerRef.current.abort();
        }

        if (!query.trim()) {
            setIcons(DEFAULT_ICONS);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        abortControllerRef.current = new AbortController();

        try {
            const url = new URL(`${ICONIFY_API_BASE}/search`);
            url.searchParams.set("query", query);
            url.searchParams.set("limit", String(ICONIFY_SEARCH_LIMIT));

            const response = await fetch(url.toString(), {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`);
            }

            const data: IconifySearchResponse = await response.json();

            const initialIcons: UnifiedIcon[] = data.icons.map((iconName) => {
                const [prefix, ...nameParts] = iconName.split(":");
                const name = nameParts.join(":");
                return {
                    name: iconName,
                    displayName: name,
                    prefix,
                    color: "#888888",
                    url: getIconifyUrl(iconName),
                };
            });

            setIcons(initialIcons);
            setIsLoading(false);

            colorFetchControllerRef.current = new AbortController();
            const colorSignal = colorFetchControllerRef.current.signal;

            const batchSize = 10;
            for (let i = 0; i < initialIcons.length; i += batchSize) {
                if (colorSignal.aborted) break;

                const batch = initialIcons.slice(i, i + batchSize);
                const colorPromises = batch.map(async (icon) => {
                    const color = await fetchSvgDominantColor(icon.url, colorSignal);
                    return { name: icon.name, color };
                });

                try {
                    const colors = await Promise.all(colorPromises);

                    if (!colorSignal.aborted) {
                        setIcons(prevIcons =>
                            prevIcons.map(icon => {
                                const colorData = colors.find(c => c.name === icon.name);
                                return colorData ? { ...icon, color: colorData.color } : icon;
                            })
                        );
                    }
                } catch {
                    console.warn("Color fetching aborted or failed for a batch.");
                }
            }
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                return;
            }
            console.error("Failed to search icons:", error);
            setIcons([]);
            setIsLoading(false);
        }
    }, []);

    // Debounced search handler
    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            searchIcons(query);
        }, 300);
    }, [searchIcons]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            if (colorFetchControllerRef.current) {
                colorFetchControllerRef.current.abort();
            }
        };
    }, []);

    return {
        icons,
        isLoading,
        searchQuery,
        setSearchQuery: handleSearchChange,
        fetchSvgDominantColor,
    };
}

export { fetchSvgDominantColor };
