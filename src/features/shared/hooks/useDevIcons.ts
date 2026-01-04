import { useState, useEffect } from "react";
import type { DevIcon } from "@/features/shared/types";
import { DEVICONS_LIST_URL } from "@/features/shared/constants";

export function useDevIcons() {
    const [allIcons, setAllIcons] = useState<DevIcon[]>([]);
    const [isLoadingIcons, setIsLoadingIcons] = useState(true);

    useEffect(() => {
        fetch(DEVICONS_LIST_URL)
            .then((res) => res.json())
            .then((data: DevIcon[]) => {
                setAllIcons(data);
                setIsLoadingIcons(false);
            })
            .catch((err) => {
                console.error("Failed to fetch devicons:", err);
                setIsLoadingIcons(false);
            });
    }, []);

    const filterIcons = (search: string) => {
        if (!search.trim()) {
            return allIcons.slice(0, 50);
        }
        const searchLower = search.toLowerCase();
        return allIcons.filter((icon) =>
            icon.name.toLowerCase().includes(searchLower) ||
            icon.altnames.some((alt) => alt.toLowerCase().includes(searchLower)) ||
            icon.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        ).slice(0, 50);
    };

    return { allIcons, isLoadingIcons, filterIcons };
}

