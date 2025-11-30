/**
 * PKM-Universe Live Trading System
 * Enables users to submit trades directly from the website
 */

class LiveTradingSystem {
    constructor() {
        this.bots = {};
        this.selectedBot = null;
        this.userTradeCode = null;
        this.pollingInterval = null;
        this.discordInvite = 'https://discord.gg/pkm-universe';

        // Bot channel mappings by game type
        this.gameChannels = {
            'za': { name: 'Legends Z-A', channels: ['za-trading', 'za-trades'] },
            'sv': { name: 'Scarlet/Violet', channels: ['sv-trading', 'sv-trades'] },
            'swsh': { name: 'Sword/Shield', channels: ['swsh-trading', 'swsh-trades'] },
            'bdsp': { name: 'BD/SP', channels: ['bdsp-trading', 'bdsp-trades'] },
            'pla': { name: 'Legends Arceus', channels: ['pla-trading', 'pla-trades'] },
            'lgpe': { name: 'Let\'s Go', channels: ['lgpe-trading', 'lgpe-trades'] }
        };

        this.init();
    }

    async init() {
        this.injectStyles();
        await this.fetchBotStatus();
        this.createLiveTradingSection();
        this.bindEvents();

        // Poll for updates every 10 seconds
        this.pollingInterval = setInterval(() => this.fetchBotStatus(), 10000);
    }

    async fetchBotStatus() {
        try {
            // Try local API first, then fallback to JSON file
            let response = await fetch('/api/bot-status').catch(() => null);

            if (!response || !response.ok) {
                // Fallback to static JSON
                response = await fetch('/data/trade_bot_status.json');
            }

            if (response && response.ok) {
                const data = await response.json();
                this.bots = data.bots || {};
                this.updateBotDisplay();
            }
        } catch (error) {
            console.log('Bot status fetch failed, using cached data');
        }
    }

    injectStyles() {
        if (document.getElementById('live-trading-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'live-trading-styles';
        styles.textContent = `
            .live-trading-section {
                background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%);
                border-radius: 24px;
                padding: 40px;
                margin: 30px 0;
                border: 2px solid rgba(0, 212, 255, 0.3);
                box-shadow: 0 20px 60px rgba(0, 212, 255, 0.15);
            }

            .lt-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .lt-badge {
                display: inline-block;
                padding: 6px 16px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                border-radius: 20px;
                color: #000;
                font-weight: bold;
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 15px;
            }

            .lt-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 2rem;
                color: #fff;
                margin: 0 0 10px;
            }

            .lt-subtitle {
                color: #888;
                font-size: 1.1rem;
            }

            /* Bot Status Grid */
            .lt-bots-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .lt-bot-card {
                background: rgba(0, 0, 0, 0.4);
                border-radius: 16px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .lt-bot-card:hover {
                border-color: rgba(0, 212, 255, 0.5);
                transform: translateY(-3px);
            }

            .lt-bot-card.selected {
                border-color: #00d4ff;
                background: rgba(0, 212, 255, 0.1);
            }

            .lt-bot-card.offline {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .lt-bot-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 15px;
            }

            .lt-bot-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }

            .lt-bot-info {
                flex: 1;
            }

            .lt-bot-name {
                font-weight: bold;
                color: #fff;
                font-size: 1.1rem;
            }

            .lt-bot-game {
                color: #888;
                font-size: 0.85rem;
            }

            .lt-bot-status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.85rem;
            }

            .lt-status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #3ba55d;
                animation: pulse 2s ease-in-out infinite;
            }

            .lt-status-dot.offline {
                background: #888;
                animation: none;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .lt-bot-stats {
                display: flex;
                gap: 20px;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .lt-bot-stat {
                text-align: center;
            }

            .lt-bot-stat-value {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.2rem;
                color: #00d4ff;
            }

            .lt-bot-stat-label {
                font-size: 0.7rem;
                color: #666;
                text-transform: uppercase;
            }

            /* Trade Submission Area */
            .lt-trade-area {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
                padding: 30px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .lt-trade-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 25px;
            }

            .lt-trade-icon {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: #000;
            }

            .lt-trade-title {
                font-size: 1.3rem;
                color: #fff;
                margin: 0;
            }

            .lt-trade-desc {
                color: #888;
                font-size: 0.9rem;
            }

            /* Steps */
            .lt-steps {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .lt-step {
                display: flex;
                gap: 15px;
                align-items: flex-start;
            }

            .lt-step-number {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(0, 212, 255, 0.2);
                color: #00d4ff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                flex-shrink: 0;
            }

            .lt-step-content {
                flex: 1;
            }

            .lt-step-title {
                color: #fff;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .lt-step-desc {
                color: #888;
                font-size: 0.9rem;
            }

            /* Command Display */
            .lt-command-box {
                background: #0d0d0d;
                border-radius: 10px;
                padding: 15px;
                margin-top: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .lt-command-text {
                flex: 1;
                font-family: 'Monaco', 'Consolas', monospace;
                font-size: 0.85rem;
                color: #00d4ff;
                word-break: break-all;
            }

            .lt-copy-btn {
                background: rgba(0, 212, 255, 0.2);
                border: 1px solid #00d4ff;
                color: #00d4ff;
                border-radius: 8px;
                padding: 10px 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .lt-copy-btn:hover {
                background: rgba(0, 212, 255, 0.3);
            }

            .lt-copy-btn.copied {
                background: rgba(59, 165, 93, 0.2);
                border-color: #3ba55d;
                color: #3ba55d;
            }

            /* Discord Button */
            .lt-discord-btn {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 15px 30px;
                background: linear-gradient(135deg, #5865f2, #4752c4);
                border: none;
                border-radius: 25px;
                color: #fff;
                font-size: 1rem;
                font-weight: bold;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 15px;
            }

            .lt-discord-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(88, 101, 242, 0.4);
            }

            /* Trade Code Input */
            .lt-trade-code-section {
                margin-top: 25px;
                padding-top: 25px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .lt-trade-code-label {
                color: #fff;
                font-weight: bold;
                margin-bottom: 10px;
                display: block;
            }

            .lt-trade-code-input-row {
                display: flex;
                gap: 10px;
            }

            .lt-trade-code-input {
                flex: 1;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                padding: 12px 15px;
                color: #fff;
                font-family: 'Orbitron', sans-serif;
                font-size: 1.2rem;
                letter-spacing: 3px;
                text-align: center;
            }

            .lt-trade-code-input::placeholder {
                color: #666;
                letter-spacing: 0;
            }

            .lt-generate-code-btn {
                background: rgba(0, 212, 255, 0.2);
                border: 1px solid #00d4ff;
                color: #00d4ff;
                border-radius: 10px;
                padding: 12px 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .lt-generate-code-btn:hover {
                background: #00d4ff;
                color: #000;
            }

            /* Queue Status */
            .lt-queue-status {
                margin-top: 20px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                display: none;
            }

            .lt-queue-status.active {
                display: block;
            }

            .lt-queue-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }

            .lt-queue-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(0, 212, 255, 0.3);
                border-top-color: #00d4ff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .lt-queue-text {
                color: #fff;
                font-weight: bold;
            }

            .lt-queue-position {
                color: #00d4ff;
                font-family: 'Orbitron', sans-serif;
            }

            .lt-queue-eta {
                color: #888;
                font-size: 0.85rem;
            }

            /* Game Filter Tabs */
            .lt-game-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .lt-game-tab {
                padding: 10px 20px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                color: #888;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }

            .lt-game-tab:hover {
                border-color: rgba(0, 212, 255, 0.3);
                color: #fff;
            }

            .lt-game-tab.active {
                background: rgba(0, 212, 255, 0.2);
                border-color: #00d4ff;
                color: #00d4ff;
            }

            /* No Bots Message */
            .lt-no-bots {
                text-align: center;
                padding: 40px;
                color: #888;
            }

            .lt-no-bots i {
                font-size: 3rem;
                color: #444;
                margin-bottom: 15px;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .live-trading-section {
                    padding: 20px;
                    margin: 15px;
                }

                .lt-bots-grid {
                    grid-template-columns: 1fr;
                }

                .lt-trade-area {
                    padding: 20px;
                }

                .lt-game-tabs {
                    overflow-x: auto;
                    flex-wrap: nowrap;
                    padding-bottom: 10px;
                }

                .lt-game-tab {
                    flex-shrink: 0;
                }

                .lt-trade-code-input-row {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    createLiveTradingSection() {
        // Remove old section if exists
        const existing = document.getElementById('live-trading-container');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'live-trading-container';

        container.innerHTML = `
            <section class="live-trading-section">
                <div class="lt-header">
                    <span class="lt-badge"><i class="fas fa-broadcast-tower"></i> Live</span>
                    <h2 class="lt-title">Live Trading</h2>
                    <p class="lt-subtitle">Trade with our bots directly - available 24/7</p>
                </div>

                <!-- Game Filter Tabs -->
                <div class="lt-game-tabs">
                    <button class="lt-game-tab active" data-game="all">All Games</button>
                    <button class="lt-game-tab" data-game="za">Legends Z-A</button>
                    <button class="lt-game-tab" data-game="sv">Scarlet/Violet</button>
                    <button class="lt-game-tab" data-game="swsh">Sword/Shield</button>
                    <button class="lt-game-tab" data-game="bdsp">BD/SP</button>
                    <button class="lt-game-tab" data-game="pla">Legends Arceus</button>
                </div>

                <!-- Bot Status Grid -->
                <div class="lt-bots-grid" id="lt-bots-grid">
                    <div class="lt-no-bots">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading trade bots...</p>
                    </div>
                </div>

                <!-- Trade Submission Area -->
                <div class="lt-trade-area">
                    <div class="lt-trade-header">
                        <div class="lt-trade-icon">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        <div>
                            <h3 class="lt-trade-title">How to Trade</h3>
                            <p class="lt-trade-desc">Follow these simple steps to get your Pokemon</p>
                        </div>
                    </div>

                    <div class="lt-steps">
                        <div class="lt-step">
                            <div class="lt-step-number">1</div>
                            <div class="lt-step-content">
                                <div class="lt-step-title">Create Your Pokemon</div>
                                <div class="lt-step-desc">Use the Pokemon Creator above to customize your Pokemon. Choose species, nature, IVs, EVs, moves, and more.</div>
                            </div>
                        </div>

                        <div class="lt-step">
                            <div class="lt-step-number">2</div>
                            <div class="lt-step-content">
                                <div class="lt-step-title">Copy the Trade Command</div>
                                <div class="lt-step-desc">When you generate your Pokemon, you'll get a command like this:</div>
                                <div class="lt-command-box">
                                    <code class="lt-command-text" id="lt-sample-command">/pkhex create pokemon:Pikachu shiny:True level:100</code>
                                    <button class="lt-copy-btn" id="lt-copy-sample">
                                        <i class="fas fa-copy"></i>
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="lt-step">
                            <div class="lt-step-number">3</div>
                            <div class="lt-step-content">
                                <div class="lt-step-title">Paste in Discord</div>
                                <div class="lt-step-desc">Join our Discord server and paste the command in the appropriate trading channel. The bot will DM you a link trade code.</div>
                                <a href="${this.discordInvite}" target="_blank" class="lt-discord-btn">
                                    <i class="fab fa-discord"></i>
                                    Join PKM-Universe Discord
                                </a>
                            </div>
                        </div>

                        <div class="lt-step">
                            <div class="lt-step-number">4</div>
                            <div class="lt-step-content">
                                <div class="lt-step-title">Enter Your Trade Code</div>
                                <div class="lt-step-desc">Open your game and enter the link trade code the bot gave you. You'll receive your Pokemon automatically!</div>
                            </div>
                        </div>
                    </div>

                    <!-- Queue Status (shown when trade is in progress) -->
                    <div class="lt-queue-status" id="lt-queue-status">
                        <div class="lt-queue-header">
                            <div class="lt-queue-spinner"></div>
                            <span class="lt-queue-text">Your trade is in queue</span>
                        </div>
                        <p class="lt-queue-position">Position: <strong id="lt-queue-pos">-</strong></p>
                        <p class="lt-queue-eta">Estimated wait: <span id="lt-queue-eta">~2 minutes</span></p>
                    </div>
                </div>
            </section>
        `;

        // Insert after the trade section or dashboard
        const tradeSection = document.getElementById('trade');
        const dashboardSection = document.getElementById('dashboard');
        const targetSection = tradeSection || dashboardSection;

        if (targetSection) {
            targetSection.parentNode.insertBefore(container, targetSection.nextSibling);
        } else {
            document.body.appendChild(container);
        }

        this.updateBotDisplay();
    }

    updateBotDisplay() {
        const grid = document.getElementById('lt-bots-grid');
        if (!grid) return;

        const botEntries = Object.entries(this.bots);

        if (botEntries.length === 0) {
            grid.innerHTML = `
                <div class="lt-no-bots">
                    <i class="fas fa-robot"></i>
                    <p>No trade bots available. Join our Discord to trade!</p>
                    <a href="${this.discordInvite}" target="_blank" class="lt-discord-btn">
                        <i class="fab fa-discord"></i>
                        Join Discord
                    </a>
                </div>
            `;
            return;
        }

        // Filter by selected game
        const activeTab = document.querySelector('.lt-game-tab.active');
        const selectedGame = activeTab ? activeTab.dataset.game : 'all';

        const filteredBots = botEntries.filter(([id, bot]) => {
            if (selectedGame === 'all') return true;
            const game = this.normalizeGameName(bot.game);
            return game === selectedGame;
        });

        if (filteredBots.length === 0) {
            grid.innerHTML = `
                <div class="lt-no-bots">
                    <i class="fas fa-search"></i>
                    <p>No bots available for this game. Try another game or join Discord!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredBots.map(([id, bot]) => this.renderBotCard(id, bot)).join('');
    }

    renderBotCard(id, bot) {
        const isOnline = bot.status === 'Online';
        const gameDisplay = this.getGameDisplayName(bot.game);
        const gameIcon = this.getGameIcon(bot.game);

        return `
            <div class="lt-bot-card ${isOnline ? '' : 'offline'}" data-bot-id="${id}">
                <div class="lt-bot-header">
                    <div class="lt-bot-avatar">
                        ${gameIcon}
                    </div>
                    <div class="lt-bot-info">
                        <div class="lt-bot-name">${this.escapeHtml(bot.name)}</div>
                        <div class="lt-bot-game">${gameDisplay}</div>
                    </div>
                    <div class="lt-bot-status">
                        <div class="lt-status-dot ${isOnline ? '' : 'offline'}"></div>
                        <span>${isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                </div>
                <div class="lt-bot-stats">
                    <div class="lt-bot-stat">
                        <div class="lt-bot-stat-value">${bot.tradesQueued || 0}</div>
                        <div class="lt-bot-stat-label">In Queue</div>
                    </div>
                    <div class="lt-bot-stat">
                        <div class="lt-bot-stat-value">${bot.tradesCompleted || 0}</div>
                        <div class="lt-bot-stat-label">Completed</div>
                    </div>
                    <div class="lt-bot-stat">
                        <div class="lt-bot-stat-value">${this.formatUptime(bot.uptime)}</div>
                        <div class="lt-bot-stat-label">Uptime</div>
                    </div>
                </div>
            </div>
        `;
    }

    normalizeGameName(game) {
        if (!game) return 'unknown';
        const lower = game.toLowerCase();
        if (lower.includes('z-a') || lower.includes('za') || lower.includes('legends z')) return 'za';
        if (lower.includes('scarlet') || lower.includes('violet') || lower === 'sv') return 'sv';
        if (lower.includes('sword') || lower.includes('shield') || lower === 'swsh') return 'swsh';
        if (lower.includes('brilliant') || lower.includes('shining') || lower === 'bdsp') return 'bdsp';
        if (lower.includes('arceus') || lower === 'pla') return 'pla';
        if (lower.includes('let\'s go') || lower === 'lgpe') return 'lgpe';
        return 'unknown';
    }

    getGameDisplayName(game) {
        if (!game || game === 'Unknown') return 'Multi-Game';
        return game;
    }

    getGameIcon(game) {
        const normalized = this.normalizeGameName(game);
        const icons = {
            'za': '<i class="fas fa-dragon"></i>',
            'sv': '<i class="fas fa-gem"></i>',
            'swsh': '<i class="fas fa-shield-alt"></i>',
            'bdsp': '<i class="fas fa-diamond"></i>',
            'pla': '<i class="fas fa-scroll"></i>',
            'lgpe': '<i class="fas fa-bolt"></i>',
            'unknown': '<i class="fas fa-robot"></i>'
        };
        return icons[normalized] || icons['unknown'];
    }

    formatUptime(uptime) {
        if (!uptime || uptime === 0) return '24/7';
        const hours = Math.floor(uptime / 3600);
        if (hours >= 24) {
            return Math.floor(hours / 24) + 'd';
        }
        return hours + 'h';
    }

    bindEvents() {
        // Game tab filtering
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lt-game-tab')) {
                document.querySelectorAll('.lt-game-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.updateBotDisplay();
            }
        });

        // Copy sample command
        document.addEventListener('click', (e) => {
            if (e.target.closest('#lt-copy-sample')) {
                const btn = e.target.closest('#lt-copy-sample');
                const command = document.getElementById('lt-sample-command').textContent;
                this.copyToClipboard(command, btn);
            }
        });

        // Bot card selection
        document.addEventListener('click', (e) => {
            const botCard = e.target.closest('.lt-bot-card');
            if (botCard && !botCard.classList.contains('offline')) {
                document.querySelectorAll('.lt-bot-card').forEach(c => c.classList.remove('selected'));
                botCard.classList.add('selected');
                this.selectedBot = botCard.dataset.botId;
            }
        });

        // Update sample command when trade form generates one
        const tradeModal = document.getElementById('tradeModal');
        if (tradeModal) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList.contains('active')) {
                        const tradeCode = document.getElementById('tradeCode');
                        if (tradeCode) {
                            const sampleCmd = document.getElementById('lt-sample-command');
                            if (sampleCmd) {
                                sampleCmd.textContent = tradeCode.textContent;
                            }
                        }
                    }
                });
            });
            observer.observe(tradeModal, { attributes: true, attributeFilter: ['class'] });
        }
    }

    copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            btn.classList.add('copied');

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('copied');
            }, 2000);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.liveTradingSystem = new LiveTradingSystem();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (!window.liveTradingSystem) {
        window.liveTradingSystem = new LiveTradingSystem();
    }
}
