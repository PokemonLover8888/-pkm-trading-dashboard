// PKM-Universe Live Dashboard
// Real-time updates via WebSocket

class Dashboard {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 2000;
        this.lastData = null;
        this.activityHistory = [];
        this.maxActivityItems = 15;

        this.init();
    }

    init() {
        this.connectWebSocket();
        this.setupFallbackPolling();
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected!');
                this.reconnectAttempts = 0;
                this.updateConnectionStatus(true);
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'dashboard') {
                        this.updateDashboard(message.data);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.updateConnectionStatus(false);
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.setupFallbackPolling();
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
            setTimeout(() => this.connectWebSocket(), this.reconnectDelay);
        }
    }

    updateConnectionStatus(connected) {
        const liveIndicators = document.querySelectorAll('.live-indicator');
        liveIndicators.forEach(indicator => {
            if (connected) {
                indicator.innerHTML = '<span class="pulse-dot"></span> Live';
                indicator.style.color = '#7AC74C';
            } else {
                indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reconnecting...';
                indicator.style.color = '#F08030';
            }
        });
    }

    setupFallbackPolling() {
        // Fallback to polling if WebSocket fails
        setInterval(async () => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                await this.fetchDashboardData();
            }
        }, 5000);

        // Initial fetch
        this.fetchDashboardData();
    }

    async fetchDashboardData() {
        try {
            const response = await fetch('/api/dashboard');
            const result = await response.json();
            if (result.success) {
                this.updateDashboard(result.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }

    updateDashboard(data) {
        if (!data) return;

        // Detect new trades for activity feed
        if (this.lastData) {
            this.detectNewActivity(data);
        }

        this.lastData = data;

        // Update network stats
        this.updateNetworkStats(data.network, data.stats);

        // Update bot grid
        this.updateBotGrid(data.bots);

        // Update activity feed
        this.updateActivityFeed(data.recentTrades);

        // Update live queue
        this.updateLiveQueue(data.queue);

        // Update statistics
        this.updateStatistics(data.stats);
    }

    updateNetworkStats(network, stats) {
        const elements = {
            networkBots: `${network.activeBots}/${network.totalBots}`,
            networkTrades: stats.totalTrades.toLocaleString(),
            networkQueue: network.totalTradesQueued,
            networkAvgWait: stats.avgWait,
            networkRegion: network.region
        };

        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });

        // Also update hero stats
        const totalTrades = document.getElementById('totalTrades');
        const activeBots = document.getElementById('activeBots');
        const botStatus = document.getElementById('botStatus');

        if (totalTrades) totalTrades.textContent = stats.totalTrades.toLocaleString();
        if (activeBots) activeBots.textContent = `${network.activeBots}/${network.totalBots}`;
        if (botStatus) {
            botStatus.textContent = network.status;
            botStatus.style.color = network.status === 'Online' ? '#7AC74C' : '#F08030';
        }
    }

    updateBotGrid(bots) {
        const grid = document.getElementById('botGrid');
        if (!grid) return;

        if (!bots || bots.length === 0) {
            grid.innerHTML = `
                <div class="bot-card loading">
                    <i class="fas fa-robot"></i>
                    <span>No bots connected</span>
                </div>
            `;
            return;
        }

        grid.innerHTML = bots.map(bot => this.createBotCard(bot)).join('');
    }

    createBotCard(bot) {
        const statusClass = bot.status === 'Online' ? 'online' :
                           bot.tradesQueued > 0 ? 'busy' : 'offline';
        const statusText = bot.status === 'Online' ?
                          (bot.tradesQueued > 0 ? 'Trading' : 'Online') : 'Offline';

        const lastActiveText = bot.lastActive ?
            this.formatTimeAgo(new Date(bot.lastActive)) : 'Unknown';

        return `
            <div class="bot-card ${statusClass}">
                <div class="bot-header">
                    <div>
                        <div class="bot-name">${this.escapeHtml(bot.name)}</div>
                        <div class="bot-game">${this.escapeHtml(bot.game)}</div>
                    </div>
                    <div class="bot-status-indicator ${statusClass}">
                        <span class="status-dot"></span>
                        ${statusText}
                    </div>
                </div>
                <div class="bot-stats">
                    <div class="bot-stat">
                        <div class="bot-stat-value">${bot.tradesCompleted}</div>
                        <div class="bot-stat-label">Trades</div>
                    </div>
                    <div class="bot-stat">
                        <div class="bot-stat-value">${bot.tradesQueued}</div>
                        <div class="bot-stat-label">Queue</div>
                    </div>
                    <div class="bot-stat">
                        <div class="bot-stat-value">${lastActiveText}</div>
                        <div class="bot-stat-label">Last Active</div>
                    </div>
                </div>
                ${bot.currentTrade ? `
                    <div class="bot-current-trade">
                        <div class="trade-label">Currently Trading</div>
                        <div class="trade-user">${this.escapeHtml(bot.currentTrade.username || 'Unknown')}</div>
                    </div>
                ` : `
                    <div class="bot-idle">
                        <i class="fas fa-check-circle"></i> Ready for trades
                    </div>
                `}
            </div>
        `;
    }

    detectNewActivity(newData) {
        if (!this.lastData || !this.lastData.recentTrades) return;

        const oldTradeIds = new Set(
            this.lastData.recentTrades.map(t => `${t.username}-${t.timestamp}`)
        );

        newData.recentTrades.forEach(trade => {
            const tradeId = `${trade.username}-${trade.timestamp}`;
            if (!oldTradeIds.has(tradeId)) {
                this.addActivityItem({
                    type: 'trade-complete',
                    text: `<strong>${this.escapeHtml(trade.username)}</strong> completed trade via ${this.escapeHtml(trade.botName)}`,
                    time: new Date(trade.timestamp)
                });
            }
        });
    }

    addActivityItem(item) {
        this.activityHistory.unshift(item);
        if (this.activityHistory.length > this.maxActivityItems) {
            this.activityHistory.pop();
        }
        this.renderActivityFeed();
    }

    updateActivityFeed(recentTrades) {
        // Initialize activity history from recent trades if empty
        if (this.activityHistory.length === 0 && recentTrades && recentTrades.length > 0) {
            this.activityHistory = recentTrades.slice(0, this.maxActivityItems).map(trade => ({
                type: 'trade-complete',
                text: `<strong>${this.escapeHtml(trade.username)}</strong> completed trade via ${this.escapeHtml(trade.botName)}`,
                time: new Date(trade.timestamp)
            }));
        }
        this.renderActivityFeed();
    }

    renderActivityFeed() {
        const feed = document.getElementById('activityFeed');
        if (!feed) return;

        if (this.activityHistory.length === 0) {
            feed.innerHTML = `
                <div class="activity-item placeholder">
                    <i class="fas fa-clock"></i>
                    <span>Waiting for activity...</span>
                </div>
            `;
            return;
        }

        feed.innerHTML = this.activityHistory.map(item => `
            <div class="activity-item">
                <div class="activity-icon ${item.type}">
                    <i class="fas fa-${item.type === 'trade-complete' ? 'check' :
                                       item.type === 'trade-start' ? 'exchange-alt' :
                                       'user-plus'}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${item.text}</div>
                    <div class="activity-time">${this.formatTimeAgo(item.time)}</div>
                </div>
            </div>
        `).join('');
    }

    updateLiveQueue(queue) {
        const queueList = document.getElementById('liveQueueList');
        const queueCount = document.getElementById('liveQueueCount');

        if (queueCount) queueCount.textContent = queue ? queue.length : 0;

        if (!queueList) return;

        if (!queue || queue.length === 0) {
            queueList.innerHTML = `
                <div class="queue-empty-state">
                    <i class="fas fa-check-circle"></i>
                    <span>No queue - trade instantly!</span>
                </div>
            `;
            return;
        }

        queueList.innerHTML = queue.map(entry => `
            <div class="queue-entry">
                <div class="queue-position">${entry.position}</div>
                <div class="queue-entry-info">
                    <div class="queue-entry-user">${this.escapeHtml(entry.username || 'Unknown')}</div>
                    <div class="queue-entry-pokemon">${this.escapeHtml(entry.pokemon || 'Custom Pokemon')} via ${this.escapeHtml(entry.botName)}</div>
                </div>
                <div class="queue-entry-time">${this.formatTimeAgo(new Date(entry.timestamp))}</div>
            </div>
        `).join('');
    }

    updateStatistics(stats) {
        const elements = {
            tradesToday: stats.tradesToday?.toLocaleString() || '0',
            peakHour: stats.peakHour || '--',
            topTrader: stats.topTrader || '--',
            avgTradeTime: stats.avgTradeTime || '--'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }

    formatTimeAgo(date) {
        if (!date || isNaN(date.getTime())) return 'Unknown';

        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 5) return 'Just now';
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
