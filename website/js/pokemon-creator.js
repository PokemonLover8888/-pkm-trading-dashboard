/**
 * PKM-Universe Pokemon Creator - Professional Edition
 * Sleek, modern card-based design with premium feel
 */

class PokemonCreator {
    constructor() {
        this.pokemon = {
            species: '',
            speciesId: 0,
            nickname: '',
            game: 'sv',
            level: 100,
            shiny: false,
            gender: 'random',
            heldItem: '',
            pokeball: 'Poke Ball',
            nature: 'Adamant',
            ability: '',
            teraType: 'Normal',
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
            moves: ['', '', '', '']
        };

        this.pokemonCache = null;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createUI();
        this.bindEvents();
        this.loadPokemonList();
    }

    injectStyles() {
        if (document.getElementById('pkm-creator-pro-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'pkm-creator-pro-styles';
        styles.textContent = `
            /* ========================================
               PKM-Universe Creator - Professional
               ======================================== */

            .pkm-creator {
                max-width: 1400px;
                margin: 0 auto;
                padding: 30px 20px;
            }

            /* Main Layout - Two Column */
            .creator-layout {
                display: grid;
                grid-template-columns: 340px 1fr;
                gap: 30px;
                align-items: start;
            }

            /* ===== LEFT SIDEBAR - Preview Card ===== */
            .creator-preview-card {
                background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%);
                border-radius: 24px;
                padding: 30px;
                position: sticky;
                top: 100px;
                border: 1px solid rgba(0, 212, 255, 0.15);
                box-shadow:
                    0 20px 60px rgba(0, 0, 0, 0.5),
                    0 0 40px rgba(0, 212, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05);
            }

            .preview-header {
                text-align: center;
                margin-bottom: 20px;
            }

            .preview-game-badge {
                display: inline-block;
                padding: 6px 16px;
                background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 150, 200, 0.1));
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                color: #00d4ff;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .preview-sprite-area {
                position: relative;
                width: 220px;
                height: 220px;
                margin: 0 auto 25px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .preview-sprite-bg {
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.15) 0%, transparent 60%);
                border-radius: 50%;
                animation: pulse-glow 3s ease-in-out infinite;
            }

            @keyframes pulse-glow {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
            }

            .preview-sprite-ring {
                position: absolute;
                width: 200px;
                height: 200px;
                border: 2px solid rgba(0, 212, 255, 0.2);
                border-radius: 50%;
                animation: rotate-ring 20s linear infinite;
            }

            .preview-sprite-ring::before {
                content: '';
                position: absolute;
                top: -4px;
                left: 50%;
                width: 8px;
                height: 8px;
                background: #00d4ff;
                border-radius: 50%;
                box-shadow: 0 0 10px #00d4ff;
            }

            @keyframes rotate-ring {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .preview-sprite {
                width: 180px;
                height: 180px;
                object-fit: contain;
                filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4));
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                z-index: 1;
            }

            .preview-sprite:hover {
                transform: scale(1.1) translateY(-5px);
            }

            .preview-sprite.shiny {
                filter:
                    drop-shadow(0 0 30px rgba(255, 215, 0, 0.4))
                    drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4));
            }

            .preview-info {
                text-align: center;
            }

            .preview-name {
                font-size: 1.6rem;
                font-weight: 800;
                color: #fff;
                margin-bottom: 4px;
                font-family: 'Orbitron', sans-serif;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }

            .preview-subtitle {
                font-size: 0.85rem;
                color: #666;
                margin-bottom: 15px;
            }

            .preview-badges {
                display: flex;
                justify-content: center;
                gap: 8px;
                flex-wrap: wrap;
                margin-bottom: 20px;
            }

            .preview-tag {
                padding: 5px 12px;
                border-radius: 6px;
                font-size: 0.7rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .preview-tag.shiny-tag {
                background: linear-gradient(135deg, #ffd700, #ff8c00);
                color: #000;
            }

            .preview-tag.level-tag {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .preview-stats-mini {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
            }

            .mini-stat {
                text-align: center;
                padding: 10px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 10px;
            }

            .mini-stat-label {
                font-size: 0.65rem;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 4px;
            }

            .mini-stat-value {
                font-size: 0.9rem;
                font-weight: 600;
                color: #fff;
            }

            /* ===== RIGHT SIDE - Editor Panels ===== */
            .creator-editor {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            /* Panel Base Styles */
            .editor-panel {
                background: linear-gradient(145deg, rgba(26, 26, 46, 0.9) 0%, rgba(15, 15, 26, 0.95) 100%);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.06);
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .editor-panel:hover {
                border-color: rgba(0, 212, 255, 0.15);
            }

            .panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 25px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                cursor: pointer;
            }

            .panel-title-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .panel-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 150, 200, 0.1));
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                color: #00d4ff;
            }

            .panel-title {
                font-size: 1.1rem;
                font-weight: 700;
                color: #fff;
            }

            .panel-subtitle {
                font-size: 0.75rem;
                color: #666;
                margin-top: 2px;
            }

            .panel-toggle {
                width: 28px;
                height: 28px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                transition: all 0.3s ease;
            }

            .editor-panel.open .panel-toggle {
                transform: rotate(180deg);
                color: #00d4ff;
            }

            .panel-content {
                padding: 25px;
                display: none;
            }

            .editor-panel.open .panel-content {
                display: block;
            }

            /* Form Elements */
            .form-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }

            .form-row:last-child {
                margin-bottom: 0;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .form-label {
                font-size: 0.8rem;
                font-weight: 600;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .form-input,
            .form-select {
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 14px 16px;
                color: #fff;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                width: 100%;
            }

            .form-input:focus,
            .form-select:focus {
                outline: none;
                border-color: rgba(0, 212, 255, 0.5);
                box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1);
                background: rgba(0, 0, 0, 0.5);
            }

            .form-input::placeholder {
                color: #555;
            }

            .form-select {
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 16px center;
                padding-right: 40px;
            }

            .form-select option {
                background: #1a1a2e;
                color: #fff;
                padding: 10px;
            }

            /* Pokemon Search */
            .search-wrapper {
                position: relative;
            }

            .search-icon {
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #555;
                pointer-events: none;
            }

            .form-input.search-input {
                padding-left: 45px;
            }

            .search-results {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                right: 0;
                background: rgba(20, 20, 35, 0.98);
                border: 2px solid rgba(0, 212, 255, 0.3);
                border-radius: 16px;
                max-height: 350px;
                overflow-y: auto;
                z-index: 1000;
                display: none;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            }

            .search-results.visible {
                display: block;
            }

            .search-result-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 12px 18px;
                cursor: pointer;
                transition: all 0.2s ease;
                border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            }

            .search-result-item:hover {
                background: rgba(0, 212, 255, 0.1);
            }

            .search-result-item:last-child {
                border-bottom: none;
            }

            .search-result-sprite {
                width: 50px;
                height: 50px;
                object-fit: contain;
            }

            .search-result-name {
                font-weight: 600;
                color: #fff;
            }

            .search-result-id {
                font-size: 0.8rem;
                color: #666;
            }

            /* Toggle Switch */
            .toggle-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 15px 20px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
            }

            .toggle-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .toggle-icon {
                font-size: 1.3rem;
            }

            .toggle-text {
                font-weight: 600;
                color: #fff;
            }

            .toggle-switch {
                position: relative;
                width: 56px;
                height: 30px;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                transition: all 0.3s ease;
            }

            .toggle-slider::before {
                position: absolute;
                content: "";
                height: 22px;
                width: 22px;
                left: 4px;
                bottom: 4px;
                background: #fff;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }

            .toggle-switch input:checked + .toggle-slider {
                background: linear-gradient(135deg, #ffd700, #ff8c00);
            }

            .toggle-switch input:checked + .toggle-slider::before {
                transform: translateX(26px);
            }

            /* Stats Section */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 15px;
            }

            .stat-card {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
                padding: 20px 15px;
                text-align: center;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }

            .stat-card:hover {
                border-color: var(--stat-color);
                background: rgba(0, 0, 0, 0.4);
            }

            .stat-name {
                font-size: 0.7rem;
                font-weight: 700;
                color: var(--stat-color);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 12px;
            }

            .stat-bar-container {
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                margin-bottom: 15px;
                overflow: hidden;
            }

            .stat-bar-fill {
                height: 100%;
                background: var(--stat-color);
                border-radius: 4px;
                transition: width 0.3s ease;
            }

            .stat-inputs-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .stat-input-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .stat-input-label {
                font-size: 0.65rem;
                color: #666;
                width: 20px;
            }

            .stat-input {
                flex: 1;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 8px;
                color: #fff;
                text-align: center;
                font-size: 0.9rem;
                font-weight: 600;
                width: 100%;
            }

            .stat-input:focus {
                outline: none;
                border-color: var(--stat-color);
            }

            .stats-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                flex-wrap: wrap;
            }

            .stat-action-btn {
                padding: 10px 18px;
                background: rgba(0, 212, 255, 0.1);
                border: 1px solid rgba(0, 212, 255, 0.2);
                border-radius: 10px;
                color: #00d4ff;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .stat-action-btn:hover {
                background: rgba(0, 212, 255, 0.2);
                transform: translateY(-2px);
            }

            .ev-total-display {
                margin-top: 20px;
                padding: 15px 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .ev-total-text {
                font-size: 0.85rem;
                color: #888;
            }

            .ev-total-value {
                font-size: 1.1rem;
                font-weight: 700;
                color: #00d4ff;
            }

            .ev-total-value.over {
                color: #ff4444;
            }

            .ev-total-bar {
                flex: 1;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                margin: 0 20px;
                overflow: hidden;
            }

            .ev-total-fill {
                height: 100%;
                background: linear-gradient(90deg, #00d4ff, #00ff88);
                border-radius: 3px;
                transition: width 0.3s ease;
            }

            .ev-total-fill.over {
                background: linear-gradient(90deg, #ff4444, #ff6b6b);
            }

            /* Moves Section */
            .moves-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }

            .move-slot {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 14px;
                padding: 18px;
                border: 2px solid rgba(255, 255, 255, 0.05);
                transition: all 0.3s ease;
            }

            .move-slot:focus-within {
                border-color: rgba(0, 212, 255, 0.4);
            }

            .move-slot-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 12px;
            }

            .move-slot-num {
                width: 26px;
                height: 26px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: 700;
                color: #000;
            }

            .move-slot-label {
                font-size: 0.75rem;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .move-input {
                width: 100%;
                background: transparent;
                border: none;
                border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                padding: 10px 0;
                color: #fff;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }

            .move-input:focus {
                outline: none;
                border-bottom-color: #00d4ff;
            }

            .move-input::placeholder {
                color: #444;
            }

            /* Output Section */
            .output-panel {
                background: linear-gradient(145deg, rgba(0, 50, 60, 0.3) 0%, rgba(0, 30, 40, 0.4) 100%);
                border-color: rgba(0, 212, 255, 0.2);
            }

            .output-box {
                background: rgba(0, 0, 0, 0.5);
                border-radius: 14px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .output-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
            }

            .output-title {
                font-size: 0.85rem;
                font-weight: 600;
                color: #00d4ff;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .copy-btn {
                padding: 8px 16px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                border: none;
                border-radius: 8px;
                color: #000;
                font-weight: 600;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .copy-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 20px rgba(0, 212, 255, 0.3);
            }

            .output-code {
                font-family: 'Monaco', 'Consolas', monospace;
                font-size: 0.9rem;
                color: #00ff88;
                background: rgba(0, 0, 0, 0.3);
                padding: 15px;
                border-radius: 10px;
                word-break: break-all;
                line-height: 1.6;
            }

            .action-buttons {
                display: flex;
                gap: 15px;
            }

            .action-btn {
                flex: 1;
                padding: 16px 24px;
                border-radius: 14px;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .action-btn.primary {
                background: linear-gradient(135deg, #5865f2, #4752c4);
                border: none;
                color: #fff;
            }

            .action-btn.primary:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(88, 101, 242, 0.4);
            }

            .action-btn.secondary {
                background: transparent;
                border: 2px solid rgba(255, 255, 255, 0.2);
                color: #888;
            }

            .action-btn.secondary:hover {
                border-color: #fff;
                color: #fff;
            }

            /* Responsive */
            @media (max-width: 1100px) {
                .creator-layout {
                    grid-template-columns: 1fr;
                }

                .creator-preview-card {
                    position: relative;
                    top: 0;
                }

                .stats-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }

            @media (max-width: 768px) {
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .moves-grid {
                    grid-template-columns: 1fr;
                }

                .form-row {
                    grid-template-columns: 1fr;
                }

                .action-buttons {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    createUI() {
        const container = document.getElementById('pokemon-creator-container');
        if (!container) return;

        container.innerHTML = `
            <div class="pkm-creator">
                <div class="creator-layout">
                    <!-- Left Sidebar - Preview -->
                    <div class="creator-preview-card">
                        <div class="preview-header">
                            <span class="preview-game-badge" id="preview-game">Scarlet / Violet</span>
                        </div>

                        <div class="preview-sprite-area">
                            <div class="preview-sprite-bg"></div>
                            <div class="preview-sprite-ring"></div>
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                                 alt="Pokemon" class="preview-sprite" id="preview-sprite">
                        </div>

                        <div class="preview-info">
                            <div class="preview-name" id="preview-name">Select a Pokemon</div>
                            <div class="preview-subtitle" id="preview-subtitle">Use the search to find your Pokemon</div>

                            <div class="preview-badges" id="preview-badges">
                                <span class="preview-tag level-tag">Lv. 100</span>
                            </div>

                            <div class="preview-stats-mini">
                                <div class="mini-stat">
                                    <div class="mini-stat-label">Nature</div>
                                    <div class="mini-stat-value" id="preview-nature">Adamant</div>
                                </div>
                                <div class="mini-stat">
                                    <div class="mini-stat-label">Ability</div>
                                    <div class="mini-stat-value" id="preview-ability">-</div>
                                </div>
                                <div class="mini-stat">
                                    <div class="mini-stat-label">Item</div>
                                    <div class="mini-stat-value" id="preview-item">-</div>
                                </div>
                                <div class="mini-stat">
                                    <div class="mini-stat-label">Ball</div>
                                    <div class="mini-stat-value" id="preview-ball">Poke</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side - Editor -->
                    <div class="creator-editor">
                        ${this.createPokemonPanel()}
                        ${this.createDetailsPanel()}
                        ${this.createStatsPanel()}
                        ${this.createMovesPanel()}
                        ${this.createOutputPanel()}
                    </div>
                </div>
            </div>
        `;

        // Open first panel by default
        document.querySelector('.editor-panel')?.classList.add('open');
    }

    createPokemonPanel() {
        return `
            <div class="editor-panel open" id="panel-pokemon">
                <div class="panel-header" onclick="pokemonCreator.togglePanel('panel-pokemon')">
                    <div class="panel-title-group">
                        <div class="panel-icon"><i class="fas fa-search"></i></div>
                        <div>
                            <div class="panel-title">Choose Pokemon</div>
                            <div class="panel-subtitle">Search and select your Pokemon</div>
                        </div>
                    </div>
                    <div class="panel-toggle"><i class="fas fa-chevron-down"></i></div>
                </div>
                <div class="panel-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Game Version</label>
                            <select class="form-select" id="creator-game">
                                <option value="za">Legends: Z-A</option>
                                <option value="sv" selected>Scarlet / Violet</option>
                                <option value="swsh">Sword / Shield</option>
                                <option value="bdsp">Brilliant Diamond / Shining Pearl</option>
                                <option value="pla">Legends: Arceus</option>
                                <option value="lgpe">Let's Go Pikachu/Eevee</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group search-wrapper">
                            <label class="form-label">Pokemon</label>
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" class="form-input search-input" id="creator-search"
                                   placeholder="Type to search... (e.g., Charizard)" autocomplete="off">
                            <div class="search-results" id="search-results"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nickname (Optional)</label>
                            <input type="text" class="form-input" id="creator-nickname"
                                   placeholder="Give it a name">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createDetailsPanel() {
        const natures = [
            { name: 'Adamant', effect: '+Atk, -SpA' },
            { name: 'Jolly', effect: '+Spe, -SpA' },
            { name: 'Modest', effect: '+SpA, -Atk' },
            { name: 'Timid', effect: '+Spe, -Atk' },
            { name: 'Bold', effect: '+Def, -Atk' },
            { name: 'Calm', effect: '+SpD, -Atk' },
            { name: 'Impish', effect: '+Def, -SpA' },
            { name: 'Careful', effect: '+SpD, -SpA' },
            { name: 'Brave', effect: '+Atk, -Spe' },
            { name: 'Quiet', effect: '+SpA, -Spe' },
            { name: 'Relaxed', effect: '+Def, -Spe' },
            { name: 'Sassy', effect: '+SpD, -Spe' },
            { name: 'Naive', effect: '+Spe, -SpD' },
            { name: 'Hasty', effect: '+Spe, -Def' },
            { name: 'Hardy', effect: 'Neutral' },
            { name: 'Docile', effect: 'Neutral' },
            { name: 'Serious', effect: 'Neutral' },
            { name: 'Bashful', effect: 'Neutral' },
            { name: 'Quirky', effect: 'Neutral' }
        ];

        const pokeballs = [
            'Poke Ball', 'Great Ball', 'Ultra Ball', 'Master Ball',
            'Premier Ball', 'Luxury Ball', 'Dusk Ball', 'Timer Ball',
            'Quick Ball', 'Heal Ball', 'Net Ball', 'Nest Ball',
            'Dive Ball', 'Repeat Ball', 'Level Ball', 'Lure Ball',
            'Moon Ball', 'Friend Ball', 'Love Ball', 'Heavy Ball',
            'Fast Ball', 'Sport Ball', 'Safari Ball', 'Dream Ball',
            'Beast Ball', 'Cherish Ball'
        ];

        const teraTypes = [
            'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
            'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
            'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy', 'Stellar'
        ];

        return `
            <div class="editor-panel" id="panel-details">
                <div class="panel-header" onclick="pokemonCreator.togglePanel('panel-details')">
                    <div class="panel-title-group">
                        <div class="panel-icon"><i class="fas fa-sliders-h"></i></div>
                        <div>
                            <div class="panel-title">Details</div>
                            <div class="panel-subtitle">Level, nature, ability & more</div>
                        </div>
                    </div>
                    <div class="panel-toggle"><i class="fas fa-chevron-down"></i></div>
                </div>
                <div class="panel-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Level</label>
                            <input type="number" class="form-input" id="creator-level" value="100" min="1" max="100">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nature</label>
                            <select class="form-select" id="creator-nature">
                                ${natures.map(n => `<option value="${n.name}" ${n.name === 'Adamant' ? 'selected' : ''}>${n.name} (${n.effect})</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Ability</label>
                            <select class="form-select" id="creator-ability">
                                <option value="">Select Pokemon first</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Held Item</label>
                            <input type="text" class="form-input" id="creator-item" placeholder="e.g., Leftovers">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Pokeball</label>
                            <select class="form-select" id="creator-pokeball">
                                ${pokeballs.map(b => `<option value="${b}">${b}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tera Type</label>
                            <select class="form-select" id="creator-tera">
                                ${teraTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="toggle-row">
                        <div class="toggle-info">
                            <span class="toggle-icon">✨</span>
                            <span class="toggle-text">Shiny Pokemon</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="creator-shiny">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    createStatsPanel() {
        const stats = [
            { key: 'hp', name: 'HP', color: '#ff5555' },
            { key: 'atk', name: 'ATK', color: '#ff8844' },
            { key: 'def', name: 'DEF', color: '#ffcc44' },
            { key: 'spa', name: 'SPA', color: '#44bbff' },
            { key: 'spd', name: 'SPD', color: '#44ff88' },
            { key: 'spe', name: 'SPE', color: '#ff66aa' }
        ];

        return `
            <div class="editor-panel" id="panel-stats">
                <div class="panel-header" onclick="pokemonCreator.togglePanel('panel-stats')">
                    <div class="panel-title-group">
                        <div class="panel-icon"><i class="fas fa-chart-bar"></i></div>
                        <div>
                            <div class="panel-title">Stats</div>
                            <div class="panel-subtitle">Configure IVs and EVs</div>
                        </div>
                    </div>
                    <div class="panel-toggle"><i class="fas fa-chevron-down"></i></div>
                </div>
                <div class="panel-content">
                    <div class="stats-actions">
                        <button class="stat-action-btn" onclick="pokemonCreator.maxIVs()">Max IVs (31)</button>
                        <button class="stat-action-btn" onclick="pokemonCreator.resetEVs()">Reset EVs</button>
                        <button class="stat-action-btn" onclick="pokemonCreator.physicalSpread()">Physical Attacker</button>
                        <button class="stat-action-btn" onclick="pokemonCreator.specialSpread()">Special Attacker</button>
                    </div>

                    <div class="stats-grid">
                        ${stats.map(stat => `
                            <div class="stat-card" style="--stat-color: ${stat.color}">
                                <div class="stat-name">${stat.name}</div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar-fill" id="bar-${stat.key}" style="width: 100%"></div>
                                </div>
                                <div class="stat-inputs-group">
                                    <div class="stat-input-wrapper">
                                        <span class="stat-input-label">IV</span>
                                        <input type="number" class="stat-input iv-input" id="iv-${stat.key}"
                                               value="31" min="0" max="31" data-stat="${stat.key}">
                                    </div>
                                    <div class="stat-input-wrapper">
                                        <span class="stat-input-label">EV</span>
                                        <input type="number" class="stat-input ev-input" id="ev-${stat.key}"
                                               value="0" min="0" max="252" data-stat="${stat.key}">
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="ev-total-display">
                        <span class="ev-total-text">EV Total</span>
                        <div class="ev-total-bar">
                            <div class="ev-total-fill" id="ev-bar" style="width: 0%"></div>
                        </div>
                        <span class="ev-total-value" id="ev-total">0 / 510</span>
                    </div>
                </div>
            </div>
        `;
    }

    createMovesPanel() {
        return `
            <div class="editor-panel" id="panel-moves">
                <div class="panel-header" onclick="pokemonCreator.togglePanel('panel-moves')">
                    <div class="panel-title-group">
                        <div class="panel-icon"><i class="fas fa-bolt"></i></div>
                        <div>
                            <div class="panel-title">Moves</div>
                            <div class="panel-subtitle">Select up to 4 moves</div>
                        </div>
                    </div>
                    <div class="panel-toggle"><i class="fas fa-chevron-down"></i></div>
                </div>
                <div class="panel-content">
                    <div class="moves-grid">
                        ${[1, 2, 3, 4].map(num => `
                            <div class="move-slot">
                                <div class="move-slot-header">
                                    <span class="move-slot-num">${num}</span>
                                    <span class="move-slot-label">Move ${num}</span>
                                </div>
                                <input type="text" class="move-input" id="move-${num}"
                                       placeholder="Enter move name..." data-slot="${num}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createOutputPanel() {
        return `
            <div class="editor-panel output-panel open" id="panel-output">
                <div class="panel-header" onclick="pokemonCreator.togglePanel('panel-output')">
                    <div class="panel-title-group">
                        <div class="panel-icon"><i class="fas fa-code"></i></div>
                        <div>
                            <div class="panel-title">Generate & Trade</div>
                            <div class="panel-subtitle">Get your Discord command</div>
                        </div>
                    </div>
                    <div class="panel-toggle"><i class="fas fa-chevron-down"></i></div>
                </div>
                <div class="panel-content">
                    <div class="output-box">
                        <div class="output-header">
                            <span class="output-title"><i class="fab fa-discord"></i> Discord Command</span>
                            <button class="copy-btn" onclick="pokemonCreator.copyCommand()">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <div class="output-code" id="output-command">/pkhex create pokemon:Pikachu</div>
                    </div>

                    <div class="action-buttons">
                        <button class="action-btn secondary" onclick="pokemonCreator.resetAll()">
                            <i class="fas fa-redo"></i> Reset All
                        </button>
                        <button class="action-btn primary" onclick="pokemonCreator.openDiscord()">
                            <i class="fab fa-discord"></i> Trade on Discord
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.classList.toggle('open');
        }
    }

    bindEvents() {
        // Search
        const searchInput = document.getElementById('creator-search');
        const searchResults = document.getElementById('search-results');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchPokemon(e.target.value));
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.length >= 2) {
                    searchResults.classList.add('visible');
                }
            });
        }

        // Close search on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                searchResults?.classList.remove('visible');
            }
        });

        // Form inputs
        const formBindings = {
            'creator-game': 'game',
            'creator-nickname': 'nickname',
            'creator-level': 'level',
            'creator-nature': 'nature',
            'creator-ability': 'ability',
            'creator-item': 'heldItem',
            'creator-pokeball': 'pokeball',
            'creator-tera': 'teraType'
        };

        Object.entries(formBindings).forEach(([id, prop]) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    this.pokemon[prop] = el.value;
                    this.updatePreview();
                    this.updateCommand();
                });
            }
        });

        // Shiny toggle
        const shinyToggle = document.getElementById('creator-shiny');
        if (shinyToggle) {
            shinyToggle.addEventListener('change', () => {
                this.pokemon.shiny = shinyToggle.checked;
                this.updatePreview();
                this.updateCommand();
            });
        }

        // IV/EV inputs
        document.querySelectorAll('.iv-input').forEach(input => {
            input.addEventListener('input', () => {
                const stat = input.dataset.stat;
                this.pokemon.ivs[stat] = parseInt(input.value) || 0;
                this.updateStatBars();
                this.updateCommand();
            });
        });

        document.querySelectorAll('.ev-input').forEach(input => {
            input.addEventListener('input', () => {
                const stat = input.dataset.stat;
                this.pokemon.evs[stat] = parseInt(input.value) || 0;
                this.updateStatBars();
                this.updateCommand();
            });
        });

        // Move inputs
        [1, 2, 3, 4].forEach(num => {
            const input = document.getElementById(`move-${num}`);
            if (input) {
                input.addEventListener('input', () => {
                    this.pokemon.moves[num - 1] = input.value;
                    this.updateCommand();
                });
            }
        });
    }

    async loadPokemonList() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
            const data = await response.json();
            this.pokemonCache = data.results;
        } catch (error) {
            console.error('Failed to load Pokemon list:', error);
        }
    }

    searchPokemon(query) {
        const results = document.getElementById('search-results');
        if (!results || !this.pokemonCache) return;

        if (query.length < 2) {
            results.classList.remove('visible');
            return;
        }

        const matches = this.pokemonCache.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

        if (matches.length > 0) {
            results.innerHTML = matches.map(p => {
                const id = p.url.split('/').filter(Boolean).pop();
                return `
                    <div class="search-result-item" data-name="${p.name}" data-id="${id}">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"
                             alt="${p.name}" class="search-result-sprite">
                        <div>
                            <div class="search-result-name">${this.capitalize(p.name)}</div>
                            <div class="search-result-id">#${id.padStart(4, '0')}</div>
                        </div>
                    </div>
                `;
            }).join('');

            results.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.selectPokemon(item.dataset.name, item.dataset.id);
                });
            });

            results.classList.add('visible');
        } else {
            results.classList.remove('visible');
        }
    }

    async selectPokemon(name, id) {
        this.pokemon.species = this.capitalize(name);
        this.pokemon.speciesId = parseInt(id);

        document.getElementById('creator-search').value = this.pokemon.species;
        document.getElementById('search-results').classList.remove('visible');

        // Fetch abilities
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();

            const abilitySelect = document.getElementById('creator-ability');
            if (abilitySelect) {
                abilitySelect.innerHTML = data.abilities.map(a =>
                    `<option value="${this.capitalize(a.ability.name)}">${this.capitalize(a.ability.name)}${a.is_hidden ? ' (HA)' : ''}</option>`
                ).join('');
                this.pokemon.ability = this.capitalize(data.abilities[0].ability.name);
            }
        } catch (error) {
            console.error('Error fetching Pokemon data:', error);
        }

        this.updatePreview();
        this.updateCommand();

        // Open details panel after selecting
        document.getElementById('panel-details')?.classList.add('open');
    }

    updatePreview() {
        const sprite = document.getElementById('preview-sprite');
        const name = document.getElementById('preview-name');
        const subtitle = document.getElementById('preview-subtitle');
        const badges = document.getElementById('preview-badges');
        const gameEl = document.getElementById('preview-game');

        if (this.pokemon.speciesId) {
            const shinyPath = this.pokemon.shiny ? 'shiny/' : '';
            sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${this.pokemon.speciesId}.png`;
            sprite.classList.toggle('shiny', this.pokemon.shiny);
        }

        name.textContent = this.pokemon.nickname || this.pokemon.species || 'Select a Pokemon';
        subtitle.textContent = this.pokemon.species ? (this.pokemon.nickname ? this.pokemon.species : '') : 'Use the search to find your Pokemon';

        const gameNames = {
            'za': 'Legends: Z-A',
            'sv': 'Scarlet / Violet',
            'swsh': 'Sword / Shield',
            'bdsp': 'BD / SP',
            'pla': 'Legends: Arceus',
            'lgpe': 'Let\'s Go'
        };
        gameEl.textContent = gameNames[this.pokemon.game] || 'Scarlet / Violet';

        let badgesHtml = '';
        if (this.pokemon.shiny) {
            badgesHtml += '<span class="preview-tag shiny-tag">Shiny</span>';
        }
        badgesHtml += `<span class="preview-tag level-tag">Lv. ${this.pokemon.level}</span>`;
        badges.innerHTML = badgesHtml;

        document.getElementById('preview-nature').textContent = this.pokemon.nature;
        document.getElementById('preview-ability').textContent = this.pokemon.ability || '-';
        document.getElementById('preview-item').textContent = this.pokemon.heldItem || '-';
        document.getElementById('preview-ball').textContent = this.pokemon.pokeball.replace(' Ball', '');
    }

    updateStatBars() {
        const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
        let evTotal = 0;

        stats.forEach(stat => {
            const iv = parseInt(document.getElementById(`iv-${stat}`).value) || 0;
            const ev = parseInt(document.getElementById(`ev-${stat}`).value) || 0;
            evTotal += ev;

            const bar = document.getElementById(`bar-${stat}`);
            if (bar) {
                bar.style.width = `${(iv / 31) * 100}%`;
            }
        });

        const evTotalEl = document.getElementById('ev-total');
        const evBar = document.getElementById('ev-bar');

        if (evTotalEl) {
            evTotalEl.textContent = `${evTotal} / 510`;
            evTotalEl.classList.toggle('over', evTotal > 510);
        }

        if (evBar) {
            evBar.style.width = `${Math.min((evTotal / 510) * 100, 100)}%`;
            evBar.classList.toggle('over', evTotal > 510);
        }
    }

    updateCommand() {
        const output = document.getElementById('output-command');
        if (!output) return;

        let cmd = `/pkhex create pokemon:${this.pokemon.species || 'Pikachu'}`;

        if (this.pokemon.shiny) cmd += ` shiny:True`;
        if (this.pokemon.level !== 100) cmd += ` level:${this.pokemon.level}`;
        if (this.pokemon.nature !== 'Hardy') cmd += ` nature:${this.pokemon.nature}`;
        if (this.pokemon.ability) cmd += ` ability:${this.pokemon.ability}`;
        if (this.pokemon.heldItem) cmd += ` helditem:${this.pokemon.heldItem}`;
        if (this.pokemon.teraType !== 'Normal') cmd += ` teratype:${this.pokemon.teraType}`;

        this.pokemon.moves.forEach((move, i) => {
            if (move) cmd += ` move${i + 1}:${move}`;
        });

        const ivs = this.pokemon.ivs;
        if (Object.values(ivs).some(v => v !== 31)) {
            cmd += ` ivs:${ivs.hp}/${ivs.atk}/${ivs.def}/${ivs.spa}/${ivs.spd}/${ivs.spe}`;
        }

        const evs = this.pokemon.evs;
        if (Object.values(evs).some(v => v > 0)) {
            cmd += ` evs:${evs.hp}/${evs.atk}/${evs.def}/${evs.spa}/${evs.spd}/${evs.spe}`;
        }

        output.textContent = cmd;
    }

    maxIVs() {
        ['hp', 'atk', 'def', 'spa', 'spd', 'spe'].forEach(stat => {
            const input = document.getElementById(`iv-${stat}`);
            if (input) {
                input.value = 31;
                this.pokemon.ivs[stat] = 31;
            }
        });
        this.updateStatBars();
        this.updateCommand();
    }

    resetEVs() {
        ['hp', 'atk', 'def', 'spa', 'spd', 'spe'].forEach(stat => {
            const input = document.getElementById(`ev-${stat}`);
            if (input) {
                input.value = 0;
                this.pokemon.evs[stat] = 0;
            }
        });
        this.updateStatBars();
        this.updateCommand();
    }

    physicalSpread() {
        const spread = { hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 };
        Object.entries(spread).forEach(([stat, val]) => {
            document.getElementById(`ev-${stat}`).value = val;
            this.pokemon.evs[stat] = val;
        });
        this.updateStatBars();
        this.updateCommand();
    }

    specialSpread() {
        const spread = { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 };
        Object.entries(spread).forEach(([stat, val]) => {
            document.getElementById(`ev-${stat}`).value = val;
            this.pokemon.evs[stat] = val;
        });
        this.updateStatBars();
        this.updateCommand();
    }

    copyCommand() {
        const command = document.getElementById('output-command').textContent;
        navigator.clipboard.writeText(command).then(() => {
            const btn = document.querySelector('.copy-btn');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => { btn.innerHTML = original; }, 2000);
        });
    }

    resetAll() {
        this.pokemon = {
            species: '',
            speciesId: 0,
            nickname: '',
            game: 'sv',
            level: 100,
            shiny: false,
            gender: 'random',
            heldItem: '',
            pokeball: 'Poke Ball',
            nature: 'Adamant',
            ability: '',
            teraType: 'Normal',
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
            moves: ['', '', '', '']
        };

        // Reset form elements
        document.getElementById('creator-search').value = '';
        document.getElementById('creator-nickname').value = '';
        document.getElementById('creator-level').value = 100;
        document.getElementById('creator-game').value = 'sv';
        document.getElementById('creator-nature').value = 'Adamant';
        document.getElementById('creator-item').value = '';
        document.getElementById('creator-pokeball').value = 'Poke Ball';
        document.getElementById('creator-tera').value = 'Normal';
        document.getElementById('creator-shiny').checked = false;
        document.getElementById('creator-ability').innerHTML = '<option value="">Select Pokemon first</option>';

        ['hp', 'atk', 'def', 'spa', 'spd', 'spe'].forEach(stat => {
            document.getElementById(`iv-${stat}`).value = 31;
            document.getElementById(`ev-${stat}`).value = 0;
        });

        [1, 2, 3, 4].forEach(num => {
            document.getElementById(`move-${num}`).value = '';
        });

        this.updatePreview();
        this.updateStatBars();
        this.updateCommand();
    }

    openDiscord() {
        this.copyCommand();
        window.open('https://discord.gg/pkm-universe', '_blank');
    }

    capitalize(str) {
        return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
}

// Initialize
let pokemonCreator;
document.addEventListener('DOMContentLoaded', () => {
    pokemonCreator = new PokemonCreator();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!pokemonCreator) {
            pokemonCreator = new PokemonCreator();
        }
    }, 100);
}
