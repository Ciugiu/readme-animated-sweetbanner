import type { BannerConfig } from '@/features/shared'

export function extractConfigFromSvg(svgString: string): BannerConfig | null {
    const match = svgString.match(/<metadata><!\[CDATA\[([\s\S]*?)\]\]><\/metadata>/)
    if (!match) return null
    try {
        const parsed = JSON.parse(match[1].trim())
        if (typeof parsed.width !== 'number' || !Array.isArray(parsed.meteors)) return null
        return parsed as BannerConfig
    } catch {
        return null
    }
}

export async function readConfigFromFile(file: File): Promise<BannerConfig> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            const config = extractConfigFromSvg(text)
            if (!config) reject(new Error('No config found in this SVG — was it created with sweetbanner?'))
            else resolve(config)
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
    })
}
