import type { BannerConfig } from '@/features/shared'
import { getIconUrl } from '@/features/shared'

export function generateSvgCode(config: BannerConfig): string {
    const {
        width,
        height,
        backgroundColor,
        avatarUrl,
        avatarBase64,
        avatarSize,
        meteors,
        particleCount,
        particleColor,
        waveColorStart,
        waveColorMid,
        waveColorEnd,
        glowColorStart,
        glowColorMid,
        glowColorEnd,
        borderEnabled,
        borderColor,
        borderRadius,
        borderSize,
    } = config
    const centerX = width / 2
    const centerY = height / 2
    const avatarRadius = avatarSize / 2

    const meteorsSvg = meteors
        .map((meteor) => {
            const iconSrc = meteor.iconBase64 || meteor.iconUrl || getIconUrl(meteor.iconSlug)
            const startY = -50
            const angleRad = (meteor.angle * Math.PI) / 180
            const travelDistance = height + 150
            const deltaX = Math.cos(angleRad) * travelDistance
            const deltaY = Math.sin(angleRad) * travelDistance
            const trailLength = 50
            const dirX = Math.cos(angleRad) * trailLength
            const dirY = Math.sin(angleRad) * trailLength
            const lineX1 = meteor.startX
            const lineY1 = startY
            const lineX2 = meteor.startX + dirX
            const lineY2 = startY + dirY
            const iconX = lineX2 - 16
            const iconY = lineY2 - 16
            const filterAttr = meteor.iconColor ? `filter="url(#iconColor-${meteor.id})"` : ''

            return `
            <!-- ${meteor.iconSlug} Meteor -->
            <g filter="url(#meteorGlow)" visibility="hidden">
                <line x1="${lineX1}" y1="${lineY1}" x2="${lineX2}" y2="${lineY2}" stroke="url(#trail-${meteor.id})" stroke-width="2" stroke-linecap="round">
                    <animate attributeName="x1" values="${lineX1};${lineX1 + deltaX}" dur="${meteor.duration}s" repeatCount="indefinite" begin="${meteor.delay}s"/>
                    <animate attributeName="y1" values="${lineY1};${lineY1 + deltaY}" dur="${meteor.duration}s" repeatCount="indefinite" begin="${meteor.delay}s"/>
                    <animate attributeName="x2" values="${lineX2};${lineX2 + deltaX}" dur="${meteor.duration}s" repeatCount="indefinite" begin="${meteor.delay}s"/>
                    <animate attributeName="y2" values="${lineY2};${lineY2 + deltaY}" dur="${meteor.duration}s" repeatCount="indefinite" begin="${meteor.delay}s"/>
                </line>
                <image href="${iconSrc}" width="32" height="32" x="${iconX}" y="${iconY}" ${filterAttr}>
                    <animate attributeName="x" values="${iconX};${iconX + deltaX}" dur="${meteor.duration}s" repeatCount="indefinite" begin="${meteor.delay}s"/>
                    <animate attributeName="y" values="${iconY};${iconY + deltaY}" dur="${meteor.duration}s" repeatCount="indefinite" begin="${meteor.delay}s"/>
                </image>
                <set attributeName="visibility" to="visible" begin="${meteor.delay}s"/>
            </g>`
        })
        .join('\n')

    const meteorTrailDefs = meteors
        .map((meteor) => {
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

            const colorFilter = rgb
                ? `
        <filter id="iconColor-${meteor.id}" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 ${rgb.r.toFixed(3)} 0 0 0 0 ${rgb.g.toFixed(3)} 0 0 0 0 ${rgb.b.toFixed(3)} 0 0 0 1 0"/>
        </filter>`
                : ''

            return `
        <linearGradient id="trail-${meteor.id}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${meteor.trailColor}" stop-opacity="0"/>
            <stop offset="100%" stop-color="${meteor.trailColor}" stop-opacity="1"/>
        </linearGradient>${colorFilter}`
        })
        .join('\n')

    const waveQ1 = Math.round(width * 0.125)
    const waveT1 = Math.round(width * 0.25)
    const waveT2 = Math.round(width * 0.5)
    const waveT3 = Math.round(width * 0.75)

    const waveCenter = Math.round(height * 0.5)
    const waveAmplitude = Math.round(height * 0.1)

    // Generate particles dynamically based on count
    const particles = Array.from({ length: particleCount }, (_, i) => {
        // Seed random positions across the width
        const xRatio = (i + 0.5) / particleCount + Math.sin(i * 2.5) * 0.2
        const goingUp = i % 2 === 0
        return {
            x: Math.round(width * Math.max(0.1, Math.min(0.9, xRatio))),
            y: goingUp ? Math.round(height * 0.8) : Math.round(height * 0.25),
            yEnd: goingUp ? Math.round(height * 0.2) : Math.round(height * 0.9),
            dur: 5 + (i % 3),
        }
    })

    const particlesSvg = particles
        .map(
            (p) => `
        <circle cx="${p.x}" cy="${p.y}" r="2">
            <animate attributeName="cy" values="${p.y};${p.yEnd}" dur="${p.dur}s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;1;0" dur="${p.dur}s" repeatCount="indefinite"/>
        </circle>`
        )
        .join('')

    return `<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${width} ${height}"
     width="${width}"
     height="${height}"
     style="background:${backgroundColor}">

    <defs>
        <!-- Glow -->
        <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>

        <!-- Stronger glow for meteors -->
        <filter id="meteorGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>

        <!-- Gradient for waves -->
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${waveColorStart}"/>
            <stop offset="50%" stop-color="${waveColorMid}"/>
            <stop offset="100%" stop-color="${waveColorEnd}"/>
        </linearGradient>

        <!-- Gradient for glowing circle -->
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${glowColorStart}"/>
            <stop offset="50%" stop-color="${glowColorMid}"/>
            <stop offset="100%" stop-color="${glowColorEnd}"/>
        </linearGradient>

        <!-- Meteor trail gradients -->
        ${meteorTrailDefs}

        <!-- Circle clip for avatar -->
        <clipPath id="avatarClip">
            <circle cx="${centerX}" cy="${centerY}" r="${avatarRadius}"/>
        </clipPath>
    </defs>

    <!-- Background waves -->
    <path d="M0 ${waveCenter} Q${waveQ1} ${waveCenter - waveAmplitude} ${waveT1} ${waveCenter} T${waveT2} ${waveCenter} T${waveT3} ${waveCenter} T${width} ${waveCenter}"
          fill="none"
          stroke="url(#waveGrad)"
          stroke-width="2"
          opacity="0.5">
        <animate attributeName="d"
                 dur="6s"
                 repeatCount="indefinite"
                 values="
             M0 ${waveCenter} Q${waveQ1} ${waveCenter - waveAmplitude} ${waveT1} ${waveCenter} T${waveT2} ${waveCenter} T${waveT3} ${waveCenter} T${width} ${waveCenter};
             M0 ${waveCenter} Q${waveQ1} ${waveCenter + waveAmplitude} ${waveT1} ${waveCenter} T${waveT2} ${waveCenter} T${waveT3} ${waveCenter} T${width} ${waveCenter};
             M0 ${waveCenter} Q${waveQ1} ${waveCenter - waveAmplitude} ${waveT1} ${waveCenter} T${waveT2} ${waveCenter} T${waveT3} ${waveCenter} T${width} ${waveCenter}"/>
    </path>

    <!-- ========== METEOR LOGOS ========== -->
    ${meteorsSvg}

    <image
            href="${avatarBase64 || avatarUrl}"
            x="${centerX - avatarRadius}" y="${centerY - avatarRadius}"
            width="${avatarSize}" height="${avatarSize}"
            clip-path="url(#avatarClip)"
            preserveAspectRatio="xMidYMid slice" />

    <circle cx="${centerX}" cy="${centerY}" r="${avatarRadius}"
            fill="none"
            stroke="url(#glowGrad)"
            stroke-width="3"
            filter="url(#glow)">
        <animate attributeName="r"
                 values="${avatarRadius - 5};${avatarRadius + 5};${avatarRadius - 5}"
                 dur="2.5s"
                 repeatCount="indefinite"/>
        <animate attributeName="opacity"
                 values="0.6;1;0.6"
                 dur="2.5s"
                 repeatCount="indefinite"/>
    </circle>

    <g transform="translate(${centerX} ${centerY})">
        <circle cx="0" cy="0" r="${avatarRadius + 15}"
                fill="none"
                stroke="url(#glowGrad)"
                stroke-width="2"
                stroke-dasharray="6 4"
                filter="url(#glow)">
            <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="10s"
                    repeatCount="indefinite"/>
        </circle>
    </g>

    <!-- Floating particles -->
    <g fill="${particleColor}" opacity="0.8">
        ${particlesSvg}
    </g>

    ${
        borderEnabled
            ? `<!-- Border -->
    <rect x="${borderSize / 2}" y="${borderSize / 2}" 
          width="${width - borderSize}" height="${height - borderSize}" 
          rx="${borderRadius}" ry="${borderRadius}"
          fill="none" 
          stroke="${borderColor}" 
          stroke-width="${borderSize}"/>`
            : ''
    }
</svg>`
}
