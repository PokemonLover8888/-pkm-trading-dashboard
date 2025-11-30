// PKM-Universe Website - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check for logged in user from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    const avatar = urlParams.get('avatar');
    const userId = urlParams.get('id');

    if (username && avatar) {
        // User is logged in
        const loginBtn = document.getElementById('loginBtn');
        const loginText = document.getElementById('loginText');

        if (loginBtn && loginText) {
            loginText.textContent = username;
            loginBtn.innerHTML = `<img src="${avatar}" alt="${username}" style="width:24px;height:24px;border-radius:50%;margin-right:8px;"><span>${username}</span>`;
            loginBtn.href = '/auth/logout';

            // Store in localStorage
            localStorage.setItem('pkm_user', JSON.stringify({ username, avatar, userId }));
        }

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        // Check localStorage for existing session
        const stored = localStorage.getItem('pkm_user');
        if (stored) {
            const user = JSON.parse(stored);
            const loginBtn = document.getElementById('loginBtn');

            if (loginBtn) {
                loginBtn.innerHTML = `<img src="${user.avatar}" alt="${user.username}" style="width:24px;height:24px;border-radius:50%;margin-right:8px;"><span>${user.username}</span>`;
                loginBtn.href = '/auth/logout';
            }
        }
    }

    // Navigation toggle for mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navMenu.classList.remove('active');
            }
        });
    });

    // Pokemon search dropdown
    const pokemonSearch = document.getElementById('pokemonSearch');
    const pokemonDropdown = document.getElementById('pokemonDropdown');

    if (pokemonSearch && pokemonDropdown) {
        pokemonSearch.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length < 1) {
                pokemonDropdown.classList.remove('active');
                return;
            }

            const matches = POKEMON_LIST.filter(p =>
                p.toLowerCase().includes(query)
            ).slice(0, 10);

            if (matches.length > 0) {
                pokemonDropdown.innerHTML = matches.map(p => {
                    const dex = getDexNumber(p);
                    return `<div class="dropdown-item" data-pokemon="${p}">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dex}.png" alt="${p}">
                        <span>#${dex} ${p}</span>
                    </div>`;
                }).join('');
                pokemonDropdown.classList.add('active');

                // Add click handlers
                pokemonDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', function() {
                        selectPokemon(this.dataset.pokemon);
                        pokemonDropdown.classList.remove('active');
                    });
                });
            } else {
                pokemonDropdown.classList.remove('active');
            }
        });
    }

    // Select Pokemon function
    function selectPokemon(name) {
        pokemonSearch.value = name;
        document.getElementById('previewName').textContent = name;

        const dex = getDexNumber(name);
        const isShiny = document.getElementById('shinyToggle').checked;
        const sprite = isShiny
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${dex}.png`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`;

        document.getElementById('previewSprite').src = sprite;

        // Update abilities
        const abilities = getAbilities(name);
        const abilitySelect = document.getElementById('abilitySelect');
        abilitySelect.innerHTML = abilities.map(a =>
            `<option value="${a}">${a}</option>`
        ).join('');
    }

    // Shiny toggle
    const shinyToggle = document.getElementById('shinyToggle');
    const shinyBadge = document.getElementById('shinyBadge');

    if (shinyToggle) {
        shinyToggle.addEventListener('change', function() {
            shinyBadge.style.display = this.checked ? 'inline-flex' : 'none';

            const pokemon = pokemonSearch.value;
            if (pokemon) {
                const dex = getDexNumber(pokemon);
                const sprite = this.checked
                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${dex}.png`
                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`;
                document.getElementById('previewSprite').src = sprite;
            }
        });
    }

    // EV total calculator
    const evFields = document.querySelectorAll('.ev-field');
    const evTotal = document.getElementById('evTotal');

    evFields.forEach(field => {
        field.addEventListener('input', function() {
            let total = 0;
            evFields.forEach(f => {
                total += parseInt(f.value) || 0;
            });
            evTotal.textContent = total;
            evTotal.style.color = total > 510 ? '#ff5555' : '#00d4ff';
        });
    });

    // IV stat bars update
    const ivInputs = ['ivHP', 'ivAtk', 'ivDef', 'ivSpA', 'ivSpD', 'ivSpe'];
    const statDisplays = ['statHP', 'statAtk', 'statDef', 'statSpA', 'statSpD', 'statSpe'];

    ivInputs.forEach((id, i) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                const val = parseInt(this.value) || 0;
                document.getElementById(statDisplays[i]).textContent = val;
                const bar = document.querySelectorAll('.stat-fill')[i];
                if (bar) {
                    bar.style.setProperty('--stat-value', `${(val / 31) * 100}%`);
                }
            });
        }
    });

    // Item search dropdown
    const itemSearch = document.getElementById('itemSearch');
    const itemDropdown = document.getElementById('itemDropdown');

    if (itemSearch && itemDropdown) {
        itemSearch.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length < 1) {
                itemDropdown.classList.remove('active');
                return;
            }

            const matches = ITEMS_LIST.filter(i =>
                i.toLowerCase().includes(query)
            ).slice(0, 8);

            if (matches.length > 0) {
                itemDropdown.innerHTML = matches.map(item =>
                    `<div class="dropdown-item" data-item="${item}">
                        <span>${item}</span>
                    </div>`
                ).join('');
                itemDropdown.classList.add('active');

                itemDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', function() {
                        itemSearch.value = this.dataset.item;
                        itemDropdown.classList.remove('active');
                    });
                });
            } else {
                itemDropdown.classList.remove('active');
            }
        });
    }

    // Command tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.commands-tab');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(`tab-${tab}`).classList.add('active');
        });
    });

    // Trade form submission
    const tradeForm = document.getElementById('tradeForm');
    const tradeModal = document.getElementById('tradeModal');
    const modalClose = document.getElementById('modalClose');
    const tradeCode = document.getElementById('tradeCode');
    const copyCode = document.getElementById('copyCode');

    if (tradeForm) {
        tradeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const pokemon = pokemonSearch.value;
            const shiny = shinyToggle.checked;
            const level = document.getElementById('levelInput').value;
            const nature = document.getElementById('natureSelect').value;
            const ability = document.getElementById('abilitySelect').value;
            const item = itemSearch.value;

            // Build the command
            let cmd = `/pkhex create pokemon:${pokemon}`;
            if (shiny) cmd += ' shiny:True';
            if (level !== '100') cmd += ` level:${level}`;
            if (nature) cmd += ` nature:${nature}`;
            if (ability) cmd += ` ability:${ability}`;
            if (item) cmd += ` helditem:${item}`;

            tradeCode.textContent = cmd;
            tradeModal.classList.add('active');
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            tradeModal.classList.remove('active');
        });
    }

    if (copyCode) {
        copyCode.addEventListener('click', () => {
            navigator.clipboard.writeText(tradeCode.textContent);
            copyCode.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyCode.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    }

    // Showdown import
    const importBtn = document.getElementById('importShowdown');
    const showdownInput = document.getElementById('showdownInput');

    if (importBtn && showdownInput) {
        importBtn.addEventListener('click', function() {
            const text = showdownInput.value;
            parseShowdownSet(text);
        });
    }

    function parseShowdownSet(text) {
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length === 0) return;

        // Parse first line: Pokemon @ Item
        const firstLine = lines[0];
        const atIndex = firstLine.indexOf('@');

        let pokemon = atIndex > -1 ? firstLine.substring(0, atIndex).trim() : firstLine.trim();
        pokemon = pokemon.split('(')[0].trim(); // Remove nickname

        if (atIndex > -1) {
            const item = firstLine.substring(atIndex + 1).trim();
            itemSearch.value = item;
        }

        pokemonSearch.value = pokemon;
        selectPokemon(pokemon);

        // Parse other lines
        lines.forEach(line => {
            if (line.startsWith('Ability:')) {
                const ability = line.replace('Ability:', '').trim();
                const abilitySelect = document.getElementById('abilitySelect');
                for (let opt of abilitySelect.options) {
                    if (opt.value.toLowerCase() === ability.toLowerCase()) {
                        abilitySelect.value = opt.value;
                        break;
                    }
                }
            }

            if (line.includes('Nature')) {
                const nature = line.split(' ')[0];
                document.getElementById('natureSelect').value = nature;
            }

            if (line.startsWith('EVs:')) {
                const evParts = line.replace('EVs:', '').split('/');
                evParts.forEach(part => {
                    const [val, stat] = part.trim().split(' ');
                    const statMap = {
                        'HP': 'evHP', 'Atk': 'evAtk', 'Def': 'evDef',
                        'SpA': 'evSpA', 'SpD': 'evSpD', 'Spe': 'evSpe'
                    };
                    if (statMap[stat]) {
                        document.getElementById(statMap[stat]).value = val;
                    }
                });
                // Trigger EV total update
                document.getElementById('evHP').dispatchEvent(new Event('input'));
            }
        });
    }

    // Load REAL stats from API
    loadRealStats();

    async function loadRealStats() {
        try {
            const response = await fetch('/api/stats');
            const result = await response.json();

            if (result.success && result.data) {
                const data = result.data;

                // Update stats with real data
                const totalTrades = document.getElementById('totalTrades');
                const activeBots = document.getElementById('activeBots');
                const botStatus = document.getElementById('botStatus');

                if (totalTrades) {
                    animateNumber(totalTrades, 0, data.totalTrades, 1500);
                }
                if (activeBots) {
                    activeBots.textContent = `${data.activeBots}/${data.totalBots}`;
                }
                if (botStatus) {
                    botStatus.textContent = data.status;
                    botStatus.style.color = data.status === 'Online' ? '#7AC74C' : '#F08030';
                }
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
            document.getElementById('botStatus').textContent = 'Error';
        }
    }

    // Refresh stats every 30 seconds
    setInterval(loadRealStats, 30000);

    function animateNumber(el, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(start + range * easeOutQuad(progress));
            el.textContent = value.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    // Hero Pokemon showcase rotation
    const showcasePokemon = document.getElementById('showcasePokemon');
    const showcaseList = [155, 157, 6, 9, 25, 149, 248, 445, 448, 94];
    let showcaseIndex = 0;

    setInterval(() => {
        showcaseIndex = (showcaseIndex + 1) % showcaseList.length;
        const dex = showcaseList[showcaseIndex];
        showcasePokemon.style.opacity = '0';

        setTimeout(() => {
            showcasePokemon.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`;
            showcasePokemon.style.opacity = '1';
        }, 300);
    }, 4000);

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.form-group')) {
            pokemonDropdown?.classList.remove('active');
            itemDropdown?.classList.remove('active');
        }
    });

    // Modal close on outside click
    tradeModal?.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    console.log('PKM-Universe Website loaded!');
});
