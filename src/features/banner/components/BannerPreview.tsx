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
} from "lucide-react";

interface BannerPreviewProps {
    svgCode: string;
    svgDataUrl: string;
    width: number;
}

export function BannerPreview({ svgCode, svgDataUrl, width }: BannerPreviewProps) {
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
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="bg-zinc-900 dark:bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-700 hover:text-white"
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

