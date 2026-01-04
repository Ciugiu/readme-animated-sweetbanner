export interface DevIcon {
    name: string;
    altnames: string[];
    tags: string[];
    versions: {
        svg: string[];
        font: string[];
    };
    color: string;
}

export interface MeteorConfig {
    id: string;
    iconSlug: string;
    iconColor: string;
    trailColor: string;
    startX: number;
    angle: number; // Angle in degrees (0 = right, 90 = down)
    duration: number;
    delay: number;
    iconBase64?: string;
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

