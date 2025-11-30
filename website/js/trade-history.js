/**
 * PKM-Universe Trade History & Collection Tracker
 * Living Dex progress, shiny showcase, trade statistics
 */

class TradeHistory {
    constructor() {
        this.trades = [];
        this.collection = {};
        this.shinies = [];
        this.totalPokemon = 1025; // Gen 9 total
        this.storageKey = 'pkm-universe-collection';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.injectStyles();
        this.createUI();
        this.bindEvents();
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                this.trades = data.trades || [];
                this.collection = data.collection || {};
                this.shinies = data.shinies || [];
            }
        } catch (e) {
            console.error('Error loading collection:', e);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                trades: this.trades,
                collection: this.collection,
                shinies: this.shinies
            }));
        } catch (e) {
            console.error('Error saving collection:', e);
        }
    }

    injectStyles() {
        if (document.getElementById('trade-history-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'trade-history-styles';
        styles.textContent = `
            .trade-history-container {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 30px;
                margin: 20px 0;
                border: 2px solid #9b59b6;
                box-shadow: 0 10px 40px rgba(155, 89, 182, 0.2);
            }

            .th-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                flex-wrap: wrap;
                gap: 15px;
            }

            .th-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.8rem;
                color: #9b59b6;
                text-shadow: 0 0 20px rgba(155, 89, 182, 0.5);
                margin: 0;
            }

            .th-tabs {
                display: flex;
                gap: 10px;
            }

            .th-tab {
                padding: 10px 20px;
                border-radius: 20px;
                border: 2px solid #444;
                background: transparent;
                color: #888;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .th-tab:hover {
                border-color: #9b59b6;
                color: #9b59b6;
            }

            .th-tab.active {
                background: linear-gradient(135deg, #9b59b6, #8e44ad);
                border-color: #9b59b6;
                color: #fff;
            }

            .th-content {
                display: none;
            }

            .th-content.active {
                display: block;
            }

            /* Living Dex Section */
            .living-dex-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .ld-stat-card {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 20px;
                text-align: center;
            }

            .ld-stat-value {
                font-family: 'Orbitron', sans-serif;
                font-size: 2.5rem;
                color: #9b59b6;
                margin-bottom: 5px;
            }

            .ld-stat-label {
                color: #888;
                font-size: 0.9rem;
            }

            .ld-progress-container {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .ld-progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .ld-progress-title {
                font-weight: bold;
                color: #fff;
            }

            .ld-progress-percent {
                font-family: 'Orbitron', sans-serif;
                color: #9b59b6;
            }

            .ld-progress-bar {
                height: 20px;
                background: #222;
                border-radius: 10px;
                overflow: hidden;
            }

            .ld-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #9b59b6, #e74c3c, #f39c12, #2ecc71);
                border-radius: 10px;
                transition: width 0.5s ease;
            }

            .ld-gen-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
            }

            .ld-gen-card {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                padding: 15px;
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .ld-gen-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 20px rgba(155, 89, 182, 0.3);
            }

            .ld-gen-number {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.2rem;
                color: #9b59b6;
                margin-bottom: 8px;
            }

            .ld-gen-progress {
                height: 8px;
                background: #222;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .ld-gen-fill {
                height: 100%;
                background: linear-gradient(90deg, #9b59b6, #00d4ff);
                border-radius: 4px;
            }

            .ld-gen-count {
                font-size: 0.8rem;
                color: #888;
            }

            /* Trade History Section */
            .th-history-list {
                max-height: 500px;
                overflow-y: auto;
            }

            .th-trade-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                margin-bottom: 10px;
                transition: all 0.3s ease;
            }

            .th-trade-item:hover {
                background: rgba(0, 0, 0, 0.5);
            }

            .th-trade-sprite {
                width: 60px;
                height: 60px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .th-trade-sprite img {
                max-width: 50px;
                max-height: 50px;
            }

            .th-trade-sprite.shiny img {
                filter: drop-shadow(0 0 5px gold);
            }

            .th-trade-info {
                flex: 1;
            }

            .th-trade-pokemon {
                font-weight: bold;
                color: #fff;
                margin-bottom: 4px;
            }

            .th-trade-meta {
                font-size: 0.85rem;
                color: #888;
            }

            .th-trade-time {
                color: #666;
                font-size: 0.8rem;
            }

            .th-trade-shiny-badge {
                background: linear-gradient(135deg, #ffd700, #ff8c00);
                color: #000;
                padding: 4px 10px;
                border-radius: 10px;
                font-size: 0.7rem;
                font-weight: bold;
            }

            /* Shiny Showcase */
            .shiny-showcase {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 15px;
            }

            .shiny-card {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 15px;
                text-align: center;
                position: relative;
                transition: all 0.3s ease;
                cursor: pointer;
                overflow: hidden;
            }

            .shiny-card::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(
                    45deg,
                    transparent 30%,
                    rgba(255, 215, 0, 0.1) 50%,
                    transparent 70%
                );
                animation: shimmer 3s infinite;
            }

            @keyframes shimmer {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }

            .shiny-card:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
            }

            .shiny-sprite {
                width: 80px;
                height: 80px;
                margin: 0 auto 10px;
                filter: drop-shadow(0 0 10px gold);
            }

            .shiny-sprite img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .shiny-name {
                font-weight: bold;
                color: #ffd700;
                font-size: 0.9rem;
            }

            .shiny-date {
                font-size: 0.75rem;
                color: #888;
            }

            .shiny-count-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #9b59b6;
                color: #fff;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.7rem;
                font-weight: bold;
            }

            /* Stats Section */
            .th-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }

            .th-stats-card {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 20px;
            }

            .th-stats-title {
                font-weight: bold;
                color: #9b59b6;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .th-stats-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .th-stats-list li {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #333;
            }

            .th-stats-list li:last-child {
                border-bottom: none;
            }

            .th-stats-list .label {
                color: #888;
            }

            .th-stats-list .value {
                font-weight: bold;
                color: #fff;
            }

            .th-chart-container {
                height: 200px;
                display: flex;
                align-items: flex-end;
                gap: 10px;
                padding-top: 20px;
            }

            .th-chart-bar {
                flex: 1;
                background: linear-gradient(180deg, #9b59b6, #8e44ad);
                border-radius: 5px 5px 0 0;
                min-height: 10px;
                position: relative;
                transition: height 0.5s ease;
            }

            .th-chart-bar::after {
                content: attr(data-label);
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.7rem;
                color: #888;
                white-space: nowrap;
            }

            .th-chart-bar::before {
                content: attr(data-value);
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.75rem;
                color: #9b59b6;
                font-weight: bold;
            }

            /* Search and Add */
            .th-search-add {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .th-search-input {
                flex: 1;
                min-width: 200px;
                padding: 12px 20px;
                border-radius: 25px;
                border: 2px solid #444;
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                font-size: 1rem;
            }

            .th-search-input:focus {
                outline: none;
                border-color: #9b59b6;
            }

            .th-add-btn {
                padding: 12px 25px;
                border-radius: 25px;
                border: none;
                background: linear-gradient(135deg, #9b59b6, #8e44ad);
                color: #fff;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .th-add-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 20px rgba(155, 89, 182, 0.4);
            }

            .th-add-shiny-checkbox {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #ffd700;
            }

            /* Import/Export */
            .th-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                justify-content: flex-end;
            }

            .th-action-btn {
                padding: 10px 20px;
                border-radius: 10px;
                border: 2px solid #444;
                background: transparent;
                color: #888;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .th-action-btn:hover {
                border-color: #9b59b6;
                color: #9b59b6;
            }

            .th-empty-state {
                text-align: center;
                padding: 50px 20px;
                color: #666;
            }

            .th-empty-state i {
                font-size: 4rem;
                margin-bottom: 20px;
                opacity: 0.5;
            }

            /* Pokemon Dex Modal */
            .dex-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: none;
                overflow-y: auto;
            }

            .dex-modal.show {
                display: block;
            }

            .dex-modal-content {
                max-width: 1200px;
                margin: 50px auto;
                padding: 30px;
            }

            .dex-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .dex-modal-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
                color: #9b59b6;
            }

            .dex-modal-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 2rem;
                cursor: pointer;
            }

            .dex-pokemon-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                gap: 10px;
            }

            .dex-pokemon-slot {
                aspect-ratio: 1;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }

            .dex-pokemon-slot:hover {
                background: rgba(155, 89, 182, 0.2);
                transform: scale(1.1);
            }

            .dex-pokemon-slot.owned {
                background: rgba(46, 204, 113, 0.2);
                border: 2px solid #2ecc71;
            }

            .dex-pokemon-slot.shiny-owned {
                background: rgba(255, 215, 0, 0.2);
                border: 2px solid #ffd700;
            }

            .dex-pokemon-slot img {
                width: 60px;
                height: 60px;
                object-fit: contain;
            }

            .dex-pokemon-slot .dex-number {
                position: absolute;
                bottom: 2px;
                right: 4px;
                font-size: 0.6rem;
                color: #666;
            }
        `;
        document.head.appendChild(styles);
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'trade-history-container';
        container.innerHTML = `
            <div class="trade-history-container">
                <div class="th-header">
                    <h2 class="th-title"><i class="fas fa-history"></i> Trade History & Collection</h2>
                    <div class="th-tabs">
                        <button class="th-tab active" data-tab="living-dex">Living Dex</button>
                        <button class="th-tab" data-tab="history">History</button>
                        <button class="th-tab" data-tab="shinies">Shiny Showcase</button>
                        <button class="th-tab" data-tab="stats">Statistics</button>
                    </div>
                </div>

                <!-- Living Dex Tab -->
                <div class="th-content active" id="living-dex-content">
                    <div class="living-dex-stats">
                        <div class="ld-stat-card">
                            <div class="ld-stat-value" id="ld-total-owned">0</div>
                            <div class="ld-stat-label">Pokemon Owned</div>
                        </div>
                        <div class="ld-stat-card">
                            <div class="ld-stat-value" id="ld-total-shinies">0</div>
                            <div class="ld-stat-label">Shinies Collected</div>
                        </div>
                        <div class="ld-stat-card">
                            <div class="ld-stat-value" id="ld-completion">0%</div>
                            <div class="ld-stat-label">Dex Completion</div>
                        </div>
                        <div class="ld-stat-card">
                            <div class="ld-stat-value" id="ld-total-trades">0</div>
                            <div class="ld-stat-label">Total Trades</div>
                        </div>
                    </div>

                    <div class="ld-progress-container">
                        <div class="ld-progress-header">
                            <span class="ld-progress-title">Overall Progress</span>
                            <span class="ld-progress-percent" id="ld-progress-percent">0 / ${this.totalPokemon}</span>
                        </div>
                        <div class="ld-progress-bar">
                            <div class="ld-progress-fill" id="ld-progress-fill" style="width: 0%;"></div>
                        </div>
                    </div>

                    <div class="ld-gen-grid" id="ld-gen-grid"></div>
                </div>

                <!-- Trade History Tab -->
                <div class="th-content" id="history-content">
                    <div class="th-search-add">
                        <input type="text" class="th-search-input" id="th-add-pokemon" placeholder="Add Pokemon (e.g., Pikachu)">
                        <label class="th-add-shiny-checkbox">
                            <input type="checkbox" id="th-add-shiny">
                            <i class="fas fa-star"></i> Shiny
                        </label>
                        <button class="th-add-btn" id="th-add-btn">
                            <i class="fas fa-plus"></i> Add to Collection
                        </button>
                    </div>
                    <div class="th-history-list" id="th-history-list">
                        <div class="th-empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>No trade history yet.<br>Start trading to track your collection!</p>
                        </div>
                    </div>
                </div>

                <!-- Shiny Showcase Tab -->
                <div class="th-content" id="shinies-content">
                    <div class="shiny-showcase" id="shiny-showcase">
                        <div class="th-empty-state">
                            <i class="fas fa-star"></i>
                            <p>No shinies yet!<br>Trade some shiny Pokemon to show them off here.</p>
                        </div>
                    </div>
                </div>

                <!-- Statistics Tab -->
                <div class="th-content" id="stats-content">
                    <div class="th-stats-grid">
                        <div class="th-stats-card">
                            <h4 class="th-stats-title"><i class="fas fa-chart-pie"></i> Trade Summary</h4>
                            <ul class="th-stats-list">
                                <li><span class="label">Total Trades</span><span class="value" id="stat-total-trades">0</span></li>
                                <li><span class="label">Unique Pokemon</span><span class="value" id="stat-unique">0</span></li>
                                <li><span class="label">Shiny Pokemon</span><span class="value" id="stat-shinies">0</span></li>
                                <li><span class="label">Legendary</span><span class="value" id="stat-legendary">0</span></li>
                                <li><span class="label">This Week</span><span class="value" id="stat-week">0</span></li>
                            </ul>
                        </div>
                        <div class="th-stats-card">
                            <h4 class="th-stats-title"><i class="fas fa-trophy"></i> Achievements</h4>
                            <ul class="th-stats-list">
                                <li><span class="label">First Trade</span><span class="value" id="stat-first-trade">--</span></li>
                                <li><span class="label">Rarest Pokemon</span><span class="value" id="stat-rarest">--</span></li>
                                <li><span class="label">Favorite Type</span><span class="value" id="stat-fav-type">--</span></li>
                                <li><span class="label">Shiny Rate</span><span class="value" id="stat-shiny-rate">0%</span></li>
                            </ul>
                        </div>
                        <div class="th-stats-card" style="grid-column: span 2;">
                            <h4 class="th-stats-title"><i class="fas fa-chart-bar"></i> Trades by Day</h4>
                            <div class="th-chart-container" id="trades-chart"></div>
                        </div>
                    </div>
                </div>

                <div class="th-actions">
                    <button class="th-action-btn" id="th-import-btn"><i class="fas fa-upload"></i> Import</button>
                    <button class="th-action-btn" id="th-export-btn"><i class="fas fa-download"></i> Export</button>
                    <button class="th-action-btn" id="th-clear-btn"><i class="fas fa-trash"></i> Clear</button>
                </div>
            </div>

            <!-- Dex Modal -->
            <div class="dex-modal" id="dex-modal">
                <div class="dex-modal-content">
                    <div class="dex-modal-header">
                        <h3 class="dex-modal-title" id="dex-modal-title">Generation 1</h3>
                        <button class="dex-modal-close" id="dex-modal-close">&times;</button>
                    </div>
                    <div class="dex-pokemon-grid" id="dex-pokemon-grid"></div>
                </div>
            </div>
        `;

        // Find insertion point
        const targetSection = document.querySelector('#pkhex-creator-container') ||
                             document.querySelector('.live-trading-section');

        if (targetSection) {
            targetSection.parentNode.insertBefore(container, targetSection.nextSibling);
        } else {
            document.body.appendChild(container);
        }

        this.initGenerationGrid();
        this.updateUI();
    }

    initGenerationGrid() {
        const generations = [
            { gen: 1, name: 'Kanto', start: 1, end: 151 },
            { gen: 2, name: 'Johto', start: 152, end: 251 },
            { gen: 3, name: 'Hoenn', start: 252, end: 386 },
            { gen: 4, name: 'Sinnoh', start: 387, end: 493 },
            { gen: 5, name: 'Unova', start: 494, end: 649 },
            { gen: 6, name: 'Kalos', start: 650, end: 721 },
            { gen: 7, name: 'Alola', start: 722, end: 809 },
            { gen: 8, name: 'Galar', start: 810, end: 905 },
            { gen: 9, name: 'Paldea', start: 906, end: 1025 }
        ];

        const grid = document.getElementById('ld-gen-grid');
        grid.innerHTML = generations.map(gen => {
            const total = gen.end - gen.start + 1;
            const owned = this.countOwnedInRange(gen.start, gen.end);
            const percent = Math.round((owned / total) * 100);

            return `
                <div class="ld-gen-card" data-gen="${gen.gen}" data-start="${gen.start}" data-end="${gen.end}">
                    <div class="ld-gen-number">Gen ${gen.gen}</div>
                    <div class="ld-gen-progress">
                        <div class="ld-gen-fill" style="width: ${percent}%;"></div>
                    </div>
                    <div class="ld-gen-count">${owned} / ${total}</div>
                    <div style="font-size: 0.7rem; color: #666; margin-top: 4px;">${gen.name}</div>
                </div>
            `;
        }).join('');

        // Bind click events
        grid.querySelectorAll('.ld-gen-card').forEach(card => {
            card.addEventListener('click', () => {
                this.openDexModal(
                    parseInt(card.dataset.gen),
                    parseInt(card.dataset.start),
                    parseInt(card.dataset.end)
                );
            });
        });
    }

    countOwnedInRange(start, end) {
        let count = 0;
        for (let i = start; i <= end; i++) {
            if (this.collection[i]) count++;
        }
        return count;
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.th-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.th-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.th-content').forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
            });
        });

        // Add Pokemon
        document.getElementById('th-add-btn')?.addEventListener('click', () => this.addPokemon());
        document.getElementById('th-add-pokemon')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPokemon();
        });

        // Import/Export
        document.getElementById('th-import-btn')?.addEventListener('click', () => this.importCollection());
        document.getElementById('th-export-btn')?.addEventListener('click', () => this.exportCollection());
        document.getElementById('th-clear-btn')?.addEventListener('click', () => this.clearCollection());

        // Dex modal close
        document.getElementById('dex-modal-close')?.addEventListener('click', () => {
            document.getElementById('dex-modal').classList.remove('show');
        });
    }

    async addPokemon() {
        const input = document.getElementById('th-add-pokemon');
        const shinyCheckbox = document.getElementById('th-add-shiny');
        const name = input.value.trim().toLowerCase();

        if (!name) return;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!response.ok) throw new Error('Not found');

            const data = await response.json();
            const isShiny = shinyCheckbox.checked;

            // Add to collection
            this.collection[data.id] = {
                name: data.name,
                sprite: data.sprites.front_default,
                shinySprite: data.sprites.front_shiny,
                types: data.types.map(t => t.type.name),
                addedAt: new Date().toISOString()
            };

            // Add to trade history
            this.trades.unshift({
                id: data.id,
                name: data.name,
                sprite: isShiny ? data.sprites.front_shiny : data.sprites.front_default,
                isShiny,
                timestamp: new Date().toISOString()
            });

            // Add to shinies if shiny
            if (isShiny) {
                const existingShiny = this.shinies.find(s => s.id === data.id);
                if (existingShiny) {
                    existingShiny.count = (existingShiny.count || 1) + 1;
                } else {
                    this.shinies.push({
                        id: data.id,
                        name: data.name,
                        sprite: data.sprites.front_shiny,
                        addedAt: new Date().toISOString(),
                        count: 1
                    });
                }
            }

            this.saveToStorage();
            this.updateUI();

            input.value = '';
            shinyCheckbox.checked = false;

            // Trigger celebration if animations available
            if (window.tradeAnimations) {
                if (isShiny) {
                    window.tradeAnimations.floatingSprite(data.id, true);
                } else {
                    window.tradeAnimations.confetti();
                }
            }

        } catch (error) {
            alert('Pokemon not found. Please check the name and try again.');
        }
    }

    updateUI() {
        this.updateLivingDexStats();
        this.updateHistory();
        this.updateShinyShowcase();
        this.updateStatistics();
    }

    updateLivingDexStats() {
        const totalOwned = Object.keys(this.collection).length;
        const totalShinies = this.shinies.reduce((sum, s) => sum + (s.count || 1), 0);
        const completion = Math.round((totalOwned / this.totalPokemon) * 100);

        document.getElementById('ld-total-owned').textContent = totalOwned;
        document.getElementById('ld-total-shinies').textContent = totalShinies;
        document.getElementById('ld-completion').textContent = `${completion}%`;
        document.getElementById('ld-total-trades').textContent = this.trades.length;

        document.getElementById('ld-progress-percent').textContent = `${totalOwned} / ${this.totalPokemon}`;
        document.getElementById('ld-progress-fill').style.width = `${completion}%`;

        // Update generation cards
        this.initGenerationGrid();
    }

    updateHistory() {
        const listContainer = document.getElementById('th-history-list');

        if (this.trades.length === 0) {
            listContainer.innerHTML = `
                <div class="th-empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No trade history yet.<br>Start trading to track your collection!</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = this.trades.slice(0, 50).map(trade => `
            <div class="th-trade-item">
                <div class="th-trade-sprite ${trade.isShiny ? 'shiny' : ''}">
                    <img src="${trade.sprite}" alt="${trade.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${trade.id}.png'">
                </div>
                <div class="th-trade-info">
                    <div class="th-trade-pokemon">
                        ${trade.name.charAt(0).toUpperCase() + trade.name.slice(1)}
                        ${trade.isShiny ? '<span class="th-trade-shiny-badge"><i class="fas fa-star"></i> SHINY</span>' : ''}
                    </div>
                    <div class="th-trade-meta">#${trade.id}</div>
                </div>
                <div class="th-trade-time">${this.formatTime(trade.timestamp)}</div>
            </div>
        `).join('');
    }

    updateShinyShowcase() {
        const showcase = document.getElementById('shiny-showcase');

        if (this.shinies.length === 0) {
            showcase.innerHTML = `
                <div class="th-empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-star"></i>
                    <p>No shinies yet!<br>Trade some shiny Pokemon to show them off here.</p>
                </div>
            `;
            return;
        }

        showcase.innerHTML = this.shinies.map(shiny => `
            <div class="shiny-card">
                ${shiny.count > 1 ? `<span class="shiny-count-badge">x${shiny.count}</span>` : ''}
                <div class="shiny-sprite">
                    <img src="${shiny.sprite}" alt="${shiny.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${shiny.id}.png'">
                </div>
                <div class="shiny-name">${shiny.name.charAt(0).toUpperCase() + shiny.name.slice(1)}</div>
                <div class="shiny-date">${this.formatDate(shiny.addedAt)}</div>
            </div>
        `).join('');
    }

    updateStatistics() {
        const totalTrades = this.trades.length;
        const uniquePokemon = Object.keys(this.collection).length;
        const totalShinies = this.shinies.reduce((sum, s) => sum + (s.count || 1), 0);

        // Count this week's trades
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekTrades = this.trades.filter(t => new Date(t.timestamp) > oneWeekAgo).length;

        document.getElementById('stat-total-trades').textContent = totalTrades;
        document.getElementById('stat-unique').textContent = uniquePokemon;
        document.getElementById('stat-shinies').textContent = totalShinies;
        document.getElementById('stat-week').textContent = weekTrades;
        document.getElementById('stat-shiny-rate').textContent = totalTrades > 0
            ? `${Math.round((totalShinies / totalTrades) * 100)}%` : '0%';

        // First trade
        if (this.trades.length > 0) {
            const first = this.trades[this.trades.length - 1];
            document.getElementById('stat-first-trade').textContent = this.formatDate(first.timestamp);
        }

        // Update chart
        this.updateTradesChart();
    }

    updateTradesChart() {
        const chart = document.getElementById('trades-chart');
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayCounts = new Array(7).fill(0);

        // Count trades by day of week
        this.trades.forEach(trade => {
            const day = new Date(trade.timestamp).getDay();
            dayCounts[day]++;
        });

        const max = Math.max(...dayCounts, 1);

        chart.innerHTML = dayCounts.map((count, i) => {
            const height = (count / max) * 150;
            return `<div class="th-chart-bar" style="height: ${height}px;" data-label="${days[i]}" data-value="${count}"></div>`;
        }).join('');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return this.formatDate(timestamp);
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
        });
    }

    async openDexModal(gen, start, end) {
        const modal = document.getElementById('dex-modal');
        const title = document.getElementById('dex-modal-title');
        const grid = document.getElementById('dex-pokemon-grid');

        title.textContent = `Generation ${gen}`;
        modal.classList.add('show');

        // Generate Pokemon slots
        const slots = [];
        for (let i = start; i <= end; i++) {
            const owned = this.collection[i];
            const shinyOwned = this.shinies.find(s => s.id === i);

            slots.push(`
                <div class="dex-pokemon-slot ${owned ? 'owned' : ''} ${shinyOwned ? 'shiny-owned' : ''}" data-id="${i}">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png"
                         alt="#${i}"
                         onerror="this.style.opacity='0.3'">
                    <span class="dex-number">#${i}</span>
                </div>
            `);
        }

        grid.innerHTML = slots.join('');

        // Bind click to add/remove
        grid.querySelectorAll('.dex-pokemon-slot').forEach(slot => {
            slot.addEventListener('click', async () => {
                const id = parseInt(slot.dataset.id);
                if (this.collection[id]) {
                    // Remove from collection
                    delete this.collection[id];
                    slot.classList.remove('owned');
                } else {
                    // Add to collection
                    try {
                        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                        const data = await response.json();

                        this.collection[id] = {
                            name: data.name,
                            sprite: data.sprites.front_default,
                            types: data.types.map(t => t.type.name),
                            addedAt: new Date().toISOString()
                        };

                        slot.classList.add('owned');
                    } catch (e) {
                        console.error('Error adding Pokemon:', e);
                    }
                }

                this.saveToStorage();
                this.updateLivingDexStats();
            });
        });
    }

    exportCollection() {
        const data = {
            collection: this.collection,
            trades: this.trades,
            shinies: this.shinies,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pkm-universe-collection-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importCollection() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);

                    if (data.collection) this.collection = { ...this.collection, ...data.collection };
                    if (data.trades) this.trades = [...data.trades, ...this.trades];
                    if (data.shinies) {
                        data.shinies.forEach(s => {
                            const existing = this.shinies.find(x => x.id === s.id);
                            if (existing) {
                                existing.count = (existing.count || 1) + (s.count || 1);
                            } else {
                                this.shinies.push(s);
                            }
                        });
                    }

                    this.saveToStorage();
                    this.updateUI();
                    alert('Collection imported successfully!');
                } catch (error) {
                    alert('Error importing collection. Please check the file format.');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    clearCollection() {
        if (!confirm('Are you sure you want to clear your entire collection? This cannot be undone.')) return;

        this.collection = {};
        this.trades = [];
        this.shinies = [];
        this.saveToStorage();
        this.updateUI();
    }

    // Public method to add trade from external source
    recordTrade(pokemon, isShiny = false) {
        this.trades.unshift({
            id: pokemon.id,
            name: pokemon.name,
            sprite: isShiny ? pokemon.shinySprite : pokemon.sprite,
            isShiny,
            timestamp: new Date().toISOString()
        });

        if (!this.collection[pokemon.id]) {
            this.collection[pokemon.id] = {
                name: pokemon.name,
                sprite: pokemon.sprite,
                shinySprite: pokemon.shinySprite,
                addedAt: new Date().toISOString()
            };
        }

        if (isShiny) {
            const existingShiny = this.shinies.find(s => s.id === pokemon.id);
            if (existingShiny) {
                existingShiny.count = (existingShiny.count || 1) + 1;
            } else {
                this.shinies.push({
                    id: pokemon.id,
                    name: pokemon.name,
                    sprite: pokemon.shinySprite,
                    addedAt: new Date().toISOString(),
                    count: 1
                });
            }
        }

        this.saveToStorage();
        this.updateUI();
    }
}

// Initialize
window.tradeHistory = new TradeHistory();
