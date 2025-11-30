/**
 * PKM-Universe Team Builder
 * Drag-and-drop team creation with type coverage
 */

class TeamBuilder {
    constructor() {
        this.team = [null, null, null, null, null, null];
        this.savedTeams = JSON.parse(localStorage.getItem('savedTeams') || '[]');
        this.typeChart = this.getTypeChart();
        this.init();
    }

    init() {
        this.createTeamBuilderSection();
        this.setupEventListeners();
        this.loadSavedTeams();
    }

    getTypeChart() {
        // Type effectiveness chart
        return {
            normal: { weaknesses: ['fighting'], immunities: ['ghost'], resistances: [] },
            fire: { weaknesses: ['water', 'ground', 'rock'], immunities: [], resistances: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] },
            water: { weaknesses: ['electric', 'grass'], immunities: [], resistances: ['fire', 'water', 'ice', 'steel'] },
            electric: { weaknesses: ['ground'], immunities: [], resistances: ['electric', 'flying', 'steel'] },
            grass: { weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'], immunities: [], resistances: ['water', 'electric', 'grass', 'ground'] },
            ice: { weaknesses: ['fire', 'fighting', 'rock', 'steel'], immunities: [], resistances: ['ice'] },
            fighting: { weaknesses: ['flying', 'psychic', 'fairy'], immunities: [], resistances: ['bug', 'rock', 'dark'] },
            poison: { weaknesses: ['ground', 'psychic'], immunities: [], resistances: ['grass', 'fighting', 'poison', 'bug', 'fairy'] },
            ground: { weaknesses: ['water', 'grass', 'ice'], immunities: ['electric'], resistances: ['poison', 'rock'] },
            flying: { weaknesses: ['electric', 'ice', 'rock'], immunities: ['ground'], resistances: ['grass', 'fighting', 'bug'] },
            psychic: { weaknesses: ['bug', 'ghost', 'dark'], immunities: [], resistances: ['fighting', 'psychic'] },
            bug: { weaknesses: ['fire', 'flying', 'rock'], immunities: [], resistances: ['grass', 'fighting', 'ground'] },
            rock: { weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'], immunities: [], resistances: ['normal', 'fire', 'poison', 'flying'] },
            ghost: { weaknesses: ['ghost', 'dark'], immunities: ['normal', 'fighting'], resistances: ['poison', 'bug'] },
            dragon: { weaknesses: ['ice', 'dragon', 'fairy'], immunities: [], resistances: ['fire', 'water', 'electric', 'grass'] },
            dark: { weaknesses: ['fighting', 'bug', 'fairy'], immunities: ['psychic'], resistances: ['ghost', 'dark'] },
            steel: { weaknesses: ['fire', 'fighting', 'ground'], immunities: ['poison'], resistances: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'] },
            fairy: { weaknesses: ['poison', 'steel'], immunities: ['dragon'], resistances: ['fighting', 'bug', 'dark'] }
        };
    }

    createTeamBuilderSection() {
        const section = document.createElement('section');
        section.id = 'team-builder';
        section.className = 'team-builder-section';
        section.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <span class="section-badge team-badge"><i class="fas fa-users"></i> Team Builder</span>
                    <h2 class="section-title">Build Your Dream Team</h2>
                    <p class="section-subtitle">Create, analyze, and share competitive teams</p>
                </div>

                <div class="team-builder-container">
                    <div class="team-slots">
                        ${[0,1,2,3,4,5].map(i => `
                            <div class="team-slot" data-slot="${i}" ondrop="teamBuilder.drop(event)" ondragover="teamBuilder.allowDrop(event)">
                                <div class="slot-content empty">
                                    <i class="fas fa-plus"></i>
                                    <span>Add Pokemon</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="team-search">
                        <input type="text" id="teamPokemonSearch" placeholder="Search Pokemon to add..." autocomplete="off">
                        <div class="team-search-results" id="teamSearchResults"></div>
                    </div>

                    <div class="team-analysis">
                        <h3><i class="fas fa-chart-pie"></i> Type Coverage Analysis</h3>
                        <div class="type-coverage-grid" id="typeCoverageGrid">
                            <!-- Type coverage will be rendered here -->
                        </div>
                        <div class="team-warnings" id="teamWarnings"></div>
                    </div>

                    <div class="team-actions">
                        <button class="btn btn-secondary" onclick="teamBuilder.clearTeam()">
                            <i class="fas fa-trash"></i> Clear Team
                        </button>
                        <button class="btn btn-secondary" onclick="teamBuilder.exportShowdown()">
                            <i class="fas fa-file-export"></i> Export to Showdown
                        </button>
                        <button class="btn btn-primary" onclick="teamBuilder.saveTeam()">
                            <i class="fas fa-save"></i> Save Team
                        </button>
                        <button class="btn btn-secondary" onclick="teamBuilder.shareTeam()">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>

                    <div class="saved-teams">
                        <h3><i class="fas fa-folder"></i> Saved Teams</h3>
                        <div class="saved-teams-list" id="savedTeamsList">
                            <!-- Saved teams will be rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert after leaderboards or features
        const leaderboards = document.getElementById('leaderboards');
        const features = document.getElementById('features');
        const insertAfter = leaderboards || features;
        if (insertAfter) {
            insertAfter.after(section);
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('teamPokemonSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchPokemon(e.target.value));
            searchInput.addEventListener('focus', () => this.searchPokemon(searchInput.value));
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.team-search')) {
                document.getElementById('teamSearchResults').innerHTML = '';
            }
        });
    }

    async searchPokemon(query) {
        const results = document.getElementById('teamSearchResults');
        if (!query || query.length < 2) {
            results.innerHTML = '';
            return;
        }

        // Get Pokemon list from existing data or API
        const pokemonList = window.allPokemon || await this.fetchPokemonList();
        const filtered = pokemonList.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);

        results.innerHTML = filtered.map(pokemon => `
            <div class="search-result-item" draggable="true"
                 ondragstart="teamBuilder.drag(event, ${pokemon.id}, '${pokemon.name}')"
                 onclick="teamBuilder.addToFirstEmpty(${pokemon.id}, '${pokemon.name}')">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
                <span>${this.capitalize(pokemon.name)}</span>
                <span class="pokemon-types">${(pokemon.types || []).map(t => `<span class="type-badge ${t}">${t}</span>`).join('')}</span>
            </div>
        `).join('');
    }

    async fetchPokemonList() {
        // Use cached data or fetch basic list
        if (!window.allPokemon) {
            window.allPokemon = [];
            for (let i = 1; i <= 1025; i++) {
                window.allPokemon.push({ id: i, name: `Pokemon ${i}`, types: [] });
            }
        }
        return window.allPokemon;
    }

    allowDrop(e) {
        e.preventDefault();
    }

    drag(e, id, name) {
        e.dataTransfer.setData('pokemonId', id);
        e.dataTransfer.setData('pokemonName', name);
    }

    drop(e) {
        e.preventDefault();
        const slot = e.target.closest('.team-slot');
        if (!slot) return;

        const slotIndex = parseInt(slot.dataset.slot);
        const pokemonId = e.dataTransfer.getData('pokemonId');
        const pokemonName = e.dataTransfer.getData('pokemonName');

        if (pokemonId && pokemonName) {
            this.addPokemon(slotIndex, parseInt(pokemonId), pokemonName);
        }
    }

    addToFirstEmpty(id, name) {
        const emptySlot = this.team.findIndex(p => p === null);
        if (emptySlot !== -1) {
            this.addPokemon(emptySlot, id, name);
        }
        document.getElementById('teamSearchResults').innerHTML = '';
        document.getElementById('teamPokemonSearch').value = '';
    }

    async addPokemon(slot, id, name) {
        // Fetch Pokemon data
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();

            this.team[slot] = {
                id: id,
                name: name,
                types: data.types.map(t => t.type.name),
                sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                stats: data.stats.map(s => ({ name: s.stat.name, base: s.base_stat }))
            };
        } catch (error) {
            this.team[slot] = {
                id: id,
                name: name,
                types: [],
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                stats: []
            };
        }

        this.renderTeam();
        this.analyzeTeam();
    }

    removePokemon(slot) {
        this.team[slot] = null;
        this.renderTeam();
        this.analyzeTeam();
    }

    renderTeam() {
        this.team.forEach((pokemon, index) => {
            const slot = document.querySelector(`.team-slot[data-slot="${index}"]`);
            if (!slot) return;

            if (pokemon) {
                slot.innerHTML = `
                    <div class="slot-content filled">
                        <button class="remove-btn" onclick="teamBuilder.removePokemon(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                        <img src="${pokemon.sprite}" alt="${pokemon.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png'">
                        <span class="pokemon-name">${this.capitalize(pokemon.name)}</span>
                        <div class="pokemon-types">
                            ${pokemon.types.map(t => `<span class="type-badge ${t}">${t}</span>`).join('')}
                        </div>
                    </div>
                `;
            } else {
                slot.innerHTML = `
                    <div class="slot-content empty">
                        <i class="fas fa-plus"></i>
                        <span>Add Pokemon</span>
                    </div>
                `;
            }
        });
    }

    analyzeTeam() {
        const grid = document.getElementById('typeCoverageGrid');
        const warnings = document.getElementById('teamWarnings');
        if (!grid) return;

        const types = Object.keys(this.typeChart);
        const teamTypes = this.team.filter(p => p).flatMap(p => p.types);

        // Calculate weaknesses and resistances
        const weaknessCount = {};
        const resistanceCount = {};
        const immunityCount = {};

        types.forEach(type => {
            weaknessCount[type] = 0;
            resistanceCount[type] = 0;
            immunityCount[type] = 0;
        });

        this.team.filter(p => p).forEach(pokemon => {
            pokemon.types.forEach(type => {
                const typeData = this.typeChart[type];
                if (typeData) {
                    typeData.weaknesses.forEach(w => weaknessCount[w]++);
                    typeData.resistances.forEach(r => resistanceCount[r]++);
                    typeData.immunities.forEach(i => immunityCount[i]++);
                }
            });
        });

        // Render type grid
        grid.innerHTML = types.map(type => {
            const weak = weaknessCount[type];
            const resist = resistanceCount[type];
            const immune = immunityCount[type];
            const net = resist + immune * 2 - weak;

            let statusClass = 'neutral';
            if (weak >= 3 && resist < 2) statusClass = 'danger';
            else if (weak >= 2 && resist < 2) statusClass = 'warning';
            else if (resist >= 2 || immune >= 1) statusClass = 'good';

            return `
                <div class="type-coverage-item ${statusClass}">
                    <span class="type-badge ${type}">${type}</span>
                    <div class="coverage-stats">
                        <span class="weak" title="Weak">-${weak}</span>
                        <span class="resist" title="Resist">+${resist}</span>
                        ${immune > 0 ? `<span class="immune" title="Immune">0x${immune}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Generate warnings
        const warningsList = [];
        types.forEach(type => {
            if (weaknessCount[type] >= 3 && resistanceCount[type] < 2 && immunityCount[type] === 0) {
                warningsList.push(`<i class="fas fa-exclamation-triangle"></i> Major weakness to <span class="type-badge ${type}">${type}</span> (${weaknessCount[type]} weak)`);
            }
        });

        if (this.team.filter(p => p).length < 6) {
            warningsList.push(`<i class="fas fa-info-circle"></i> Team has only ${this.team.filter(p => p).length}/6 Pokemon`);
        }

        warnings.innerHTML = warningsList.length > 0
            ? warningsList.map(w => `<div class="warning-item">${w}</div>`).join('')
            : '<div class="no-warnings"><i class="fas fa-check-circle"></i> Team looks balanced!</div>';
    }

    clearTeam() {
        this.team = [null, null, null, null, null, null];
        this.renderTeam();
        this.analyzeTeam();
    }

    exportShowdown() {
        const pokemonWithData = this.team.filter(p => p);
        if (pokemonWithData.length === 0) {
            alert('Add some Pokemon to your team first!');
            return;
        }

        const showdownFormat = pokemonWithData.map(pokemon => {
            return `${this.capitalize(pokemon.name)}
Ability: (ability)
EVs: 252 HP / 252 Atk / 4 Spe
Adamant Nature
- (move 1)
- (move 2)
- (move 3)
- (move 4)
`;
        }).join('\n');

        // Copy to clipboard
        navigator.clipboard.writeText(showdownFormat).then(() => {
            this.showNotification('Team copied to clipboard in Showdown format!');
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = showdownFormat;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('Team copied to clipboard!');
        });
    }

    saveTeam() {
        const teamPokemon = this.team.filter(p => p);
        if (teamPokemon.length === 0) {
            alert('Add some Pokemon to your team first!');
            return;
        }

        const teamName = prompt('Enter a name for your team:');
        if (!teamName) return;

        this.savedTeams.push({
            name: teamName,
            team: [...this.team],
            date: new Date().toISOString()
        });

        localStorage.setItem('savedTeams', JSON.stringify(this.savedTeams));
        this.loadSavedTeams();
        this.showNotification(`Team "${teamName}" saved!`);
    }

    loadSavedTeams() {
        const list = document.getElementById('savedTeamsList');
        if (!list) return;

        if (this.savedTeams.length === 0) {
            list.innerHTML = '<div class="no-teams">No saved teams yet</div>';
            return;
        }

        list.innerHTML = this.savedTeams.map((saved, index) => `
            <div class="saved-team-card">
                <div class="saved-team-header">
                    <span class="saved-team-name">${saved.name}</span>
                    <span class="saved-team-date">${new Date(saved.date).toLocaleDateString()}</span>
                </div>
                <div class="saved-team-preview">
                    ${saved.team.filter(p => p).map(p => `
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png" alt="${p.name}">
                    `).join('')}
                </div>
                <div class="saved-team-actions">
                    <button onclick="teamBuilder.loadTeam(${index})"><i class="fas fa-upload"></i> Load</button>
                    <button onclick="teamBuilder.deleteTeam(${index})"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `).join('');
    }

    loadTeam(index) {
        const saved = this.savedTeams[index];
        if (saved) {
            this.team = [...saved.team];
            this.renderTeam();
            this.analyzeTeam();
            this.showNotification(`Loaded "${saved.name}"`);
        }
    }

    deleteTeam(index) {
        if (confirm('Delete this team?')) {
            this.savedTeams.splice(index, 1);
            localStorage.setItem('savedTeams', JSON.stringify(this.savedTeams));
            this.loadSavedTeams();
        }
    }

    shareTeam() {
        const teamPokemon = this.team.filter(p => p);
        if (teamPokemon.length === 0) {
            alert('Add some Pokemon to your team first!');
            return;
        }

        const teamIds = teamPokemon.map(p => p.id).join(',');
        const shareUrl = `${window.location.origin}${window.location.pathname}?team=${teamIds}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            this.showNotification('Share link copied to clipboard!');
        });
    }

    showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'team-notification';
        notif.textContent = message;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Team Builder styles
const teamBuilderStyles = document.createElement('style');
teamBuilderStyles.textContent = `
    .team-builder-section {
        padding: 80px 0;
        background: var(--bg-primary);
    }

    .team-badge {
        background: linear-gradient(135deg, #00d4ff, #00ff88) !important;
        color: #000 !important;
    }

    .team-builder-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .team-slots {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 15px;
        margin-bottom: 30px;
    }

    @media (max-width: 900px) {
        .team-slots {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 500px) {
        .team-slots {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .team-slot {
        aspect-ratio: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 2px dashed rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .team-slot:hover {
        border-color: var(--neon-cyan);
        background: rgba(0, 212, 255, 0.1);
    }

    .slot-content {
        text-align: center;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        position: relative;
    }

    .slot-content.empty {
        color: #666;
    }

    .slot-content.empty i {
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .slot-content.filled img {
        width: 70%;
        height: auto;
    }

    .slot-content .pokemon-name {
        font-weight: 600;
        font-size: 0.9rem;
        margin-top: 5px;
    }

    .slot-content .pokemon-types {
        display: flex;
        gap: 5px;
        margin-top: 5px;
        flex-wrap: wrap;
        justify-content: center;
    }

    .remove-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #ff4444;
        border: none;
        color: #fff;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .team-slot:hover .remove-btn {
        opacity: 1;
    }

    .team-search {
        position: relative;
        max-width: 500px;
        margin: 0 auto 30px;
    }

    .team-search input {
        width: 100%;
        padding: 15px 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 30px;
        color: #fff;
        font-size: 1rem;
    }

    .team-search input:focus {
        outline: none;
        border-color: var(--neon-cyan);
    }

    .team-search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-secondary);
        border-radius: 15px;
        overflow: hidden;
        z-index: 100;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .search-result-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px 20px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .search-result-item:hover {
        background: rgba(0, 212, 255, 0.2);
    }

    .search-result-item img {
        width: 50px;
        height: 50px;
    }

    .team-analysis {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 30px;
    }

    .team-analysis h3 {
        font-family: 'Orbitron', sans-serif;
        margin-bottom: 20px;
        color: #fff;
    }

    .type-coverage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
    }

    .type-coverage-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border-left: 3px solid;
    }

    .type-coverage-item.danger { border-left-color: #ff4444; }
    .type-coverage-item.warning { border-left-color: #ffaa00; }
    .type-coverage-item.neutral { border-left-color: #888; }
    .type-coverage-item.good { border-left-color: #00ff88; }

    .coverage-stats {
        display: flex;
        gap: 8px;
        font-size: 0.85rem;
    }

    .coverage-stats .weak { color: #ff4444; }
    .coverage-stats .resist { color: #00ff88; }
    .coverage-stats .immune { color: #00d4ff; }

    .type-badge {
        padding: 3px 10px;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
    }

    .type-badge.normal { background: #A8A878; color: #fff; }
    .type-badge.fire { background: #F08030; color: #fff; }
    .type-badge.water { background: #6890F0; color: #fff; }
    .type-badge.electric { background: #F8D030; color: #000; }
    .type-badge.grass { background: #78C850; color: #fff; }
    .type-badge.ice { background: #98D8D8; color: #000; }
    .type-badge.fighting { background: #C03028; color: #fff; }
    .type-badge.poison { background: #A040A0; color: #fff; }
    .type-badge.ground { background: #E0C068; color: #000; }
    .type-badge.flying { background: #A890F0; color: #fff; }
    .type-badge.psychic { background: #F85888; color: #fff; }
    .type-badge.bug { background: #A8B820; color: #fff; }
    .type-badge.rock { background: #B8A038; color: #fff; }
    .type-badge.ghost { background: #705898; color: #fff; }
    .type-badge.dragon { background: #7038F8; color: #fff; }
    .type-badge.dark { background: #705848; color: #fff; }
    .type-badge.steel { background: #B8B8D0; color: #000; }
    .type-badge.fairy { background: #EE99AC; color: #000; }

    .team-warnings {
        margin-top: 20px;
    }

    .warning-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 15px;
        background: rgba(255, 170, 0, 0.1);
        border-radius: 10px;
        margin-bottom: 10px;
        color: #ffaa00;
    }

    .no-warnings {
        color: #00ff88;
        padding: 10px 15px;
    }

    .team-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 40px;
    }

    .saved-teams h3 {
        font-family: 'Orbitron', sans-serif;
        margin-bottom: 20px;
        color: #fff;
    }

    .saved-teams-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }

    .saved-team-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .saved-team-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .saved-team-name {
        font-weight: 600;
        color: #fff;
    }

    .saved-team-date {
        font-size: 0.8rem;
        color: #888;
    }

    .saved-team-preview {
        display: flex;
        gap: 5px;
        margin-bottom: 15px;
    }

    .saved-team-preview img {
        width: 40px;
        height: 40px;
    }

    .saved-team-actions {
        display: flex;
        gap: 10px;
    }

    .saved-team-actions button {
        flex: 1;
        padding: 8px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .saved-team-actions button:hover {
        background: var(--neon-cyan);
        color: #000;
    }

    .no-teams {
        text-align: center;
        color: #888;
        padding: 30px;
    }

    .team-notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--neon-cyan);
        color: #000;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        z-index: 10000;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes fadeOut {
        to { opacity: 0; }
    }
`;
document.head.appendChild(teamBuilderStyles);

// Initialize
window.teamBuilder = new TeamBuilder();
