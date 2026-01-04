import type { BannerConfig } from "./types";

export const DEVICONS_LIST_URL = "https://raw.githubusercontent.com/devicons/devicon/master/devicon.json";

export const defaultConfig: BannerConfig = {
    width: 1441,
    height: 302,
    backgroundColor: "#262c36",
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    avatarSize: 90,
    // Particles
    particleCount: 3,
    particleColor: "#f59e0b",
    // Wave gradient colors (amber/orange)
    waveColorStart: "#f59e0b",
    waveColorMid: "#fbbf24",
    waveColorEnd: "#f59e0b",
    // Glowing circle gradient colors (amber/orange)
    glowColorStart: "#f59e0b",
    glowColorMid: "#f59e0b",
    glowColorEnd: "#f59e0b",

    // Border
    borderEnabled: true,
    borderColor: "#f59e0b",
    borderRadius: 12,
    borderSize: 2,
    meteors: [
        {
            id: "1",
            iconSlug: "react",
            iconColor: "",
            trailColor: "#61DAFB",
            startX: 100,
            angle: 75,
            duration: 10,
            delay: 0,
        },
        {
            id: "2",
            iconSlug: "typescript",
            iconColor: "",
            trailColor: "#3178C6",
            startX: 300,
            angle: 75,
            duration: 10,
            delay: 3,
        },
        {
            id: "3",
            iconSlug: "github",
            iconColor: "",
            trailColor: "#ffffff",
            startX: 500,
            angle: 75,
            duration: 10,
            delay: 6,
        },
    ],
};

