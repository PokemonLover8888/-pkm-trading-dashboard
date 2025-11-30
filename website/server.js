/**
 * PKM-Universe Website Server
 * Express backend with Discord OAuth and Bot integration
 * Now with WebSocket support for real-time updates!
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || process.env.WEB_PORT || config.server.port || 3000;

// API key for sync endpoint (set in Railway environment variables)
const SYNC_API_KEY = process.env.SYNC_API_KEY || 'pkm-universe-sync-key-2024';

// Store connected clients
const clients = new Set();

// In-memory storage for synced bot status (used when local files don't exist, e.g., on Railway)
let syncedBotStatus = null;
let syncedNameMapping = {};

// WebSocket connection handling
wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`Client connected. Total clients: ${clients.size}`);

    // Send initial data
    sendDashboardUpdate(ws);

    ws.on('close', () => {
        clients.delete(ws);
        console.log(`Client disconnected. Total clients: ${clients.size}`);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Broadcast to all connected clients
function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Send dashboard update to specific client
function sendDashboardUpdate(ws) {
    const data = getDashboardData();
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'dashboard', data }));
    }
}

// Get dashboard data from trade_bot_status.json AND bot_name_mapping.json
// Falls back to synced data if local files don't exist (Railway deployment)
function getDashboardData() {
    try {
        const statusPath = path.join(__dirname, '..', 'src', 'Json', 'trade_bot_status.json');
        const nameMappingPath = path.join(__dirname, '..', 'src', 'Json', 'bot_name_mapping.json');

        let statusData = { network: {}, bots: {} };
        let nameMapping = {};

        // Try local files first
        if (fs.existsSync(nameMappingPath)) {
            nameMapping = JSON.parse(fs.readFileSync(nameMappingPath, 'utf8'));
        } else if (Object.keys(syncedNameMapping).length > 0) {
            nameMapping = syncedNameMapping;
        }

        if (fs.existsSync(statusPath)) {
            statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
        } else if (syncedBotStatus) {
            // Use synced data from remote push
            statusData = syncedBotStatus;
        }

        return formatDashboardData(statusData, nameMapping);
    } catch (error) {
        console.error('Error reading bot status:', error);
    }
    return getDefaultDashboardData();
}

// Format raw data for dashboard
function formatDashboardData(data, nameMapping = {}) {
    const bots = [];
    let totalTrades = 0;
    let totalQueued = 0;
    const recentTrades = [];
    const traderCounts = {};
    const processedBotIds = new Set();

    // Game detection from bot name
    function detectGame(name) {
        if (!name) return 'Unknown';
        const nameLower = name.toLowerCase();
        if (nameLower.includes('za') || nameLower.includes('z-a')) return 'Legends Z-A';
        if (nameLower.includes('sv') || nameLower.includes('scarlet') || nameLower.includes('violet')) return 'Scarlet & Violet';
        if (nameLower.includes('bdsp') || nameLower.includes('diamond') || nameLower.includes('pearl')) return 'BDSP';
        if (nameLower.includes('swsh') || nameLower.includes('sword') || nameLower.includes('shield')) return 'Sword/Shield';
        if (nameLower.includes('pla') || nameLower.includes('arceus')) return 'Legends Arceus';
        if (nameLower.includes('lgpe') || nameLower.includes('let\'s go')) return 'Let\'s Go';
        return 'Unknown';
    }

    // First, process bots from status data (these have real trade data)
    if (data.bots) {
        Object.entries(data.bots).forEach(([id, bot]) => {
            processedBotIds.add(id);
            totalTrades += bot.tradesCompleted || 0;
            totalQueued += bot.tradesQueued || 0;

            // Collect recent trades for activity feed
            if (bot.recentTrades) {
                bot.recentTrades.forEach(trade => {
                    recentTrades.push({
                        ...trade,
                        botName: bot.name,
                        botId: id
                    });
                    // Count trades per user
                    if (trade.username) {
                        traderCounts[trade.username] = (traderCounts[trade.username] || 0) + 1;
                    }
                });
            }

            const botName = bot.name || nameMapping[id] || 'Unknown Bot';
            bots.push({
                id,
                name: botName,
                status: bot.status || 'Online',
                game: bot.game || detectGame(botName),
                location: bot.location || 'Indianapolis, IN',
                tradesCompleted: bot.tradesCompleted || 0,
                tradesQueued: bot.tradesQueued || 0,
                pokemonCount: bot.pokemonCount || 0,
                lastActive: bot.lastActive,
                uptime: bot.uptime || 0,
                queue: bot.queue || [],
                currentTrade: bot.queue && bot.queue.length > 0 ? bot.queue[0] : null
            });
        });
    }

    // Then, add any bots from name mapping that aren't in status data
    Object.entries(nameMapping).forEach(([id, name]) => {
        if (!processedBotIds.has(id) && name) {
            bots.push({
                id,
                name: name,
                status: 'Online',
                game: detectGame(name),
                location: 'Indianapolis, IN',
                tradesCompleted: 0,
                tradesQueued: 0,
                pokemonCount: 0,
                lastActive: null,
                uptime: 0,
                queue: [],
                currentTrade: null
            });
        }
    });

    // Sort recent trades by timestamp
    recentTrades.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Find top trader
    let topTrader = '--';
    let maxTrades = 0;
    Object.entries(traderCounts).forEach(([user, count]) => {
        if (count > maxTrades) {
            maxTrades = count;
            topTrader = user;
        }
    });

    return {
        network: {
            status: data.network?.status || 'Online',
            totalBots: data.network?.totalBots || bots.length,
            activeBots: data.network?.activeBots || bots.filter(b => b.status === 'Online').length,
            totalTradesQueued: totalQueued,
            region: data.network?.region || 'Indianapolis, IN',
            lastUpdated: data.network?.lastUpdated || new Date().toISOString()
        },
        bots,
        stats: {
            totalTrades,
            tradesToday: totalTrades, // Would need date filtering for real "today"
            avgWait: '~30s',
            avgTradeTime: '~25s',
            topTrader: topTrader !== '--' ? topTrader : '--',
            peakHour: '8PM EST' // Would need real tracking
        },
        recentTrades: recentTrades.slice(0, 20),
        queue: bots.flatMap(bot =>
            (bot.queue || []).map((q, i) => ({
                ...q,
                position: i + 1,
                botName: bot.name
            }))
        )
    };
}

function getDefaultDashboardData() {
    return {
        network: {
            status: 'Offline',
            totalBots: 0,
            activeBots: 0,
            totalTradesQueued: 0,
            region: 'Unknown',
            lastUpdated: new Date().toISOString()
        },
        bots: [],
        stats: {
            totalTrades: 0,
            tradesToday: 0,
            avgWait: '--',
            avgTradeTime: '--',
            topTrader: '--',
            peakHour: '--'
        },
        recentTrades: [],
        queue: []
    };
}

// Watch for file changes and broadcast updates
let lastFileContent = '';
function watchBotStatus() {
    const statusPath = path.join(__dirname, '..', 'src', 'Json', 'trade_bot_status.json');

    setInterval(() => {
        try {
            if (fs.existsSync(statusPath)) {
                const content = fs.readFileSync(statusPath, 'utf8');
                if (content !== lastFileContent) {
                    lastFileContent = content;
                    const data = getDashboardData();
                    broadcast({ type: 'dashboard', data });
                }
            }
        } catch (error) {
            // Ignore read errors
        }
    }, 2000); // Check every 2 seconds
}

// Start watching
watchBotStatus();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Discord invite link (OAuth disabled - redirect to Discord server)
app.get('/auth/login', (req, res) => {
    res.redirect('https://discord.gg/pkm-universe');
});

// OAuth callback (disabled - redirect to home)
app.get('/auth/callback', (req, res) => {
    res.redirect('/');
});

// Logout
app.get('/auth/logout', (req, res) => {
    res.redirect('/');
});

// API Routes

// Get bot status
app.get('/api/status', (req, res) => {
    try {
        const statusPath = path.join(__dirname, '..', 'src', 'Json', 'trade_bot_status.json');
        if (fs.existsSync(statusPath)) {
            const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
            res.json({ success: true, data: status });
        } else {
            res.json({
                success: true,
                data: {
                    online: true,
                    games: {
                        sv: { online: true, queue: 0 },
                        swsh: { online: true, queue: 0 },
                        bdsp: { online: true, queue: 0 }
                    }
                }
            });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Get queue info
app.get('/api/queue', (req, res) => {
    res.json({
        success: true,
        data: {
            sv: { count: 0, avgWait: '30s' },
            swsh: { count: 0, avgWait: '30s' },
            bdsp: { count: 0, avgWait: '45s' }
        }
    });
});

// Get bot status for live trading
app.get('/api/bot-status', (req, res) => {
    try {
        const statusPath = path.join(__dirname, '..', 'src', 'Json', 'trade_bot_status.json');

        let statusData = { network: {}, bots: {} };

        if (fs.existsSync(statusPath)) {
            statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
        } else if (syncedBotStatus) {
            statusData = syncedBotStatus;
        }

        res.json(statusData);
    } catch (error) {
        console.error('Error getting bot status:', error);
        res.json({ network: { status: 'Error' }, bots: {} });
    }
});

// Get stats - REAL DATA from trade_bot_status.json
app.get('/api/stats', (req, res) => {
    try {
        const statusPath = path.join(__dirname, '..', 'src', 'Json', 'trade_bot_status.json');
        if (fs.existsSync(statusPath)) {
            const data = JSON.parse(fs.readFileSync(statusPath, 'utf8'));

            // Calculate total trades from all bots
            let totalTrades = 0;
            let uniqueUsers = new Set();

            if (data.bots) {
                Object.values(data.bots).forEach(bot => {
                    totalTrades += bot.tradesCompleted || 0;
                    if (bot.recentTrades) {
                        bot.recentTrades.forEach(trade => {
                            if (trade.username) uniqueUsers.add(trade.username);
                        });
                    }
                });
            }

            res.json({
                success: true,
                data: {
                    totalTrades: totalTrades,
                    activeBots: data.network?.activeBots || 0,
                    totalBots: data.network?.totalBots || 0,
                    status: data.network?.status || 'Unknown',
                    recentUsers: uniqueUsers.size,
                    lastUpdated: data.network?.lastUpdated
                }
            });
        } else {
            res.json({
                success: true,
                data: { totalTrades: 0, activeBots: 0, totalBots: 0, status: 'Offline' }
            });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Pokemon data endpoint
app.get('/api/pokemon/:name', async (req, res) => {
    const name = req.params.name.toLowerCase();
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        res.json({
            success: true,
            data: {
                name: data.name,
                id: data.id,
                types: data.types.map(t => t.type.name),
                abilities: data.abilities.map(a => ({
                    name: a.ability.name,
                    hidden: a.is_hidden
                })),
                stats: data.stats.map(s => ({
                    name: s.stat.name,
                    base: s.base_stat
                })),
                sprite: data.sprites.other['official-artwork'].front_default
            }
        });
    } catch (error) {
        res.json({ success: false, error: 'Pokemon not found' });
    }
});

// Dashboard API endpoint
app.get('/api/dashboard', (req, res) => {
    const data = getDashboardData();
    res.json({ success: true, data });
});

// Sync endpoint - receives bot status updates from local machine
app.post('/api/sync', (req, res) => {
    const apiKey = req.headers['x-api-key'];

    // Validate API key
    if (apiKey !== SYNC_API_KEY) {
        return res.status(401).json({ success: false, error: 'Invalid API key' });
    }

    try {
        const { botStatus, nameMapping } = req.body;

        if (botStatus) {
            syncedBotStatus = botStatus;
            console.log(`[Sync] Updated bot status: ${Object.keys(botStatus.bots || {}).length} bots`);
        }

        if (nameMapping) {
            syncedNameMapping = nameMapping;
            console.log(`[Sync] Updated name mapping: ${Object.keys(nameMapping).length} entries`);
        }

        // Broadcast update to all connected WebSocket clients
        const data = getDashboardData();
        broadcast({ type: 'dashboard', data });

        res.json({
            success: true,
            message: 'Synced successfully',
            botsCount: Object.keys(syncedBotStatus?.bots || {}).length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Sync] Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        synced: syncedBotStatus !== null,
        botsCount: Object.keys(syncedBotStatus?.bots || {}).length,
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server with WebSocket support
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║          PKM-Universe Website Server                     ║
╠══════════════════════════════════════════════════════════╣
║  HTTP Server: http://localhost:${PORT}                     ║
║  WebSocket: ws://localhost:${PORT}                         ║
║  Static files: ${__dirname}
║  Real-time updates: ENABLED                              ║
╚══════════════════════════════════════════════════════════╝
    `);
});

module.exports = { app, server, wss };
