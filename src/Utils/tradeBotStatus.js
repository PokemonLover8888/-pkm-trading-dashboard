/**
 * Trade Bot Status Manager
 * Manages real-time status tracking for all trade bots
 */

const fs = require('fs');
const path = require('path');

class TradeBotStatus {
  constructor() {
    this.statusFile = path.join(__dirname, '../Json/trade_bot_status.json');
    this.startTime = Date.now();
  }

  // Load status data
  loadStatus() {
    try {
      if (fs.existsSync(this.statusFile)) {
        const data = fs.readFileSync(this.statusFile, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('[TRADE BOT STATUS] Error loading status:', error);
    }
    return this.getDefaultStatus();
  }

  // Get default status structure
  getDefaultStatus() {
    return {
      network: {
        status: "Online",
        totalBots: 13,
        activeBots: 13,
        totalTradesQueued: 0,
        region: "Indianapolis, Indiana",
        lastUpdated: new Date().toISOString()
      },
      bots: {}
    };
  }

  // Save status data
  saveStatus(status) {
    try {
      status.network.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));
      return true;
    } catch (error) {
      console.error('[TRADE BOT STATUS] Error saving status:', error);
      return false;
    }
  }

  // Update bot status
  updateBotStatus(botId, updates) {
    const status = this.loadStatus();

    if (!status.bots[botId]) {
      console.error(`[TRADE BOT STATUS] Bot ${botId} not found`);
      return false;
    }

    status.bots[botId] = {
      ...status.bots[botId],
      ...updates,
      lastActive: new Date().toISOString()
    };

    this.saveStatus(status);
    return true;
  }

  // Add trade to queue with user details
  addTradeToQueue(botId, userInfo = null) {
    const status = this.loadStatus();

    if (status.bots[botId]) {
      // Initialize queue array if it doesn't exist
      if (!status.bots[botId].queue) {
        status.bots[botId].queue = [];
      }

      // Add user to queue if provided
      if (userInfo) {
        status.bots[botId].queue.push({
          userId: userInfo.userId,
          username: userInfo.username,
          pokemon: userInfo.pokemon || 'Unknown',
          timestamp: new Date().toISOString()
        });
      }

      status.bots[botId].tradesQueued++;
      status.network.totalTradesQueued++;
      this.saveStatus(status);
      console.log(`[TRADE BOT STATUS] Added trade to queue for bot ${botId}`);
      return true;
    }

    return false;
  }

  // Complete a trade
  completeTrade(botId) {
    const status = this.loadStatus();

    if (status.bots[botId]) {
      // Remove first user from queue
      if (status.bots[botId].queue && status.bots[botId].queue.length > 0) {
        status.bots[botId].queue.shift();
      }

      if (status.bots[botId].tradesQueued > 0) {
        status.bots[botId].tradesQueued--;
        status.network.totalTradesQueued--;
      }
      status.bots[botId].tradesCompleted++;
      status.bots[botId].lastActive = new Date().toISOString();
      this.saveStatus(status);
      console.log(`[TRADE BOT STATUS] Trade completed for bot ${botId}`);
      return true;
    }

    return false;
  }

  // Update Pokemon count
  updatePokemonCount(botId, count) {
    return this.updateBotStatus(botId, { pokemonCount: count });
  }

  // Set bot online/offline
  setBotStatus(botId, isOnline) {
    const newStatus = isOnline ? "Online" : "Offline";
    const status = this.loadStatus();

    if (status.bots[botId]) {
      status.bots[botId].status = newStatus;

      // Update active bot count
      status.network.activeBots = Object.values(status.bots)
        .filter(bot => bot.status === "Online").length;

      this.saveStatus(status);
      return true;
    }

    return false;
  }

  // Get network summary
  getNetworkSummary() {
    const status = this.loadStatus();
    return status.network;
  }

  // Get bot status by game
  getBotsByGame() {
    const status = this.loadStatus();
    const gameStats = {};

    Object.values(status.bots).forEach(bot => {
      if (!gameStats[bot.game]) {
        gameStats[bot.game] = {
          game: bot.game,
          totalBots: 0,
          onlineBots: 0,
          tradesQueued: 0,
          status: "Online"
        };
      }

      gameStats[bot.game].totalBots++;
      if (bot.status === "Online") {
        gameStats[bot.game].onlineBots++;
      }
      gameStats[bot.game].tradesQueued += bot.tradesQueued;
    });

    // Determine overall status for each game
    Object.keys(gameStats).forEach(game => {
      const stats = gameStats[game];
      if (stats.onlineBots === 0) {
        stats.status = "Offline";
      } else if (stats.onlineBots < stats.totalBots) {
        stats.status = "Degraded";
      } else if (stats.tradesQueued > stats.totalBots * 3) {
        stats.status = "Busy";
      } else {
        stats.status = "Available";
      }
    });

    return gameStats;
  }

  // Get all bot statuses
  getAllBots() {
    const status = this.loadStatus();
    return status.bots;
  }

  // Get bot by ID
  getBot(botId) {
    const status = this.loadStatus();
    return status.bots[botId] || null;
  }

  // Calculate network load
  getNetworkLoad() {
    const status = this.loadStatus();
    const totalCapacity = status.network.activeBots * 5; // Assume 5 trades per bot capacity
    const currentLoad = status.network.totalTradesQueued;
    const percentage = totalCapacity > 0 ? (currentLoad / totalCapacity) * 100 : 0;

    if (percentage >= 80) return "High";
    if (percentage >= 50) return "Moderate";
    return "Available";
  }

  // Initialize bot status from collections
  initializeFromCollections() {
    const collectionsPath = path.join(__dirname, '../Json/pokemon_collections.json');
    const configPath = path.join(__dirname, '../Json/pokemon_game_config.json');

    try {
      const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf-8'));
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const status = this.loadStatus();

      // Custom game assignments - Order: ZA (4), SV (4), BDSP (2), SwSh (2), Arceus (1)
      const gameAssignments = [
        "Legends Z-A",           // Bot 1
        "Legends Z-A",           // Bot 2
        "Legends Z-A",           // Bot 3
        "Legends Z-A",           // Bot 4
        "Scarlet & Violet",      // Bot 5
        "Scarlet & Violet",      // Bot 6
        "Scarlet & Violet",      // Bot 7
        "Scarlet & Violet",      // Bot 8
        "Brilliant Diamond & Shining Pearl", // Bot 9
        "Brilliant Diamond & Shining Pearl", // Bot 10
        "Sword & Shield",        // Bot 11
        "Sword & Shield",        // Bot 12
        "Legends: Arceus"        // Bot 13
      ];

      // Bot display names - using full game names
      const botNames = [
        "Legends Z-A Bot 1",
        "Legends Z-A Bot 2",
        "Legends Z-A Bot 3",
        "Legends Z-A Bot 4",
        "Scarlet & Violet Bot 1",
        "Scarlet & Violet Bot 2",
        "Scarlet & Violet Bot 3",
        "Scarlet & Violet Bot 4",
        "Brilliant Diamond & Shining Pearl Bot 1",
        "Brilliant Diamond & Shining Pearl Bot 2",
        "Sword & Shield Bot 1",
        "Sword & Shield Bot 2",
        "Legends: Arceus Bot 1"
      ];

      config.wonderTradeBotPool.forEach((botId, index) => {
        const pokemonCount = collections[botId]?.pokemon?.length || 0;
        const game = gameAssignments[index] || "Scarlet & Violet";
        const botName = botNames[index] || `Trade Bot #${index + 1}`;

        status.bots[botId] = {
          name: botName,
          status: "Online",
          location: "Indianapolis, IN",
          game: game,
          tradesQueued: 0,
          tradesCompleted: 0,
          pokemonCount: pokemonCount,
          lastActive: new Date().toISOString(),
          uptime: 0,
          queue: []
        };
      });

      status.network.totalBots = config.wonderTradeBotPool.length;
      status.network.activeBots = config.wonderTradeBotPool.length;

      this.saveStatus(status);
      console.log('[TRADE BOT STATUS] Initialized bot statuses from collections');
      return true;
    } catch (error) {
      console.error('[TRADE BOT STATUS] Error initializing from collections:', error);
      return false;
    }
  }
}

// Singleton instance
let instance = null;

function getTradeBotStatus() {
  if (!instance) {
    instance = new TradeBotStatus();
  }
  return instance;
}

module.exports = {
  TradeBotStatus,
  getTradeBotStatus
};
