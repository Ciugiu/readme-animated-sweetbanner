import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { UploadIcon, Loader2Icon } from 'lucide-react'
import type { BannerConfig } from '@/features/shared'
import { readConfigFromFile } from '../utils/importConfig'

interface ImportBannerProps {
    onImport: (config: BannerConfig) => void
    onClose: () => void
}

export function ImportBanner({ onImport, onClose }: ImportBannerProps) {
    const fileRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setError(null)
        setLoading(true)
        try {
            const config = await readConfigFromFile(file)
            onImport(config)
            onClose()
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
            e.target.value = ''
        }
    }

    return (
        <div className="border rounded-lg p-3 space-y-2 bg-card mt-2">
            <Label className="text-xs text-muted-foreground">Import from SVG file</Label>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={loading}>
                {loading ? <Loader2Icon className="size-3.5 animate-spin" /> : <UploadIcon className="size-3.5" />}
                Choose .svg file
            </Button>
            <input ref={fileRef} type="file" accept=".svg,image/svg+xml" className="hidden" onChange={handleFile} />
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}
