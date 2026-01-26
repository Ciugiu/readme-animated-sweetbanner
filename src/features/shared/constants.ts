import type { BannerConfig } from './types'

export const ICONIFY_API_BASE = 'https://api.iconify.design'
export const ICONIFY_SEARCH_LIMIT = 64

// Popular icon prefixes for default display
export const POPULAR_ICON_SETS = [
    'mdi', // Material Design Icons
    'devicon', // DevIcons (programming)
    'logos', // Programming/Tech Logos
    'skill-icons', // Skill Icons
    'vscode-icons', // VS Code Icons
    'simple-icons', // Simple Icons (brand icons)
]

// Default search terms to show popular dev icons
export const DEFAULT_SEARCH_TERMS = ['react', 'typescript', 'javascript', 'github', 'nodejs']

export const defaultConfig: BannerConfig = {
    width: 1441,
    height: 302,
    backgroundColor: '#262c36',
    avatarUrl: 'https://avatars.githubusercontent.com/u/69421356?v=4',
    avatarSize: 90,
    // Particles
    particleCount: 3,
    particleColor: '#f59e0b',
    // Wave gradient colors (amber/orange)
    waveColorStart: '#f59e0b',
    waveColorMid: '#fbbf24',
    waveColorEnd: '#f59e0b',
    // Glowing circle gradient colors (amber/orange)
    glowColorStart: '#f59e0b',
    glowColorMid: '#f59e0b',
    glowColorEnd: '#f59e0b',
    // Border
    borderEnabled: false,
    borderColor: '#f59e0b',
    borderRadius: 2,
    borderSize: 2,
    meteors: [
        {
            id: '1',
            iconSlug: 'logos:react',
            iconColor: '',
            trailColor: '#61DAFB',
            startX: 100,
            angle: 75,
            duration: 10,
            delay: 0,
        },
        {
            id: '2',
            iconSlug: 'logos:typescript-icon',
            iconColor: '',
            trailColor: '#3178C6',
            startX: 300,
            angle: 75,
            duration: 10,
            delay: 3,
        },
        {
            id: '3',
            iconSlug: 'mdi:github',
            iconColor: '',
            trailColor: '#ffffff',
            startX: 500,
            angle: 75,
            duration: 10,
            delay: 6,
        },
    ],
}
