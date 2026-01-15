// Iconify API Response Types
export interface IconifyInfo {
    name: string;
    total: number;
    version?: string;
    author: {
        name: string;
        url?: string;
    };
    license: {
        title: string;
        spdx: string;
        url?: string;
    };
    samples: string[];
    height?: number | number[];
    displayHeight?: number;
    category?: string;
    palette?: boolean;
}

export interface IconifySearchResponse {
    icons: string[];
    total: number;
    limit: number;
    start: number;
    collections: Record<string, IconifyInfo>;
    request: Record<string, string>;
}

// Unified Icon Type
export interface UnifiedIcon {
    name: string;        // Full icon name (prefix:icon-name)
    displayName: string; // Short display name
    prefix: string;      // Icon set prefix
    color: string;
    url: string;
}

export interface MeteorConfig {
    id: string;
    iconSlug: string;    // Full Iconify icon name (prefix:icon-name)
    iconColor: string;
    trailColor: string;
    startX: number;
    angle: number;
    duration: number;
    delay: number;
    iconBase64?: string;
    iconUrl?: string;
}

export interface BannerConfig {
    width: number;
    height: number;
    backgroundColor: string;
    avatarUrl: string;
    avatarBase64?: string;
    avatarSize: number;
    meteors: MeteorConfig[];
    // Particles
    particleCount: number;
    particleColor: string;
    // Wave gradient colors
    waveColorStart: string;
    waveColorMid: string;
    waveColorEnd: string;
    // Glowing circle
    glowColorStart: string;
    glowColorMid: string;
    glowColorEnd: string;
    // Border
    borderEnabled: boolean;
    borderColor: string;
    borderRadius: number;
    borderSize: number;
}
