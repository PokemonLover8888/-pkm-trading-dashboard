/**
 * PKM-Universe Advanced PKHeX Creator
 * IV/EV sliders, stat preview, nature selection, Smogon sets
 */

class PKHeXCreator {
    constructor() {
        this.currentPokemon = null;
        this.baseStats = {};
        this.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
        this.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
        this.level = 100;
        this.nature = 'Hardy';
        this.ability = '';
        this.moves = ['', '', '', ''];
        this.heldItem = '';
        this.isShiny = false;
        this.teraType = '';

        this.natures = {
            'Hardy': { plus: null, minus: null },
            'Lonely': { plus: 'atk', minus: 'def' },
            'Brave': { plus: 'atk', minus: 'spe' },
            'Adamant': { plus: 'atk', minus: 'spa' },
            'Naughty': { plus: 'atk', minus: 'spd' },
            'Bold': { plus: 'def', minus: 'atk' },
            'Docile': { plus: null, minus: null },
            'Relaxed': { plus: 'def', minus: 'spe' },
            'Impish': { plus: 'def', minus: 'spa' },
            'Lax': { plus: 'def', minus: 'spd' },
            'Timid': { plus: 'spe', minus: 'atk' },
            'Hasty': { plus: 'spe', minus: 'def' },
            'Serious': { plus: null, minus: null },
            'Jolly': { plus: 'spe', minus: 'spa' },
            'Naive': { plus: 'spe', minus: 'spd' },
            'Modest': { plus: 'spa', minus: 'atk' },
            'Mild': { plus: 'spa', minus: 'def' },
            'Quiet': { plus: 'spa', minus: 'spe' },
            'Bashful': { plus: null, minus: null },
            'Rash': { plus: 'spa', minus: 'spd' },
            'Calm': { plus: 'spd', minus: 'atk' },
            'Gentle': { plus: 'spd', minus: 'def' },
            'Sassy': { plus: 'spd', minus: 'spe' },
            'Careful': { plus: 'spd', minus: 'spa' },
            'Quirky': { plus: null, minus: null }
        };

        this.statNames = {
            hp: 'HP', atk: 'Attack', def: 'Defense',
            spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed'
        };

        this.popularItems = [
            'Choice Band', 'Choice Specs', 'Choice Scarf',
            'Life Orb', 'Leftovers', 'Rocky Helmet',
            'Focus Sash', 'Assault Vest', 'Heavy-Duty Boots',
            'Eviolite', 'Black Sludge', 'Sitrus Berry',
            'Lum Berry', 'Expert Belt', 'Weakness Policy',
            'Air Balloon', 'Loaded Dice', 'Booster Energy',
            'Clear Amulet', 'Covert Cloak', 'Mirror Herb'
        ];

        this.teraTypes = [
            'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
            'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
            'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy', 'Stellar'
        ];

        this.init();
    }

    init() {
        this.injectStyles();
        this.createCreatorUI();
        this.bindEvents();
    }

    injectStyles() {
        if (document.getElementById('pkhex-creator-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'pkhex-creator-styles';
        styles.textContent = `
            .pkhex-creator {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 30px;
                margin: 20px 0;
                border: 2px solid #00d4ff;
                box-shadow: 0 10px 40px rgba(0, 212, 255, 0.2);
            }

            .pkhex-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                flex-wrap: wrap;
                gap: 15px;
            }

            .pkhex-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.8rem;
                color: #00d4ff;
                text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
                margin: 0;
            }

            .pkhex-search-container {
                display: flex;
                gap: 10px;
                flex: 1;
                max-width: 400px;
            }

            .pkhex-search {
                flex: 1;
                padding: 12px 20px;
                border-radius: 25px;
                border: 2px solid #333;
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .pkhex-search:focus {
                outline: none;
                border-color: #00d4ff;
                box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
            }

            .pkhex-load-btn {
                padding: 12px 25px;
                border-radius: 25px;
                border: none;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                color: #000;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .pkhex-load-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 20px rgba(0, 212, 255, 0.4);
            }

            .pkhex-main {
                display: grid;
                grid-template-columns: 300px 1fr 300px;
                gap: 30px;
            }

            @media (max-width: 1200px) {
                .pkhex-main {
                    grid-template-columns: 1fr;
                }
            }

            .pkhex-preview {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 20px;
                text-align: center;
            }

            .pkhex-sprite {
                width: 200px;
                height: 200px;
                margin: 0 auto;
                position: relative;
            }

            .pkhex-sprite img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.5));
                transition: all 0.3s ease;
            }

            .pkhex-sprite.shiny img {
                filter: drop-shadow(0 0 20px gold) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.5));
            }

            .pkhex-sprite-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 4rem;
            }

            .pkhex-pokemon-name {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
                color: #fff;
                margin: 15px 0 5px;
            }

            .pkhex-pokemon-types {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-bottom: 15px;
            }

            .pkhex-type-badge {
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 0.75rem;
                font-weight: bold;
                text-transform: uppercase;
            }

            .pkhex-shiny-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-top: 15px;
            }

            .pkhex-toggle-switch {
                width: 50px;
                height: 26px;
                background: #333;
                border-radius: 13px;
                position: relative;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            .pkhex-toggle-switch.active {
                background: linear-gradient(135deg, #ffd700, #ff8c00);
            }

            .pkhex-toggle-switch::after {
                content: '';
                position: absolute;
                width: 22px;
                height: 22px;
                background: #fff;
                border-radius: 50%;
                top: 2px;
                left: 2px;
                transition: transform 0.3s ease;
            }

            .pkhex-toggle-switch.active::after {
                transform: translateX(24px);
            }

            .pkhex-stats-section {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 25px;
            }

            .pkhex-section-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.1rem;
                color: #00d4ff;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .pkhex-stat-row {
                margin-bottom: 15px;
            }

            .pkhex-stat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .pkhex-stat-name {
                font-weight: bold;
                color: #fff;
                font-size: 0.9rem;
            }

            .pkhex-stat-name.boosted {
                color: #ff6b6b;
            }

            .pkhex-stat-name.reduced {
                color: #4ecdc4;
            }

            .pkhex-stat-values {
                display: flex;
                gap: 15px;
                font-size: 0.85rem;
                color: #888;
            }

            .pkhex-stat-values span {
                min-width: 60px;
            }

            .pkhex-stat-final {
                color: #ffd700 !important;
                font-weight: bold;
            }

            .pkhex-slider-container {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .pkhex-slider-group {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .pkhex-slider-label {
                font-size: 0.75rem;
                color: #666;
                text-align: center;
            }

            .pkhex-slider {
                -webkit-appearance: none;
                width: 100%;
                height: 8px;
                border-radius: 4px;
                outline: none;
                cursor: pointer;
            }

            .pkhex-slider.iv-slider {
                background: linear-gradient(to right, #ff6b6b, #ffd700, #4ecdc4);
            }

            .pkhex-slider.ev-slider {
                background: linear-gradient(to right, #333, #00d4ff);
            }

            .pkhex-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #fff;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }

            .pkhex-slider-value {
                min-width: 35px;
                text-align: center;
                font-weight: bold;
                color: #fff;
                font-size: 0.9rem;
            }

            .pkhex-stat-bar {
                height: 6px;
                background: #222;
                border-radius: 3px;
                overflow: hidden;
                margin-top: 8px;
            }

            .pkhex-stat-bar-fill {
                height: 100%;
                border-radius: 3px;
                transition: width 0.3s ease;
            }

            .pkhex-ev-total {
                text-align: center;
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                margin-top: 15px;
            }

            .pkhex-ev-total-bar {
                height: 10px;
                background: #222;
                border-radius: 5px;
                overflow: hidden;
                margin-top: 8px;
            }

            .pkhex-ev-total-fill {
                height: 100%;
                background: linear-gradient(90deg, #4ecdc4, #00d4ff);
                border-radius: 5px;
                transition: width 0.3s ease;
            }

            .pkhex-ev-total-fill.over {
                background: linear-gradient(90deg, #ff6b6b, #ff4444);
            }

            .pkhex-config-section {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 25px;
            }

            .pkhex-form-group {
                margin-bottom: 20px;
            }

            .pkhex-form-label {
                display: block;
                color: #888;
                font-size: 0.85rem;
                margin-bottom: 8px;
            }

            .pkhex-select, .pkhex-input {
                width: 100%;
                padding: 10px 15px;
                border-radius: 10px;
                border: 2px solid #333;
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                font-size: 0.95rem;
                transition: all 0.3s ease;
            }

            .pkhex-select:focus, .pkhex-input:focus {
                outline: none;
                border-color: #00d4ff;
            }

            .pkhex-select option {
                background: #1a1a2e;
                color: #fff;
            }

            .pkhex-moves-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .pkhex-move-slot {
                position: relative;
            }

            .pkhex-move-slot input {
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: 2px solid #333;
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                font-size: 0.85rem;
            }

            .pkhex-move-slot input:focus {
                outline: none;
                border-color: #00d4ff;
            }

            .pkhex-smogon-sets {
                margin-top: 20px;
            }

            .pkhex-smogon-btn {
                width: 100%;
                padding: 12px;
                border-radius: 10px;
                border: 2px solid #ff6b6b;
                background: transparent;
                color: #ff6b6b;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 10px;
            }

            .pkhex-smogon-btn:hover {
                background: #ff6b6b;
                color: #000;
            }

            .pkhex-smogon-sets-list {
                max-height: 200px;
                overflow-y: auto;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                display: none;
            }

            .pkhex-smogon-sets-list.show {
                display: block;
            }

            .pkhex-smogon-set {
                padding: 12px 15px;
                border-bottom: 1px solid #333;
                cursor: pointer;
                transition: background 0.2s ease;
            }

            .pkhex-smogon-set:last-child {
                border-bottom: none;
            }

            .pkhex-smogon-set:hover {
                background: rgba(0, 212, 255, 0.1);
            }

            .pkhex-smogon-set-name {
                font-weight: bold;
                color: #fff;
                margin-bottom: 4px;
            }

            .pkhex-smogon-set-desc {
                font-size: 0.8rem;
                color: #888;
            }

            .pkhex-actions {
                display: flex;
                gap: 10px;
                margin-top: 25px;
                flex-wrap: wrap;
            }

            .pkhex-action-btn {
                flex: 1;
                min-width: 120px;
                padding: 15px 20px;
                border-radius: 12px;
                border: none;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.95rem;
            }

            .pkhex-action-btn.primary {
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                color: #000;
            }

            .pkhex-action-btn.secondary {
                background: linear-gradient(135deg, #4ecdc4, #2ecc71);
                color: #000;
            }

            .pkhex-action-btn.export {
                background: linear-gradient(135deg, #9b59b6, #8e44ad);
                color: #fff;
            }

            .pkhex-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }

            .pkhex-legality {
                margin-top: 20px;
                padding: 15px;
                border-radius: 12px;
                display: none;
            }

            .pkhex-legality.show {
                display: block;
            }

            .pkhex-legality.legal {
                background: rgba(46, 204, 113, 0.2);
                border: 2px solid #2ecc71;
            }

            .pkhex-legality.illegal {
                background: rgba(231, 76, 60, 0.2);
                border: 2px solid #e74c3c;
            }

            .pkhex-legality-title {
                font-weight: bold;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .pkhex-legality.legal .pkhex-legality-title {
                color: #2ecc71;
            }

            .pkhex-legality.illegal .pkhex-legality-title {
                color: #e74c3c;
            }

            .pkhex-legality-issues {
                font-size: 0.85rem;
                color: #ccc;
            }

            .pkhex-legality-issues li {
                margin-bottom: 5px;
            }

            /* Type colors */
            .type-normal { background: #A8A878; color: #fff; }
            .type-fire { background: #F08030; color: #fff; }
            .type-water { background: #6890F0; color: #fff; }
            .type-electric { background: #F8D030; color: #000; }
            .type-grass { background: #78C850; color: #fff; }
            .type-ice { background: #98D8D8; color: #000; }
            .type-fighting { background: #C03028; color: #fff; }
            .type-poison { background: #A040A0; color: #fff; }
            .type-ground { background: #E0C068; color: #000; }
            .type-flying { background: #A890F0; color: #fff; }
            .type-psychic { background: #F85888; color: #fff; }
            .type-bug { background: #A8B820; color: #fff; }
            .type-rock { background: #B8A038; color: #fff; }
            .type-ghost { background: #705898; color: #fff; }
            .type-dragon { background: #7038F8; color: #fff; }
            .type-dark { background: #705848; color: #fff; }
            .type-steel { background: #B8B8D0; color: #000; }
            .type-fairy { background: #EE99AC; color: #000; }
            .type-stellar { background: linear-gradient(135deg, #ff6b6b, #ffd700, #4ecdc4, #9b59b6); color: #fff; }

            /* Stat bar colors */
            .stat-hp { background: linear-gradient(90deg, #ff5959, #ff8080); }
            .stat-atk { background: linear-gradient(90deg, #f5ac78, #f8c8a8); }
            .stat-def { background: linear-gradient(90deg, #fae078, #fcec9c); }
            .stat-spa { background: linear-gradient(90deg, #9db7f5, #bdd0f8); }
            .stat-spd { background: linear-gradient(90deg, #a7db8d, #c6e8b3); }
            .stat-spe { background: linear-gradient(90deg, #fa92b2, #fbb8cc); }

            .pkhex-quick-evs {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 10px;
            }

            .pkhex-quick-ev-btn {
                padding: 6px 12px;
                border-radius: 15px;
                border: 1px solid #444;
                background: transparent;
                color: #888;
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .pkhex-quick-ev-btn:hover {
                border-color: #00d4ff;
                color: #00d4ff;
            }

            .pkhex-level-input {
                width: 80px;
                text-align: center;
            }

            .pkhex-tera-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
                gap: 8px;
                margin-top: 10px;
            }

            .pkhex-tera-btn {
                padding: 8px;
                border-radius: 8px;
                border: 2px solid transparent;
                font-size: 0.7rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: uppercase;
            }

            .pkhex-tera-btn.selected {
                border-color: #fff;
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(styles);
    }

    createCreatorUI() {
        const container = document.createElement('div');
        container.id = 'pkhex-creator-container';
        container.innerHTML = `
            <div class="pkhex-creator">
                <div class="pkhex-header">
                    <h2 class="pkhex-title"><i class="fas fa-magic"></i> Advanced Pokemon Creator</h2>
                    <div class="pkhex-search-container">
                        <input type="text" class="pkhex-search" id="pkhex-pokemon-search" placeholder="Enter Pokemon name...">
                        <button class="pkhex-load-btn" id="pkhex-load-btn">Load</button>
                    </div>
                </div>

                <div class="pkhex-main">
                    <!-- Left: Pokemon Preview -->
                    <div class="pkhex-preview">
                        <div class="pkhex-sprite" id="pkhex-sprite">
                            <div class="pkhex-sprite-placeholder">
                                <i class="fas fa-question"></i>
                            </div>
                        </div>
                        <h3 class="pkhex-pokemon-name" id="pkhex-pokemon-name">Select a Pokemon</h3>
                        <div class="pkhex-pokemon-types" id="pkhex-pokemon-types"></div>

                        <div class="pkhex-shiny-toggle">
                            <span>Shiny</span>
                            <div class="pkhex-toggle-switch" id="pkhex-shiny-toggle"></div>
                            <i class="fas fa-star" style="color: #ffd700;"></i>
                        </div>

                        <div class="pkhex-form-group" style="margin-top: 20px;">
                            <label class="pkhex-form-label">Level</label>
                            <input type="number" class="pkhex-input pkhex-level-input" id="pkhex-level" value="100" min="1" max="100" style="width: 100%;">
                        </div>

                        <div class="pkhex-form-group">
                            <label class="pkhex-form-label">Tera Type</label>
                            <div class="pkhex-tera-grid" id="pkhex-tera-grid"></div>
                        </div>
                    </div>

                    <!-- Center: Stats -->
                    <div class="pkhex-stats-section">
                        <h3 class="pkhex-section-title">
                            <i class="fas fa-chart-bar"></i> Stats Configuration
                        </h3>

                        <div id="pkhex-stats-container">
                            ${this.createStatRows()}
                        </div>

                        <div class="pkhex-ev-total">
                            <span>EV Total: <strong id="pkhex-ev-total-value">0</strong> / 510</span>
                            <div class="pkhex-ev-total-bar">
                                <div class="pkhex-ev-total-fill" id="pkhex-ev-total-fill" style="width: 0%;"></div>
                            </div>
                        </div>

                        <div class="pkhex-quick-evs">
                            <button class="pkhex-quick-ev-btn" data-spread="physical">Physical Sweeper</button>
                            <button class="pkhex-quick-ev-btn" data-spread="special">Special Sweeper</button>
                            <button class="pkhex-quick-ev-btn" data-spread="tank">Physical Tank</button>
                            <button class="pkhex-quick-ev-btn" data-spread="spdef">Special Tank</button>
                            <button class="pkhex-quick-ev-btn" data-spread="balanced">Balanced</button>
                            <button class="pkhex-quick-ev-btn" data-spread="clear">Clear EVs</button>
                        </div>

                        <div class="pkhex-legality" id="pkhex-legality">
                            <div class="pkhex-legality-title">
                                <i class="fas fa-check-circle"></i>
                                <span id="pkhex-legality-status">Legal</span>
                            </div>
                            <ul class="pkhex-legality-issues" id="pkhex-legality-issues"></ul>
                        </div>
                    </div>

                    <!-- Right: Configuration -->
                    <div class="pkhex-config-section">
                        <h3 class="pkhex-section-title">
                            <i class="fas fa-cog"></i> Configuration
                        </h3>

                        <div class="pkhex-form-group">
                            <label class="pkhex-form-label">Nature</label>
                            <select class="pkhex-select" id="pkhex-nature">
                                ${Object.keys(this.natures).map(n => `<option value="${n}">${n}</option>`).join('')}
                            </select>
                        </div>

                        <div class="pkhex-form-group">
                            <label class="pkhex-form-label">Ability</label>
                            <select class="pkhex-select" id="pkhex-ability">
                                <option value="">Select ability...</option>
                            </select>
                        </div>

                        <div class="pkhex-form-group">
                            <label class="pkhex-form-label">Held Item</label>
                            <select class="pkhex-select" id="pkhex-item">
                                <option value="">None</option>
                                ${this.popularItems.map(i => `<option value="${i}">${i}</option>`).join('')}
                            </select>
                        </div>

                        <div class="pkhex-form-group">
                            <label class="pkhex-form-label">Moves</label>
                            <div class="pkhex-moves-grid">
                                <div class="pkhex-move-slot"><input type="text" id="pkhex-move-1" placeholder="Move 1"></div>
                                <div class="pkhex-move-slot"><input type="text" id="pkhex-move-2" placeholder="Move 2"></div>
                                <div class="pkhex-move-slot"><input type="text" id="pkhex-move-3" placeholder="Move 3"></div>
                                <div class="pkhex-move-slot"><input type="text" id="pkhex-move-4" placeholder="Move 4"></div>
                            </div>
                        </div>

                        <div class="pkhex-smogon-sets">
                            <button class="pkhex-smogon-btn" id="pkhex-smogon-btn">
                                <i class="fas fa-bolt"></i> Load Smogon Sets
                            </button>
                            <div class="pkhex-smogon-sets-list" id="pkhex-smogon-list"></div>
                        </div>

                        <div class="pkhex-actions">
                            <button class="pkhex-action-btn primary" id="pkhex-generate">
                                <i class="fas fa-file-code"></i> Generate
                            </button>
                            <button class="pkhex-action-btn secondary" id="pkhex-trade">
                                <i class="fas fa-exchange-alt"></i> Trade
                            </button>
                            <button class="pkhex-action-btn export" id="pkhex-export">
                                <i class="fas fa-download"></i> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Find insertion point
        const targetSection = document.querySelector('.pkhex-section') ||
                             document.querySelector('#pokemon-creator') ||
                             document.querySelector('.live-trading-section');

        if (targetSection) {
            targetSection.parentNode.insertBefore(container, targetSection.nextSibling);
        } else {
            document.body.appendChild(container);
        }

        // Initialize tera type buttons
        this.initTeraButtons();
    }

    createStatRows() {
        const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
        return stats.map(stat => `
            <div class="pkhex-stat-row" data-stat="${stat}">
                <div class="pkhex-stat-header">
                    <span class="pkhex-stat-name">${this.statNames[stat]}</span>
                    <div class="pkhex-stat-values">
                        <span>Base: <span class="base-value">--</span></span>
                        <span class="pkhex-stat-final">Final: <span class="final-value">--</span></span>
                    </div>
                </div>
                <div class="pkhex-slider-container">
                    <div class="pkhex-slider-group">
                        <span class="pkhex-slider-label">IV</span>
                        <input type="range" class="pkhex-slider iv-slider" data-stat="${stat}" data-type="iv" min="0" max="31" value="31">
                    </div>
                    <span class="pkhex-slider-value iv-value">31</span>
                    <div class="pkhex-slider-group">
                        <span class="pkhex-slider-label">EV</span>
                        <input type="range" class="pkhex-slider ev-slider" data-stat="${stat}" data-type="ev" min="0" max="252" value="0">
                    </div>
                    <span class="pkhex-slider-value ev-value">0</span>
                </div>
                <div class="pkhex-stat-bar">
                    <div class="pkhex-stat-bar-fill stat-${stat}" style="width: 0%;"></div>
                </div>
            </div>
        `).join('');
    }

    initTeraButtons() {
        const grid = document.getElementById('pkhex-tera-grid');
        if (!grid) return;

        grid.innerHTML = this.teraTypes.map(type => `
            <button class="pkhex-tera-btn type-${type.toLowerCase()}" data-tera="${type}">${type}</button>
        `).join('');

        grid.querySelectorAll('.pkhex-tera-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                grid.querySelectorAll('.pkhex-tera-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.teraType = btn.dataset.tera;
            });
        });
    }

    bindEvents() {
        // Search and load
        document.getElementById('pkhex-load-btn')?.addEventListener('click', () => this.loadPokemon());
        document.getElementById('pkhex-pokemon-search')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadPokemon();
        });

        // Shiny toggle
        document.getElementById('pkhex-shiny-toggle')?.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('active');
            this.isShiny = e.currentTarget.classList.contains('active');
            this.updateSprite();
        });

        // Level change
        document.getElementById('pkhex-level')?.addEventListener('change', (e) => {
            this.level = Math.min(100, Math.max(1, parseInt(e.target.value) || 100));
            e.target.value = this.level;
            this.updateStats();
        });

        // Nature change
        document.getElementById('pkhex-nature')?.addEventListener('change', (e) => {
            this.nature = e.target.value;
            this.updateNatureHighlights();
            this.updateStats();
        });

        // IV/EV sliders
        document.querySelectorAll('.pkhex-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const stat = e.target.dataset.stat;
                const type = e.target.dataset.type;
                const value = parseInt(e.target.value);

                if (type === 'iv') {
                    this.ivs[stat] = value;
                    e.target.closest('.pkhex-stat-row').querySelector('.iv-value').textContent = value;
                } else {
                    // Check EV total
                    const currentTotal = Object.values(this.evs).reduce((a, b) => a + b, 0);
                    const oldValue = this.evs[stat];
                    const newTotal = currentTotal - oldValue + value;

                    if (newTotal <= 510) {
                        this.evs[stat] = value;
                        e.target.closest('.pkhex-stat-row').querySelector('.ev-value').textContent = value;
                    } else {
                        // Cap at max available
                        const maxAllowed = 510 - (currentTotal - oldValue);
                        this.evs[stat] = maxAllowed;
                        e.target.value = maxAllowed;
                        e.target.closest('.pkhex-stat-row').querySelector('.ev-value').textContent = maxAllowed;
                    }
                }

                this.updateStats();
                this.updateEVTotal();
            });
        });

        // Quick EV spreads
        document.querySelectorAll('.pkhex-quick-ev-btn').forEach(btn => {
            btn.addEventListener('click', () => this.applyEVSpread(btn.dataset.spread));
        });

        // Smogon sets
        document.getElementById('pkhex-smogon-btn')?.addEventListener('click', () => this.loadSmogonSets());

        // Action buttons
        document.getElementById('pkhex-generate')?.addEventListener('click', () => this.generateShowdown());
        document.getElementById('pkhex-trade')?.addEventListener('click', () => this.startTrade());
        document.getElementById('pkhex-export')?.addEventListener('click', () => this.exportPokemon());
    }

    async loadPokemon() {
        const search = document.getElementById('pkhex-pokemon-search')?.value.trim().toLowerCase();
        if (!search) return;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);
            if (!response.ok) throw new Error('Pokemon not found');

            const data = await response.json();
            this.currentPokemon = data;

            // Store base stats
            this.baseStats = {};
            data.stats.forEach(s => {
                const statMap = {
                    'hp': 'hp', 'attack': 'atk', 'defense': 'def',
                    'special-attack': 'spa', 'special-defense': 'spd', 'speed': 'spe'
                };
                this.baseStats[statMap[s.stat.name]] = s.base_stat;
            });

            // Update UI
            this.updateSprite();
            document.getElementById('pkhex-pokemon-name').textContent =
                data.name.charAt(0).toUpperCase() + data.name.slice(1);

            // Types
            const typesContainer = document.getElementById('pkhex-pokemon-types');
            typesContainer.innerHTML = data.types.map(t =>
                `<span class="pkhex-type-badge type-${t.type.name}">${t.type.name}</span>`
            ).join('');

            // Abilities
            const abilitySelect = document.getElementById('pkhex-ability');
            abilitySelect.innerHTML = data.abilities.map(a =>
                `<option value="${a.ability.name}"${a.is_hidden ? ' data-hidden="true"' : ''}>
                    ${a.ability.name.replace(/-/g, ' ')}${a.is_hidden ? ' (HA)' : ''}
                </option>`
            ).join('');
            this.ability = data.abilities[0]?.ability.name || '';

            this.updateStats();
            this.checkLegality();

        } catch (error) {
            console.error('Error loading Pokemon:', error);
            alert('Pokemon not found. Please check the name and try again.');
        }
    }

    updateSprite() {
        if (!this.currentPokemon) return;

        const spriteContainer = document.getElementById('pkhex-sprite');
        const spriteUrl = this.isShiny
            ? this.currentPokemon.sprites.other['official-artwork'].front_shiny ||
              this.currentPokemon.sprites.front_shiny
            : this.currentPokemon.sprites.other['official-artwork'].front_default ||
              this.currentPokemon.sprites.front_default;

        spriteContainer.innerHTML = `<img src="${spriteUrl}" alt="${this.currentPokemon.name}">`;
        spriteContainer.classList.toggle('shiny', this.isShiny);
    }

    updateStats() {
        const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
        const natureEffect = this.natures[this.nature];

        stats.forEach(stat => {
            const row = document.querySelector(`.pkhex-stat-row[data-stat="${stat}"]`);
            if (!row) return;

            const baseStat = this.baseStats[stat] || 0;
            row.querySelector('.base-value').textContent = baseStat;

            // Calculate final stat
            let finalStat;
            if (stat === 'hp') {
                finalStat = Math.floor(((2 * baseStat + this.ivs[stat] + Math.floor(this.evs[stat] / 4)) * this.level) / 100) + this.level + 10;
            } else {
                let natureMod = 1;
                if (natureEffect.plus === stat) natureMod = 1.1;
                if (natureEffect.minus === stat) natureMod = 0.9;

                finalStat = Math.floor((Math.floor(((2 * baseStat + this.ivs[stat] + Math.floor(this.evs[stat] / 4)) * this.level) / 100) + 5) * natureMod);
            }

            row.querySelector('.final-value').textContent = finalStat;

            // Update stat bar (max stat ~700 for level 100)
            const maxStat = 700;
            const percentage = Math.min(100, (finalStat / maxStat) * 100);
            row.querySelector('.pkhex-stat-bar-fill').style.width = `${percentage}%`;
        });
    }

    updateNatureHighlights() {
        const natureEffect = this.natures[this.nature];

        document.querySelectorAll('.pkhex-stat-name').forEach(el => {
            el.classList.remove('boosted', 'reduced');
        });

        if (natureEffect.plus) {
            const plusRow = document.querySelector(`.pkhex-stat-row[data-stat="${natureEffect.plus}"] .pkhex-stat-name`);
            if (plusRow) plusRow.classList.add('boosted');
        }
        if (natureEffect.minus) {
            const minusRow = document.querySelector(`.pkhex-stat-row[data-stat="${natureEffect.minus}"] .pkhex-stat-name`);
            if (minusRow) minusRow.classList.add('reduced');
        }
    }

    updateEVTotal() {
        const total = Object.values(this.evs).reduce((a, b) => a + b, 0);
        document.getElementById('pkhex-ev-total-value').textContent = total;

        const fill = document.getElementById('pkhex-ev-total-fill');
        fill.style.width = `${(total / 510) * 100}%`;
        fill.classList.toggle('over', total > 510);
    }

    applyEVSpread(spread) {
        const spreads = {
            physical: { hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252 },
            special: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
            tank: { hp: 252, atk: 0, def: 252, spa: 0, spd: 4, spe: 0 },
            spdef: { hp: 252, atk: 0, def: 4, spa: 0, spd: 252, spe: 0 },
            balanced: { hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
            clear: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
        };

        if (spreads[spread]) {
            this.evs = { ...spreads[spread] };

            // Update sliders
            Object.entries(this.evs).forEach(([stat, value]) => {
                const slider = document.querySelector(`.ev-slider[data-stat="${stat}"]`);
                if (slider) {
                    slider.value = value;
                    slider.closest('.pkhex-stat-row').querySelector('.ev-value').textContent = value;
                }
            });

            this.updateStats();
            this.updateEVTotal();
        }
    }

    async loadSmogonSets() {
        if (!this.currentPokemon) {
            alert('Please load a Pokemon first!');
            return;
        }

        const listContainer = document.getElementById('pkhex-smogon-list');
        listContainer.classList.toggle('show');

        if (listContainer.classList.contains('show')) {
            // Sample competitive sets (in real implementation, would fetch from Smogon API)
            const sampleSets = this.getSmogonSets(this.currentPokemon.name);

            listContainer.innerHTML = sampleSets.map((set, i) => `
                <div class="pkhex-smogon-set" data-index="${i}">
                    <div class="pkhex-smogon-set-name">${set.name}</div>
                    <div class="pkhex-smogon-set-desc">${set.item} | ${set.nature}</div>
                </div>
            `).join('');

            listContainer.querySelectorAll('.pkhex-smogon-set').forEach((el, i) => {
                el.addEventListener('click', () => this.applySmogonSet(sampleSets[i]));
            });
        }
    }

    getSmogonSets(pokemonName) {
        // Common competitive sets - would be replaced with API data
        const genericSets = [
            {
                name: 'Offensive Set',
                item: 'Life Orb',
                nature: 'Jolly',
                evs: { hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252 },
                moves: ['', '', '', '']
            },
            {
                name: 'Special Attacker',
                item: 'Choice Specs',
                nature: 'Timid',
                evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
                moves: ['', '', '', '']
            },
            {
                name: 'Bulky Support',
                item: 'Leftovers',
                nature: 'Bold',
                evs: { hp: 252, atk: 0, def: 252, spa: 0, spd: 4, spe: 0 },
                moves: ['', '', '', '']
            },
            {
                name: 'Choice Scarf',
                item: 'Choice Scarf',
                nature: 'Adamant',
                evs: { hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252 },
                moves: ['', '', '', '']
            }
        ];

        return genericSets;
    }

    applySmogonSet(set) {
        // Apply nature
        document.getElementById('pkhex-nature').value = set.nature;
        this.nature = set.nature;

        // Apply item
        const itemSelect = document.getElementById('pkhex-item');
        const itemOption = Array.from(itemSelect.options).find(opt => opt.value === set.item);
        if (itemOption) {
            itemSelect.value = set.item;
            this.heldItem = set.item;
        }

        // Apply EVs
        this.evs = { ...set.evs };
        Object.entries(this.evs).forEach(([stat, value]) => {
            const slider = document.querySelector(`.ev-slider[data-stat="${stat}"]`);
            if (slider) {
                slider.value = value;
                slider.closest('.pkhex-stat-row').querySelector('.ev-value').textContent = value;
            }
        });

        // Apply moves
        set.moves.forEach((move, i) => {
            const input = document.getElementById(`pkhex-move-${i + 1}`);
            if (input) input.value = move;
        });

        this.updateNatureHighlights();
        this.updateStats();
        this.updateEVTotal();

        // Hide list
        document.getElementById('pkhex-smogon-list').classList.remove('show');
    }

    checkLegality() {
        const legalityDiv = document.getElementById('pkhex-legality');
        const statusEl = document.getElementById('pkhex-legality-status');
        const issuesList = document.getElementById('pkhex-legality-issues');

        const issues = [];

        // Check EV total
        const evTotal = Object.values(this.evs).reduce((a, b) => a + b, 0);
        if (evTotal > 510) {
            issues.push('EV total exceeds 510');
        }

        // Check individual EV max
        Object.entries(this.evs).forEach(([stat, value]) => {
            if (value > 252) {
                issues.push(`${this.statNames[stat]} EVs exceed 252`);
            }
        });

        // Check IV max
        Object.entries(this.ivs).forEach(([stat, value]) => {
            if (value > 31) {
                issues.push(`${this.statNames[stat]} IVs exceed 31`);
            }
        });

        legalityDiv.classList.add('show');

        if (issues.length === 0) {
            legalityDiv.classList.remove('illegal');
            legalityDiv.classList.add('legal');
            statusEl.textContent = 'Legal';
            issuesList.innerHTML = '<li>All checks passed!</li>';
        } else {
            legalityDiv.classList.remove('legal');
            legalityDiv.classList.add('illegal');
            statusEl.textContent = 'Issues Found';
            issuesList.innerHTML = issues.map(i => `<li>${i}</li>`).join('');
        }
    }

    generateShowdown() {
        if (!this.currentPokemon) {
            alert('Please load a Pokemon first!');
            return;
        }

        const name = this.currentPokemon.name.charAt(0).toUpperCase() + this.currentPokemon.name.slice(1);
        const ability = document.getElementById('pkhex-ability').value.replace(/-/g, ' ');
        const item = document.getElementById('pkhex-item').value;
        const nature = this.nature;

        const evStrings = [];
        Object.entries(this.evs).forEach(([stat, value]) => {
            if (value > 0) {
                evStrings.push(`${value} ${this.statNames[stat]}`);
            }
        });

        const ivStrings = [];
        Object.entries(this.ivs).forEach(([stat, value]) => {
            if (value < 31) {
                ivStrings.push(`${value} ${this.statNames[stat]}`);
            }
        });

        const moves = [
            document.getElementById('pkhex-move-1')?.value,
            document.getElementById('pkhex-move-2')?.value,
            document.getElementById('pkhex-move-3')?.value,
            document.getElementById('pkhex-move-4')?.value
        ].filter(m => m);

        let showdown = `${name}${item ? ` @ ${item}` : ''}\n`;
        showdown += `Ability: ${ability}\n`;
        if (this.teraType) showdown += `Tera Type: ${this.teraType}\n`;
        if (evStrings.length) showdown += `EVs: ${evStrings.join(' / ')}\n`;
        showdown += `${nature} Nature\n`;
        if (ivStrings.length) showdown += `IVs: ${ivStrings.join(' / ')}\n`;
        moves.forEach(m => showdown += `- ${m}\n`);

        // Copy to clipboard
        navigator.clipboard.writeText(showdown).then(() => {
            alert('Showdown format copied to clipboard!');
        }).catch(() => {
            // Show in prompt for manual copy
            prompt('Showdown format:', showdown);
        });
    }

    startTrade() {
        if (!this.currentPokemon) {
            alert('Please load a Pokemon first!');
            return;
        }

        // Generate trade command and copy
        const name = this.currentPokemon.name;
        const shinyPrefix = this.isShiny ? 'Shiny ' : '';

        // Construct the command for the trade bot
        const tradeCommand = `!trade ${shinyPrefix}${name}`;

        navigator.clipboard.writeText(tradeCommand).then(() => {
            alert(`Trade command copied!\n\nPaste this in Discord:\n${tradeCommand}`);
        });
    }

    exportPokemon() {
        if (!this.currentPokemon) {
            alert('Please load a Pokemon first!');
            return;
        }

        const exportData = {
            pokemon: this.currentPokemon.name,
            level: this.level,
            shiny: this.isShiny,
            nature: this.nature,
            ability: document.getElementById('pkhex-ability')?.value,
            item: document.getElementById('pkhex-item')?.value,
            teraType: this.teraType,
            ivs: { ...this.ivs },
            evs: { ...this.evs },
            moves: [
                document.getElementById('pkhex-move-1')?.value,
                document.getElementById('pkhex-move-2')?.value,
                document.getElementById('pkhex-move-3')?.value,
                document.getElementById('pkhex-move-4')?.value
            ].filter(m => m)
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentPokemon.name}_build.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize
window.pkhexCreator = new PKHeXCreator();
