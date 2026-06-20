import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { MeteorConfig, UnifiedIcon } from '@/features/shared'
import { getIconUrl } from '@/features/shared'

function MeteorPreview({ meteor, backgroundColor }: { meteor: MeteorConfig; backgroundColor: string }) {
    const pw = 220
    const ph = 110
    const iconSrc = meteor.iconBase64 || meteor.iconUrl || getIconUrl(meteor.iconSlug)
    const angleRad = (meteor.angle * Math.PI) / 180
    const trailLength = 50
    const dirX = Math.cos(angleRad) * trailLength
    const dirY = Math.sin(angleRad) * trailLength
    // Icon centered in preview
    const iconX = pw / 2 - 16
    const iconY = ph / 2 - 16
    // Trail tail is behind the icon (opposite direction of travel)
    const lineX1 = pw / 2 - dirX
    const lineY1 = ph / 2 - dirY
    const lineX2 = pw / 2
    const lineY2 = ph / 2

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
            ? {
                  r: parseInt(result[1], 16) / 255,
                  g: parseInt(result[2], 16) / 255,
                  b: parseInt(result[3], 16) / 255,
              }
            : null
    }
    const rgb = meteor.iconColor ? hexToRgb(meteor.iconColor) : null

    return (
        <svg
            viewBox={`0 0 ${pw} ${ph}`}
            width="100%"
            height={ph}
            style={{ background: backgroundColor, borderRadius: '6px' }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient
                    id="prev-trail"
                    x1={lineX1}
                    y1={lineY1}
                    x2={lineX2}
                    y2={lineY2}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor={meteor.trailColor} stopOpacity={0} />
                    <stop offset="100%" stopColor={meteor.trailColor} stopOpacity={1} />
                </linearGradient>
                <filter id="prev-glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {rgb && (
                    <filter id="prev-color" colorInterpolationFilters="sRGB">
                        <feColorMatrix
                            type="matrix"
                            values={`0 0 0 0 ${rgb.r.toFixed(3)} 0 0 0 0 ${rgb.g.toFixed(3)} 0 0 0 0 ${rgb.b.toFixed(3)} 0 0 0 1 0`}
                        />
                    </filter>
                )}
            </defs>
            <g filter="url(#prev-glow)">
                <line
                    x1={lineX1}
                    y1={lineY1}
                    x2={lineX2}
                    y2={lineY2}
                    stroke="url(#prev-trail)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <image
                    href={iconSrc}
                    width="32"
                    height="32"
                    x={iconX}
                    y={iconY}
                    {...(rgb ? { filter: 'url(#prev-color)' } : {})}
                />
            </g>
        </svg>
    )
}

interface MeteorEditorProps {
    selectedMeteorData: MeteorConfig | undefined
    updateMeteor: (id: string, updates: Partial<MeteorConfig>) => void
    icons: UnifiedIcon[]
    isLoadingIcons: boolean
    iconSearch: string
    setIconSearch: (search: string) => void
    fetchDominantColor: (url: string) => Promise<string>
    backgroundColor: string
}

export function MeteorEditor({
    selectedMeteorData,
    updateMeteor,
    icons,
    isLoadingIcons,
    iconSearch,
    setIconSearch,
    fetchDominantColor,
    backgroundColor,
}: MeteorEditorProps) {
    return (
        <Card className="flex-1 min-w-0 flex flex-col min-h-0">
            <CardHeader className="pb-2 shrink-0">
                <CardTitle className="text-sm">{selectedMeteorData ? 'Edit Meteor' : 'Select a Meteor'}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
                {selectedMeteorData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                        <div className="space-y-3 flex flex-col min-h-0">
                            <div className="flex items-center justify-between shrink-0">
                                <Label>Search Icons</Label>
                                <a
                                    href="https://icon-sets.iconify.design/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Browse Iconify →
                                </a>
                            </div>
                            <Input
                                placeholder="Search 200,000+ icons..."
                                value={iconSearch}
                                onChange={(e) => setIconSearch(e.target.value)}
                                className="shrink-0"
                            />
                            <ScrollArea className="flex-1 min-h-0 border rounded-md p-2">
                                {isLoadingIcons ? (
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                        Searching icons...
                                    </div>
                                ) : icons.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                        No icons found
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 m-1">
                                        {icons.map((icon) => (
                                            <button
                                                key={icon.name}
                                                onClick={async () => {
                                                    updateMeteor(selectedMeteorData.id, {
                                                        iconSlug: icon.name,
                                                        trailColor: icon.color,
                                                        iconUrl: icon.url,
                                                    })

                                                    if (icon.color === '#888888') {
                                                        const accurateColor = await fetchDominantColor(icon.url)
                                                        if (accurateColor !== '#888888') {
                                                            updateMeteor(selectedMeteorData.id, {
                                                                trailColor: accurateColor,
                                                            })
                                                        }
                                                    }
                                                }}
                                                className={cn(
                                                    'flex flex-col items-center gap-1 p-2 rounded-md transition-colors hover:bg-muted',
                                                    selectedMeteorData.iconSlug === icon.name &&
                                                        'bg-primary/10 ring-1 ring-primary'
                                                )}
                                                title={icon.name}
                                            >
                                                <img
                                                    src={icon.url}
                                                    alt={icon.displayName}
                                                    className="size-6"
                                                    loading="lazy"
                                                />
                                                <span className="text-[9px] text-muted-foreground truncate max-w-full">
                                                    {icon.displayName}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                            <div className="space-y-1">
                                <Label className="text-[10px]">Icon Name (prefix:name)</Label>
                                <Input
                                    value={selectedMeteorData.iconSlug}
                                    onChange={(e) =>
                                        updateMeteor(selectedMeteorData.id, {
                                            iconSlug: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., logos:react, mdi:github"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label>Icon Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={selectedMeteorData.iconColor}
                                        onChange={(e) =>
                                            updateMeteor(selectedMeteorData.id, {
                                                iconColor: e.target.value,
                                            })
                                        }
                                        className="w-10 h-7 p-0.5 cursor-pointer"
                                    />
                                    <Input
                                        value={selectedMeteorData.iconColor}
                                        onChange={(e) =>
                                            updateMeteor(selectedMeteorData.id, {
                                                iconColor: e.target.value,
                                            })
                                        }
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Trail Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={selectedMeteorData.trailColor}
                                        onChange={(e) =>
                                            updateMeteor(selectedMeteorData.id, {
                                                trailColor: e.target.value,
                                            })
                                        }
                                        className="w-10 h-7 p-0.5 cursor-pointer"
                                    />
                                    <Input
                                        value={selectedMeteorData.trailColor}
                                        onChange={(e) =>
                                            updateMeteor(selectedMeteorData.id, {
                                                trailColor: e.target.value,
                                            })
                                        }
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-1">
                                <Label>Duration: {selectedMeteorData.duration.toFixed(1)}s</Label>
                                <Slider
                                    value={[selectedMeteorData.duration]}
                                    onValueChange={([v]) => updateMeteor(selectedMeteorData.id, { duration: v })}
                                    min={0.5}
                                    max={5}
                                    step={0.1}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Delay: {selectedMeteorData.delay.toFixed(1)}s</Label>
                                <Slider
                                    value={[selectedMeteorData.delay]}
                                    onValueChange={([v]) => updateMeteor(selectedMeteorData.id, { delay: v })}
                                    min={0}
                                    max={5}
                                    step={0.1}
                                />
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Start X</Label>
                                    <Input
                                        type="number"
                                        value={selectedMeteorData.startX}
                                        onChange={(e) =>
                                            updateMeteor(selectedMeteorData.id, {
                                                startX: parseInt(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Angle (degrees)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={180}
                                        value={selectedMeteorData.angle}
                                        onChange={(e) =>
                                            updateMeteor(selectedMeteorData.id, {
                                                angle: parseInt(e.target.value) || 60,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[10px]">Meteor Preview</Label>
                                <MeteorPreview meteor={selectedMeteorData} backgroundColor={backgroundColor} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                        Select a meteor from the list to edit its properties
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
