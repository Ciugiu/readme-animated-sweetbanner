import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Trash2Icon,
    PlusIcon,
    ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BannerConfig } from "@/features/shared";
import { getIconUrl } from "@/features/shared";

interface SettingsPanelProps {
    config: BannerConfig;
    selectedMeteor: string | null;
    setSelectedMeteor: (id: string | null) => void;
    updateConfig: (updates: Partial<BannerConfig>) => void;
    addMeteor: () => void;
    removeMeteor: (id: string) => void;
}

export function SettingsPanel({
    config,
    selectedMeteor,
    setSelectedMeteor,
    updateConfig,
    addMeteor,
    removeMeteor,
}: SettingsPanelProps) {
    return (
        <Card className="w-full lg:w-72 shrink-0 flex flex-col min-h-0">
            <CardHeader className="pb-2 shrink-0">
                <CardTitle className="text-sm">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-0">
                <Tabs defaultValue="general" className="w-full flex-1 flex flex-col min-h-0">
                    <TabsList className="w-full shrink-0">
                        <TabsTrigger value="general" className="flex-1">
                            General
                        </TabsTrigger>
                        <TabsTrigger value="meteors" className="flex-1">
                            Meteors
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4 mt-4">
                        {/* Background Color */}
                        <div className="space-y-2">
                            <Label>Background Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={config.backgroundColor}
                                    onChange={(e) =>
                                        updateConfig({ backgroundColor: e.target.value })
                                    }
                                    className="w-10 h-7 p-0.5 cursor-pointer"
                                />
                                <Input
                                    value={config.backgroundColor}
                                    onChange={(e) =>
                                        updateConfig({ backgroundColor: e.target.value })
                                    }
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5">
                                <ImageIcon className="size-3" />
                                Avatar URL
                            </Label>
                            <Input
                                value={config.avatarUrl}
                                onChange={(e) => updateConfig({ avatarUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Avatar Size: {config.avatarSize}px</Label>
                            <Slider
                                value={[config.avatarSize]}
                                onValueChange={([v]) => updateConfig({ avatarSize: v })}
                                min={50}
                                max={150}
                                step={5}
                            />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-[10px]">Width</Label>
                                <Input
                                    type="number"
                                    value={config.width}
                                    onChange={(e) =>
                                        updateConfig({ width: parseInt(e.target.value) || 800 })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">Height</Label>
                                <Input
                                    type="number"
                                    value={config.height}
                                    onChange={(e) =>
                                        updateConfig({
                                            height: parseInt(e.target.value) || 200,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Particles: {config.particleCount}</Label>
                            <Slider
                                value={[config.particleCount]}
                                onValueChange={([v]) => updateConfig({ particleCount: v })}
                                min={0}
                                max={10}
                                step={1}
                            />
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={config.particleColor}
                                    onChange={(e) =>
                                        updateConfig({ particleColor: e.target.value })
                                    }
                                    className="w-10 h-7 p-0.5 cursor-pointer"
                                />
                                <Input
                                    value={config.particleColor}
                                    onChange={(e) =>
                                        updateConfig({ particleColor: e.target.value })
                                    }
                                    className="flex-1"
                                    placeholder="Particle color"
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Wave Gradient</Label>
                            <div className="flex gap-1">
                                <Input
                                    type="color"
                                    value={config.waveColorStart}
                                    onChange={(e) =>
                                        updateConfig({ waveColorStart: e.target.value })
                                    }
                                    className="w-8 h-7 p-0.5 cursor-pointer flex-1"
                                    title="Start color"
                                />
                                <Input
                                    type="color"
                                    value={config.waveColorMid}
                                    onChange={(e) =>
                                        updateConfig({ waveColorMid: e.target.value })
                                    }
                                    className="w-8 h-7 p-0.5 cursor-pointer flex-1"
                                    title="Middle color"
                                />
                                <Input
                                    type="color"
                                    value={config.waveColorEnd}
                                    onChange={(e) =>
                                        updateConfig({ waveColorEnd: e.target.value })
                                    }
                                    className="w-8 h-7 p-0.5 cursor-pointer flex-1"
                                    title="End color"
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Glow Gradient</Label>
                            <div className="flex gap-1">
                                <Input
                                    type="color"
                                    value={config.glowColorStart}
                                    onChange={(e) =>
                                        updateConfig({ glowColorStart: e.target.value })
                                    }
                                    className="w-8 h-7 p-0.5 cursor-pointer flex-1"
                                    title="Start color"
                                />
                                <Input
                                    type="color"
                                    value={config.glowColorMid}
                                    onChange={(e) =>
                                        updateConfig({ glowColorMid: e.target.value })
                                    }
                                    className="w-8 h-7 p-0.5 cursor-pointer flex-1"
                                    title="Middle color"
                                />
                                <Input
                                    type="color"
                                    value={config.glowColorEnd}
                                    onChange={(e) =>
                                        updateConfig({ glowColorEnd: e.target.value })
                                    }
                                    className="w-8 h-7 p-0.5 cursor-pointer flex-1"
                                    title="End color"
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="borderEnabled"
                                    checked={config.borderEnabled}
                                    onChange={(e) =>
                                        updateConfig({ borderEnabled: e.target.checked })
                                    }
                                    className="size-4 cursor-pointer"
                                />
                                <Label htmlFor="borderEnabled" className="cursor-pointer">
                                    Enable Border
                                </Label>
                            </div>
                            {config.borderEnabled && (
                                <>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={config.borderColor}
                                            onChange={(e) =>
                                                updateConfig({ borderColor: e.target.value })
                                            }
                                            className="w-10 h-7 p-0.5 cursor-pointer"
                                        />
                                        <Input
                                            value={config.borderColor}
                                            onChange={(e) =>
                                                updateConfig({ borderColor: e.target.value })
                                            }
                                            className="flex-1"
                                            placeholder="Border color"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px]">
                                            Radius: {config.borderRadius}px
                                        </Label>
                                        <Slider
                                            value={[config.borderRadius]}
                                            onValueChange={([v]) =>
                                                updateConfig({ borderRadius: v })
                                            }
                                            min={0}
                                            max={50}
                                            step={1}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px]">
                                            Size: {config.borderSize}px
                                        </Label>
                                        <Slider
                                            value={[config.borderSize]}
                                            onValueChange={([v]) =>
                                                updateConfig({ borderSize: v })
                                            }
                                            min={1}
                                            max={10}
                                            step={1}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="meteors" className="mt-4 flex-1 flex flex-col min-h-0">
                        <div className="space-y-2 flex-1 flex flex-col min-h-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full shrink-0"
                                onClick={addMeteor}
                            >
                                <PlusIcon className="size-3.5" />
                                Add Meteor
                            </Button>

                            <ScrollArea className="flex-1 min-h-0">
                                <div className="space-y-1 pr-2">
                                    {config.meteors.map((meteor, index) => (
                                        <div
                                            key={meteor.id}
                                            className={cn(
                                                "flex items-center gap-2 rounded-md border p-2 cursor-pointer transition-colors",
                                                selectedMeteor === meteor.id
                                                    ? "border-primary bg-primary/5"
                                                    : "hover:bg-muted/50"
                                            )}
                                            onClick={() => setSelectedMeteor(meteor.id)}
                                        >
                                            <img
                                                src={meteor.iconUrl || getIconUrl(
                                                    meteor.iconSlug
                                                )}
                                                alt={meteor.iconSlug}
                                                className="size-5"
                                            />
                                            <span className="flex-1 text-xs truncate">
                                                Meteor {index + 1}
                                            </span>
                                            <div
                                                className="size-3 rounded-full border"
                                                style={{ backgroundColor: meteor.trailColor }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeMeteor(meteor.id);
                                                }}
                                            >
                                                <Trash2Icon className="size-3 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

