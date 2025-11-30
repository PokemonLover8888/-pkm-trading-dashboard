/**
 * PKM-Universe Leaderboards System
 * Top traders, achievements, and rankings
 */

class Leaderboards {
    constructor() {
        this.data = {
            daily: [],
            weekly: [],
            monthly: [],
            allTime: [],
            shinyHunters: [],
            achievements: []
        };
        this.currentTab = 'daily';
        this.init();
    }

    init() {
        this.createLeaderboardSection();
        this.loadLeaderboardData();
        this.setupEventListeners();
    }

    createLeaderboardSection() {
        const section = document.createElement('section');
        section.id = 'leaderboards';
        section.className = 'leaderboards-section';
        section.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <span class="section-badge trophy-badge"><i class="fas fa-trophy"></i> Rankings</span>
                    <h2 class="section-title">Top Traders</h2>
                    <p class="section-subtitle">Compete for the top spots!</p>
                </div>

                <div class="leaderboard-tabs">
                    <button class="lb-tab active" data-period="daily">
                        <i class="fas fa-sun"></i> Today
                    </button>
                    <button class="lb-tab" data-period="weekly">
                        <i class="fas fa-calendar-week"></i> This Week
                    </button>
                    <button class="lb-tab" data-period="monthly">
                        <i class="fas fa-calendar-alt"></i> This Month
                    </button>
                    <button class="lb-tab" data-period="allTime">
                        <i class="fas fa-crown"></i> All Time
                    </button>
                    <button class="lb-tab" data-period="shinyHunters">
                        <i class="fas fa-star"></i> Shiny Hunters
                    </button>
                </div>

                <div class="leaderboard-container">
                    <div class="leaderboard-podium" id="podium">
                        <!-- Top 3 will be populated here -->
                    </div>
                    <div class="leaderboard-list" id="leaderboardList">
                        <!-- Rest of rankings -->
                    </div>
                </div>

                <div class="achievements-showcase">
                    <h3><i class="fas fa-medal"></i> Achievement Badges</h3>
                    <div class="achievement-grid" id="achievementGrid">
                        <!-- Achievements will be populated here -->
                    </div>
                </div>
            </div>
        `;

        // Insert after dashboard section
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.after(section);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.lb-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = tab.dataset.period;
                this.renderLeaderboard();
            });
        });
    }

    async loadLeaderboardData() {
        try {
            const response = await fetch('/api/leaderboards');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.data = data.data;
                }
            }
        } catch (error) {
            console.log('Using sample leaderboard data');
        }

        // Use sample data if API fails
        if (this.data.daily.length === 0) {
            this.data = this.getSampleData();
        }

        this.renderLeaderboard();
        this.renderAchievements();
    }

    getSampleData() {
        const sampleUsers = [
            { username: 'dizzylove', trades: 156, shinies: 42, avatar: null },
            { username: 'codereset', trades: 134, shinies: 38, avatar: null },
            { username: 'tds04', trades: 121, shinies: 35, avatar: null },
            { username: 'ogalbina', trades: 98, shinies: 28, avatar: null },
            { username: 'secludedly', trades: 87, shinies: 24, avatar: null },
            { username: 'PokeMaster99', trades: 76, shinies: 21, avatar: null },
            { username: 'ShinyCollector', trades: 65, shinies: 45, avatar: null },
            { username: 'TradeKing', trades: 54, shinies: 15, avatar: null },
            { username: 'PKMNFan2024', trades: 43, shinies: 12, avatar: null },
            { username: 'LegendHunter', trades: 32, shinies: 18, avatar: null }
        ];

        return {
            daily: sampleUsers.slice(0, 10).map((u, i) => ({ ...u, rank: i + 1, trades: Math.floor(u.trades * 0.1) })),
            weekly: sampleUsers.slice(0, 10).map((u, i) => ({ ...u, rank: i + 1, trades: Math.floor(u.trades * 0.5) })),
            monthly: sampleUsers.slice(0, 10).map((u, i) => ({ ...u, rank: i + 1 })),
            allTime: sampleUsers.slice(0, 10).map((u, i) => ({ ...u, rank: i + 1, trades: u.trades * 10 })),
            shinyHunters: [...sampleUsers].sort((a, b) => b.shinies - a.shinies).slice(0, 10).map((u, i) => ({ ...u, rank: i + 1 })),
            achievements: this.getAchievements()
        };
    }

    getAchievements() {
        return [
            { id: 'first_trade', name: 'First Trade', icon: 'fa-handshake', description: 'Complete your first trade', rarity: 'common' },
            { id: 'shiny_starter', name: 'Shiny Starter', icon: 'fa-star', description: 'Trade your first shiny', rarity: 'uncommon' },
            { id: 'trade_10', name: 'Trader', icon: 'fa-exchange-alt', description: 'Complete 10 trades', rarity: 'common' },
            { id: 'trade_100', name: 'Trade Master', icon: 'fa-award', description: 'Complete 100 trades', rarity: 'rare' },
            { id: 'trade_1000', name: 'Trade Legend', icon: 'fa-crown', description: 'Complete 1000 trades', rarity: 'legendary' },
            { id: 'shiny_10', name: 'Shiny Collector', icon: 'fa-gem', description: 'Trade 10 shinies', rarity: 'uncommon' },
            { id: 'shiny_100', name: 'Shiny Master', icon: 'fa-diamond', description: 'Trade 100 shinies', rarity: 'epic' },
            { id: 'all_gens', name: 'Gen Master', icon: 'fa-layer-group', description: 'Trade Pokemon from all generations', rarity: 'rare' },
            { id: 'living_dex', name: 'Living Dex', icon: 'fa-book', description: 'Complete the Living Dex', rarity: 'legendary' },
            { id: 'speed_demon', name: 'Speed Demon', icon: 'fa-bolt', description: 'Complete 10 trades in one hour', rarity: 'uncommon' },
            { id: 'night_owl', name: 'Night Owl', icon: 'fa-moon', description: 'Trade after midnight', rarity: 'common' },
            { id: 'helper', name: 'Community Helper', icon: 'fa-heart', description: 'Help 10 new traders', rarity: 'rare' }
        ];
    }

    renderLeaderboard() {
        const data = this.data[this.currentTab] || [];
        const podium = document.getElementById('podium');
        const list = document.getElementById('leaderboardList');

        if (!podium || !list) return;

        // Render podium (top 3)
        const top3 = data.slice(0, 3);
        podium.innerHTML = top3.length > 0 ? `
            ${top3[1] ? this.renderPodiumPlace(top3[1], 2) : ''}
            ${top3[0] ? this.renderPodiumPlace(top3[0], 1) : ''}
            ${top3[2] ? this.renderPodiumPlace(top3[2], 3) : ''}
        ` : '<div class="no-data">No rankings yet - be the first!</div>';

        // Render rest of list
        const rest = data.slice(3);
        list.innerHTML = rest.map(user => this.renderListItem(user)).join('');
    }

    renderPodiumPlace(user, place) {
        const placeClass = place === 1 ? 'first' : place === 2 ? 'second' : 'third';
        const placeIcon = place === 1 ? 'fa-crown' : place === 2 ? 'fa-medal' : 'fa-award';
        const statLabel = this.currentTab === 'shinyHunters' ? 'Shinies' : 'Trades';
        const statValue = this.currentTab === 'shinyHunters' ? user.shinies : user.trades;

        return `
            <div class="podium-place ${placeClass}">
                <div class="podium-avatar">
                    <img src="${user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`}" alt="${user.username}">
                    <span class="podium-rank"><i class="fas ${placeIcon}"></i></span>
                </div>
                <div class="podium-info">
                    <span class="podium-name">${user.username}</span>
                    <span class="podium-stat">${statValue.toLocaleString()} ${statLabel}</span>
                </div>
                <div class="podium-stand"></div>
            </div>
        `;
    }

    renderListItem(user) {
        const statLabel = this.currentTab === 'shinyHunters' ? 'shinies' : 'trades';
        const statValue = this.currentTab === 'shinyHunters' ? user.shinies : user.trades;

        return `
            <div class="leaderboard-item">
                <span class="lb-rank">#${user.rank}</span>
                <div class="lb-avatar">
                    <img src="${user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`}" alt="${user.username}">
                </div>
                <span class="lb-name">${user.username}</span>
                <span class="lb-stat">${statValue.toLocaleString()} ${statLabel}</span>
            </div>
        `;
    }

    renderAchievements() {
        const grid = document.getElementById('achievementGrid');
        if (!grid) return;

        grid.innerHTML = this.data.achievements.map(achievement => `
            <div class="achievement-card ${achievement.rarity}">
                <div class="achievement-icon">
                    <i class="fas ${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <span class="achievement-name">${achievement.name}</span>
                    <span class="achievement-desc">${achievement.description}</span>
                </div>
                <span class="achievement-rarity">${achievement.rarity}</span>
            </div>
        `).join('');
    }
}

// Leaderboard styles
const leaderboardStyles = document.createElement('style');
leaderboardStyles.textContent = `
    .leaderboards-section {
        padding: 80px 0;
        background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
    }

    .trophy-badge {
        background: linear-gradient(135deg, #ffd700, #ff8c00) !important;
        color: #000 !important;
    }

    .leaderboard-tabs {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 40px;
    }

    .lb-tab {
        padding: 12px 24px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 30px;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1rem;
    }

    .lb-tab:hover {
        background: rgba(0, 212, 255, 0.2);
        border-color: var(--neon-cyan);
    }

    .lb-tab.active {
        background: var(--neon-cyan);
        color: #000;
        font-weight: bold;
    }

    .leaderboard-container {
        max-width: 800px;
        margin: 0 auto;
    }

    .leaderboard-podium {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        gap: 20px;
        margin-bottom: 40px;
        min-height: 300px;
    }

    .podium-place {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .podium-place.first {
        order: 2;
    }
    .podium-place.second {
        order: 1;
    }
    .podium-place.third {
        order: 3;
    }

    .podium-avatar {
        position: relative;
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
    }

    .podium-place.first .podium-avatar {
        width: 100px;
        height: 100px;
    }

    .podium-avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 3px solid;
        object-fit: cover;
    }

    .podium-place.first .podium-avatar img {
        border-color: #ffd700;
        box-shadow: 0 0 20px #ffd700;
    }
    .podium-place.second .podium-avatar img {
        border-color: #c0c0c0;
        box-shadow: 0 0 15px #c0c0c0;
    }
    .podium-place.third .podium-avatar img {
        border-color: #cd7f32;
        box-shadow: 0 0 15px #cd7f32;
    }

    .podium-rank {
        position: absolute;
        bottom: -5px;
        right: -5px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
    }

    .podium-place.first .podium-rank {
        background: #ffd700;
        color: #000;
    }
    .podium-place.second .podium-rank {
        background: #c0c0c0;
        color: #000;
    }
    .podium-place.third .podium-rank {
        background: #cd7f32;
        color: #fff;
    }

    .podium-name {
        font-family: 'Orbitron', sans-serif;
        font-size: 1.1rem;
        color: #fff;
        margin-bottom: 5px;
    }

    .podium-stat {
        font-size: 0.9rem;
        color: var(--neon-cyan);
    }

    .podium-stand {
        width: 100px;
        margin-top: 15px;
        border-radius: 5px 5px 0 0;
    }

    .podium-place.first .podium-stand {
        height: 100px;
        background: linear-gradient(180deg, #ffd700 0%, #b8860b 100%);
    }
    .podium-place.second .podium-stand {
        height: 70px;
        background: linear-gradient(180deg, #c0c0c0 0%, #808080 100%);
    }
    .podium-place.third .podium-stand {
        height: 50px;
        background: linear-gradient(180deg, #cd7f32 0%, #8b4513 100%);
    }

    .leaderboard-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .leaderboard-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }

    .leaderboard-item:hover {
        background: rgba(0, 212, 255, 0.1);
        border-color: var(--neon-cyan);
        transform: translateX(5px);
    }

    .lb-rank {
        font-family: 'Orbitron', sans-serif;
        font-size: 1.2rem;
        color: #888;
        width: 50px;
    }

    .lb-avatar {
        width: 40px;
        height: 40px;
    }

    .lb-avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    .lb-name {
        flex: 1;
        font-weight: 600;
        color: #fff;
    }

    .lb-stat {
        color: var(--neon-cyan);
        font-family: 'Orbitron', sans-serif;
    }

    .achievements-showcase {
        margin-top: 60px;
        text-align: center;
    }

    .achievements-showcase h3 {
        font-family: 'Orbitron', sans-serif;
        font-size: 1.5rem;
        color: #fff;
        margin-bottom: 30px;
    }

    .achievement-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 15px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .achievement-card {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: left;
        transition: all 0.3s ease;
    }

    .achievement-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .achievement-card.common { border-left: 3px solid #808080; }
    .achievement-card.uncommon { border-left: 3px solid #00ff88; }
    .achievement-card.rare { border-left: 3px solid #00d4ff; }
    .achievement-card.epic { border-left: 3px solid #aa88ff; }
    .achievement-card.legendary { border-left: 3px solid #ffd700; }

    .achievement-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }

    .achievement-card.common .achievement-icon { background: rgba(128, 128, 128, 0.3); color: #808080; }
    .achievement-card.uncommon .achievement-icon { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
    .achievement-card.rare .achievement-icon { background: rgba(0, 212, 255, 0.2); color: #00d4ff; }
    .achievement-card.epic .achievement-icon { background: rgba(170, 136, 255, 0.2); color: #aa88ff; }
    .achievement-card.legendary .achievement-icon { background: rgba(255, 215, 0, 0.2); color: #ffd700; }

    .achievement-info {
        flex: 1;
    }

    .achievement-name {
        display: block;
        font-weight: 600;
        color: #fff;
        margin-bottom: 3px;
    }

    .achievement-desc {
        font-size: 0.85rem;
        color: #888;
    }

    .achievement-rarity {
        font-size: 0.75rem;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 20px;
        font-weight: bold;
    }

    .achievement-card.common .achievement-rarity { background: #808080; color: #fff; }
    .achievement-card.uncommon .achievement-rarity { background: #00ff88; color: #000; }
    .achievement-card.rare .achievement-rarity { background: #00d4ff; color: #000; }
    .achievement-card.epic .achievement-rarity { background: #aa88ff; color: #000; }
    .achievement-card.legendary .achievement-rarity { background: #ffd700; color: #000; }

    .no-data {
        text-align: center;
        color: #888;
        padding: 40px;
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        .leaderboard-podium {
            flex-direction: column;
            align-items: center;
        }

        .podium-place {
            order: unset !important;
        }

        .podium-stand {
            display: none;
        }
    }
`;
document.head.appendChild(leaderboardStyles);

// Initialize
window.leaderboards = new Leaderboards();
