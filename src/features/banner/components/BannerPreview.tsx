import { useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    DownloadIcon,
    CopyIcon,
    SparklesIcon,
    Star,
    Sun,
    Moon,
} from "lucide-react";
import { useTheme } from "@/features/shared";

interface BannerPreviewProps {
    svgCode: string;
    svgDataUrl: string;
    width: number;
}

export function BannerPreview({ svgCode, svgDataUrl, width }: BannerPreviewProps) {
    const { theme, setTheme } = useTheme();
    const isSystemDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && isSystemDark);

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(svgCode);
    }, [svgCode]);

    const downloadSvg = useCallback(() => {
        const blob = new Blob([svgCode], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "banner.svg";
        a.click();
        URL.revokeObjectURL(url);
    }, [svgCode]);

    return (
        <Card className="shrink-0">
            <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <SparklesIcon className="size-4" />
                            Banner Preview
                        </CardTitle>
                        <CardDescription>
                            Animated SVG banner with meteor icons
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Theme toggle: sun / moon */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                            aria-pressed={isDark}
                            title={isDark ? 'Switch to light' : 'Switch to dark'}
                        >
                            {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="snake-border bg-zinc-900 dark:bg-zinc-800 text-white border-transparent hover:bg-zinc-800 dark:hover:bg-zinc-700 hover:text-white transition-all duration-300"
                        >
                            <a
                                href="https://github.com/SystemVll/readme-animated-sweetbanner"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Star className="size-3.5 text-amber-400 fill-amber-400" />
                                Star on GitHub
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            <CopyIcon className="size-3.5" />
                            Copy SVG
                        </Button>
                        <Button size="sm" onClick={downloadSvg}>
                            <DownloadIcon className="size-3.5" />
                            Download
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    className="overflow-hidden rounded-lg mx-auto"
                    style={{ maxWidth: width }}
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={svgDataUrl}
                            alt="Banner Preview"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
