/**
 * PKM-Universe Discord Widget
 * Clean, simple widget that shows real Discord data when available
 * Otherwise shows a join prompt without fake data
 */

class DiscordWidget {
    constructor() {
        this.inviteCode = 'pkm-universe';
        this.inviteUrl = 'https://discord.gg/pkm-universe';

        // Your actual Discord server ID - needed to fetch real widget data
        // Go to Discord Server Settings > Widget > Enable Server Widget > Copy Server ID
        this.serverId = null; // Set this to your server ID to enable live data

        this.serverData = null;
        this.init();
    }

    async init() {
        this.injectStyles();

        // Try to fetch real Discord widget data if server ID is set
        if (this.serverId) {
            await this.fetchDiscordData();
        }

        this.createWidget();
    }

    async fetchDiscordData() {
        try {
            // Discord's public widget API (requires widget to be enabled in server settings)
            const response = await fetch(`https://discord.com/api/guilds/${this.serverId}/widget.json`);
            if (response.ok) {
                this.serverData = await response.json();
            }
        } catch (error) {
            console.log('Discord widget data not available - using static display');
        }
    }

    injectStyles() {
        if (document.getElementById('discord-widget-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'discord-widget-styles';
        styles.textContent = `
            .discord-widget {
                background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%);
                border-radius: 24px;
                padding: 40px;
                margin: 30px 0;
                border: 2px solid rgba(88, 101, 242, 0.3);
                box-shadow: 0 20px 60px rgba(88, 101, 242, 0.15);
                text-align: center;
            }

            .dw-header {
                margin-bottom: 30px;
            }

            .dw-icon {
                width: 100px;
                height: 100px;
                margin: 0 auto 20px;
                background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                color: #fff;
                box-shadow: 0 10px 40px rgba(88, 101, 242, 0.4);
            }

            .dw-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 2rem;
                color: #fff;
                margin: 0 0 10px;
            }

            .dw-title span {
                color: #5865f2;
            }

            .dw-description {
                color: #888;
                font-size: 1.1rem;
                max-width: 500px;
                margin: 0 auto;
                line-height: 1.6;
            }

            .dw-stats-row {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin: 30px 0;
                flex-wrap: wrap;
            }

            .dw-stat {
                text-align: center;
            }

            .dw-stat-value {
                font-family: 'Orbitron', sans-serif;
                font-size: 2rem;
                color: #5865f2;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .dw-stat-value .online-dot {
                width: 12px;
                height: 12px;
                background: #3ba55d;
                border-radius: 50%;
                animation: pulse-dot 2s ease-in-out infinite;
            }

            @keyframes pulse-dot {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .dw-stat-label {
                color: #666;
                font-size: 0.85rem;
                margin-top: 5px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .dw-features {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin: 30px 0;
                flex-wrap: wrap;
            }

            .dw-feature {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #888;
                font-size: 0.95rem;
            }

            .dw-feature i {
                color: #5865f2;
                font-size: 1.2rem;
            }

            .dw-join-btn {
                display: inline-flex;
                align-items: center;
                gap: 12px;
                padding: 18px 50px;
                background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%);
                border: none;
                border-radius: 30px;
                color: #fff;
                font-size: 1.2rem;
                font-weight: 700;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 10px 30px rgba(88, 101, 242, 0.3);
            }

            .dw-join-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 40px rgba(88, 101, 242, 0.5);
            }

            .dw-join-btn i {
                font-size: 1.5rem;
            }

            .dw-online-members {
                margin-top: 30px;
                padding-top: 30px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .dw-online-title {
                color: #666;
                font-size: 0.85rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 15px;
            }

            .dw-members-preview {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 10px;
            }

            .dw-member {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 14px;
                background: rgba(88, 101, 242, 0.1);
                border-radius: 20px;
                transition: all 0.2s ease;
            }

            .dw-member:hover {
                background: rgba(88, 101, 242, 0.2);
            }

            .dw-member-avatar {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: linear-gradient(135deg, #5865f2, #7289da);
                position: relative;
            }

            .dw-member-avatar::after {
                content: '';
                position: absolute;
                bottom: -2px;
                right: -2px;
                width: 10px;
                height: 10px;
                background: #3ba55d;
                border-radius: 50%;
                border: 2px solid #1a1a2e;
            }

            .dw-member-name {
                color: #fff;
                font-size: 0.85rem;
                font-weight: 500;
            }

            .dw-no-data {
                color: #555;
                font-style: italic;
            }

            @media (max-width: 768px) {
                .discord-widget {
                    padding: 30px 20px;
                }

                .dw-title {
                    font-size: 1.5rem;
                }

                .dw-stats-row {
                    gap: 20px;
                }

                .dw-stat-value {
                    font-size: 1.5rem;
                }

                .dw-features {
                    flex-direction: column;
                    gap: 15px;
                }

                .dw-join-btn {
                    padding: 15px 40px;
                    font-size: 1rem;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    createWidget() {
        const container = document.createElement('div');
        container.id = 'discord-widget-container';

        const hasLiveData = this.serverData !== null;

        container.innerHTML = `
            <div class="discord-widget">
                <div class="dw-header">
                    <div class="dw-icon">
                        <i class="fab fa-discord"></i>
                    </div>
                    <h2 class="dw-title">Join <span>PKM-Universe</span></h2>
                    <p class="dw-description">
                        Connect with our community for free Pokemon trades, giveaways, and more!
                        Our trading bots are available 24/7.
                    </p>
                </div>

                ${hasLiveData ? this.renderLiveStats() : this.renderStaticInfo()}

                <div class="dw-features">
                    <div class="dw-feature">
                        <i class="fas fa-robot"></i>
                        <span>24/7 Trade Bots</span>
                    </div>
                    <div class="dw-feature">
                        <i class="fas fa-gift"></i>
                        <span>Daily Giveaways</span>
                    </div>
                    <div class="dw-feature">
                        <i class="fas fa-users"></i>
                        <span>Active Community</span>
                    </div>
                    <div class="dw-feature">
                        <i class="fas fa-headset"></i>
                        <span>Free Support</span>
                    </div>
                </div>

                <a href="${this.inviteUrl}" target="_blank" class="dw-join-btn">
                    <i class="fab fa-discord"></i>
                    Join Discord Server
                </a>

                ${hasLiveData && this.serverData.members?.length > 0 ? this.renderOnlineMembers() : ''}
            </div>
        `;

        // Insert after mystery box or at end of main content
        const targetSection = document.querySelector('#mystery-box-container') ||
                             document.querySelector('.live-trading-section');

        if (targetSection) {
            targetSection.parentNode.insertBefore(container, targetSection.nextSibling);
        } else {
            document.body.appendChild(container);
        }
    }

    renderLiveStats() {
        const onlineCount = this.serverData.presence_count || 0;

        return `
            <div class="dw-stats-row">
                <div class="dw-stat">
                    <div class="dw-stat-value">
                        <span class="online-dot"></span>
                        ${this.formatNumber(onlineCount)}
                    </div>
                    <div class="dw-stat-label">Online Now</div>
                </div>
            </div>
        `;
    }

    renderStaticInfo() {
        return `
            <div class="dw-stats-row">
                <div class="dw-stat">
                    <div class="dw-stat-value">
                        <span class="online-dot"></span>
                        Active
                    </div>
                    <div class="dw-stat-label">Server Status</div>
                </div>
            </div>
        `;
    }

    renderOnlineMembers() {
        const members = this.serverData.members.slice(0, 8);

        return `
            <div class="dw-online-members">
                <div class="dw-online-title">Currently Online</div>
                <div class="dw-members-preview">
                    ${members.map(m => `
                        <div class="dw-member">
                            <div class="dw-member-avatar" style="${m.avatar_url ? `background-image: url(${m.avatar_url}); background-size: cover;` : ''}"></div>
                            <span class="dw-member-name">${this.escapeHtml(m.username)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.discordWidget = new DiscordWidget();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (!window.discordWidget) {
        window.discordWidget = new DiscordWidget();
    }
}
