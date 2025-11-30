/**
 * PKM-Universe Website Configuration
 * Edit these values to customize your website
 */

module.exports = {
    // Site Info
    siteName: 'PKM-Universe',
    siteDescription: 'The ultimate Pokemon trading bot',

    // Discord Settings (get these from Discord Developer Portal)
    discord: {
        clientId: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
        redirectUri: 'http://localhost:3001/auth/callback',
        inviteLink: 'https://discord.gg/pkm-universe'
    },

    // Server Settings
    server: {
        port: 3001,
        host: 'localhost'
    },

    // Supported Games
    games: [
        { id: 'sv', name: 'Scarlet/Violet', enabled: true },
        { id: 'swsh', name: 'Sword/Shield', enabled: true },
        { id: 'bdsp', name: 'Brilliant Diamond/Shining Pearl', enabled: true },
        { id: 'pla', name: 'Legends Arceus', enabled: true },
        { id: 'lgpe', name: "Let's Go Pikachu/Eevee", enabled: false }
    ],

    // Theme Colors (CSS variables)
    theme: {
        neonCyan: '#00d4ff',
        neonPink: '#ff66aa',
        neonGreen: '#00ff88',
        neonYellow: '#ffdd00',
        neonPurple: '#aa88ff',
        bgPrimary: '#0a0a1a',
        bgSecondary: '#111128'
    },

    // Featured Pokemon for showcase rotation
    featuredPokemon: [155, 157, 6, 9, 25, 149, 248, 445, 448, 94],

    // Social Links
    social: {
        discord: 'https://discord.gg/pkm-universe',
        twitter: '',
        github: ''
    }
};
