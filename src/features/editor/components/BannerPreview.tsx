import { useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DownloadIcon,
    CopyIcon,
    SparklesIcon,
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
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <SparklesIcon className="size-4" />
                            Banner Preview
                        </CardTitle>
                        <CardDescription>
                            Animated SVG banner with meteor icons
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
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

