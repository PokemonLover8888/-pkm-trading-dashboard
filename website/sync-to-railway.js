/**
 * Sync Bot Status to Railway
 * Reads local trade_bot_status.json and pushes to live Railway server
 * Run this script locally to keep the live website updated
 */

const fs = require('fs');
const path = require('path');

// Configuration
const RAILWAY_URL = 'https://pkm-universe-live-trading.com';
const API_KEY = 'pkm-universe-sync-key-2024';
const SYNC_INTERVAL = 5000; // 5 seconds

// File paths
const statusPath = path.join(__dirname, '..', 'src', 'Json', 'trade_bot_status.json');
const nameMappingPath = path.join(__dirname, '..', 'src', 'Json', 'bot_name_mapping.json');

let lastStatusContent = '';
let lastMappingContent = '';
let syncCount = 0;

async function syncToRailway() {
    try {
        let botStatus = null;
        let nameMapping = null;
        let hasChanges = false;

        // Read bot status
        if (fs.existsSync(statusPath)) {
            const content = fs.readFileSync(statusPath, 'utf8');
            if (content !== lastStatusContent) {
                lastStatusContent = content;
                botStatus = JSON.parse(content);
                hasChanges = true;
            }
        }

        // Read name mapping
        if (fs.existsSync(nameMappingPath)) {
            const content = fs.readFileSync(nameMappingPath, 'utf8');
            if (content !== lastMappingContent) {
                lastMappingContent = content;
                nameMapping = JSON.parse(content);
                hasChanges = true;
            }
        }

        // Only sync if there are changes
        if (!hasChanges) {
            return;
        }

        const payload = {};
        if (botStatus) payload.botStatus = botStatus;
        if (nameMapping) payload.nameMapping = nameMapping;

        const response = await fetch(`${RAILWAY_URL}/api/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        syncCount++;

        if (result.success) {
            console.log(`[${new Date().toLocaleTimeString()}] Synced to Railway: ${result.botsCount} bots (sync #${syncCount})`);
        } else {
            console.error(`[${new Date().toLocaleTimeString()}] Sync failed:`, result.error);
        }
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] Sync error:`, error.message);
    }
}

// Initial sync
console.log(`
╔══════════════════════════════════════════════════════════╗
║          PKM-Universe Railway Sync                       ║
╠══════════════════════════════════════════════════════════╣
║  Target: ${RAILWAY_URL}
║  Interval: ${SYNC_INTERVAL / 1000} seconds
║  Status file: ${statusPath}
╚══════════════════════════════════════════════════════════╝
`);

console.log('Starting sync...');
syncToRailway();

// Continuous sync
setInterval(syncToRailway, SYNC_INTERVAL);

// Keep running
process.on('SIGINT', () => {
    console.log('\nSync stopped. Total syncs:', syncCount);
    process.exit(0);
});
