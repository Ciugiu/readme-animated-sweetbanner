import { useState, useCallback, useEffect } from 'react'
import type { BannerConfig, MeteorConfig } from '@/features/shared'
import { defaultConfig, fetchImageAsBase64, getIconUrl } from '@/features/shared'

export function useBannerConfig() {
    const [config, setConfig] = useState<BannerConfig>(defaultConfig)
    const [selectedMeteor, setSelectedMeteor] = useState<string | null>(config.meteors[0]?.id ?? null)

    useEffect(() => {
        if (config.avatarUrl && !config.avatarBase64) {
            fetchImageAsBase64(config.avatarUrl).then((base64) => {
                if (base64) {
                    setConfig((prev) => ({ ...prev, avatarBase64: base64 }))
                }
            })
        }
    }, [config.avatarUrl, config.avatarBase64])

    useEffect(() => {
        config.meteors.forEach((meteor) => {
            if (!meteor.iconBase64) {
                const iconUrl = meteor.iconUrl || getIconUrl(meteor.iconSlug)
                fetchImageAsBase64(iconUrl).then((base64) => {
                    if (base64) {
                        setConfig((prev) => ({
                            ...prev,
                            meteors: prev.meteors.map((m) => (m.id === meteor.id ? { ...m, iconBase64: base64 } : m)),
                        }))
                    }
                })
            }
        })
    }, [config.meteors])

    const updateConfig = useCallback((updates: Partial<BannerConfig>) => {
        if (updates.avatarUrl) {
            setConfig((prev) => ({ ...prev, ...updates, avatarBase64: undefined }))
        } else {
            setConfig((prev) => ({ ...prev, ...updates }))
        }
    }, [])

    const updateMeteor = useCallback((id: string, updates: Partial<MeteorConfig>) => {
        setConfig((prev) => ({
            ...prev,
            meteors: prev.meteors.map((m) =>
                m.id === id
                    ? {
                          ...m,
                          ...updates,
                          iconBase64:
                              updates.iconSlug !== undefined || updates.iconUrl !== undefined
                                  ? undefined
                                  : m.iconBase64,
                      }
                    : m
            ),
        }))
    }, [])

    const addMeteor = useCallback(() => {
        const iconSize = 48
        const minSpacing = 100
        const meteors = config.meteors
        const width = config.width
        const height = config.height
        const defaultAngle = 75
        const startY = -50
        const travelDistance = height + 150

        const getMeteorPosition = (
            startX: number,
            angle: number,
            duration: number,
            delay: number,
            time: number
        ): { x: number; y: number } | null => {
            const cycleLength = duration + delay
            const cycleTime = time % cycleLength

            if (cycleTime < delay) return null // Not visible yet

            const progress = (cycleTime - delay) / duration
            if (progress > 1) return null

            const angleRad = (angle * Math.PI) / 180
            const x = startX + Math.cos(angleRad) * travelDistance * progress
            const y = startY + Math.sin(angleRad) * travelDistance * progress

            return { x, y }
        }

        const wouldOverlap = (
            candidateX: number,
            candidateAngle: number,
            candidateDuration: number,
            candidateDelay: number
        ): boolean => {
            if (meteors.length === 0) return false

            // Find the LCM period to check (simplified: check longest combined cycle * 2)
            const maxCycle = Math.max(...meteors.map((m) => m.delay + m.duration), candidateDelay + candidateDuration)
            const checkDuration = maxCycle * 2
            const timeStep = 0.1 // Check every 0.1 seconds for precision

            for (let t = 0; t < checkDuration; t += timeStep) {
                const candidatePos = getMeteorPosition(candidateX, candidateAngle, candidateDuration, candidateDelay, t)

                if (!candidatePos) continue

                // Skip if outside visible area
                if (candidatePos.y < -iconSize || candidatePos.y > height + iconSize) continue

                for (const meteor of meteors) {
                    const meteorPos = getMeteorPosition(meteor.startX, meteor.angle, meteor.duration, meteor.delay, t)

                    if (!meteorPos) continue
                    if (meteorPos.y < -iconSize || meteorPos.y > height + iconSize) continue

                    // Calculate distance between centers
                    const dx = candidatePos.x - meteorPos.x
                    const dy = candidatePos.y - meteorPos.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < minSpacing) {
                        return true
                    }
                }
            }
            return false
        }

        // Try to find a non-overlapping position
        const fixedDuration = 10 // All meteors have the same speed
        const delayStep = 3 // Stagger by 3 seconds
        const maxDelay = meteors.length > 0 ? Math.max(...meteors.map((m) => m.delay)) + delayStep : 0

        let bestX = 0
        let bestDelay = maxDelay
        let found = false

        // Generate random X position with some spread from existing meteors
        const existingXPositions = meteors.map((m) => m.startX)
        const generateRandomX = (): number => {
            const margin = 100
            // Try to find a position that's not too close to existing meteors
            for (let attempt = 0; attempt < 20; attempt++) {
                const x = margin + Math.random() * (width - 2 * margin)
                const tooClose = existingXPositions.some((ex) => Math.abs(ex - x) < minSpacing * 0.8)
                if (!tooClose || attempt === 19) {
                    return x
                }
            }
            return margin + Math.random() * (width - 2 * margin)
        }

        // Generate a random delay that's different from existing meteors
        const existingDelays = meteors.map((m) => m.delay)
        const generateRandomDelay = (): number => {
            const maxPeriod = fixedDuration // Full animation cycle
            for (let attempt = 0; attempt < 20; attempt++) {
                const delay = Math.random() * maxPeriod
                // Ensure at least 1.5s gap from other meteors' delays
                const tooClose = existingDelays.some(
                    (ed) => Math.abs(ed - delay) < 1.5 || Math.abs(ed - delay - maxPeriod) < 1.5
                )
                if (!tooClose || attempt === 19) {
                    return Math.round(delay * 10) / 10 // Round to 0.1s
                }
            }
            return Math.round(Math.random() * maxPeriod * 10) / 10
        }

        // Try random positions and delays
        for (let attempt = 0; attempt < 50; attempt++) {
            const candidateX = generateRandomX()
            const candidateDelay = generateRandomDelay()
            if (!wouldOverlap(candidateX, defaultAngle, fixedDuration, candidateDelay)) {
                bestX = candidateX
                bestDelay = candidateDelay
                found = true
                break
            }
        }

        // If no position found, place at a random position with staggered delay
        if (!found) {
            bestX = 100 + Math.random() * (width - 200)
            bestDelay = maxDelay
        }

        const newMeteor: MeteorConfig = {
            id: Date.now().toString(),
            iconSlug: 'react',
            iconColor: '',
            trailColor: '#61DAFB',
            startX: Math.max(minSpacing / 2, Math.min(width - minSpacing / 2, bestX)),
            angle: defaultAngle,
            duration: fixedDuration,
            delay: bestDelay,
        }
        setConfig((prev) => ({
            ...prev,
            meteors: [...prev.meteors, newMeteor],
        }))
        setSelectedMeteor(newMeteor.id)
    }, [config.width, config.height, config.meteors])

    const removeMeteor = useCallback((id: string) => {
        setConfig((prev) => ({
            ...prev,
            meteors: prev.meteors.filter((m) => m.id !== id),
        }))
        setSelectedMeteor(null)
    }, [])

    const selectedMeteorData = config.meteors.find((m) => m.id === selectedMeteor)

    return {
        config,
        selectedMeteor,
        selectedMeteorData,
        setSelectedMeteor,
        updateConfig,
        updateMeteor,
        addMeteor,
        removeMeteor,
    }
}
