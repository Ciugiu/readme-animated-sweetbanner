import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function getSystemPrefersDark(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readInitialTheme(): Theme {
    try {
        if (typeof window === "undefined") return "light";
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark" || saved === "system") return saved;
    } catch {
        // ignore
    }
    return "system";
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => readInitialTheme());

    const applyTheme = useCallback((t: Theme) => {
        if (typeof document === "undefined") return;
        const html = document.documentElement;

        const isDark =
            t === "dark" ? true : t === "light" ? false : getSystemPrefersDark();

        if (isDark) {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    }, []);

    useEffect(() => {
        applyTheme(theme);

        let mq: MediaQueryList | null = null;
        const handleChange = () => {
            if (theme !== "system") return;
            applyTheme("system");
        };

        if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
            mq = window.matchMedia("(prefers-color-scheme: dark)");
            try {
                mq.addEventListener?.("change", handleChange);
                mq.addListener?.(handleChange as never);
            } catch {
                // ignore
            }
        }

        return () => {
            if (mq) {
                mq.removeEventListener?.("change", handleChange);
                mq.removeListener?.(handleChange as never);
            }
        };
    }, [theme, applyTheme]);

    const setTheme = useCallback((t: Theme) => {
        try {
            localStorage.setItem(STORAGE_KEY, t);
        } catch {
            // ignore
        }
        setThemeState(t);
        applyTheme(t);
    }, [applyTheme]);

    const clearTheme = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // ignore
        }
        setThemeState("system");
        applyTheme("system");
    }, [applyTheme]);

    return {
        theme,
        setTheme,
        clearTheme,
    } as const;
}

export default useTheme;
