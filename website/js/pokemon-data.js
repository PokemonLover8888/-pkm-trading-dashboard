// Pokemon Data for PKM-Universe Website
const POKEMON_LIST = [
    "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
    "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree",
    "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot",
    "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok",
    "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran-F", "Nidorina",
    "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Clefairy", "Clefable",
    "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat",
    "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth",
    "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck",
    "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl",
    "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp",
    "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel",
    "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro",
    "Magnemite", "Magneton", "Farfetchd", "Doduo", "Dodrio", "Seel", "Dewgong",
    "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar",
    "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode",
    "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan",
    "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey",
    "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking",
    "Staryu", "Starmie", "Mr-Mime", "Scyther", "Jynx", "Electabuzz", "Magmar",
    "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee",
    "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar",
    "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos",
    "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew",
    "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion",
    "Totodile", "Croconaw", "Feraligatr", "Sentret", "Furret", "Hoothoot",
    "Noctowl", "Ledyba", "Ledian", "Spinarak", "Ariados", "Crobat", "Chinchou",
    "Lanturn", "Pichu", "Cleffa", "Igglybuff", "Togepi", "Togetic", "Natu",
    "Xatu", "Mareep", "Flaaffy", "Ampharos", "Bellossom", "Marill", "Azumarill",
    "Sudowoodo", "Politoed", "Hoppip", "Skiploom", "Jumpluff", "Aipom",
    "Sunkern", "Sunflora", "Yanma", "Wooper", "Quagsire", "Espeon", "Umbreon",
    "Murkrow", "Slowking", "Misdreavus", "Unown", "Wobbuffet", "Girafarig",
    "Pineco", "Forretress", "Dunsparce", "Gligar", "Steelix", "Snubbull",
    "Granbull", "Qwilfish", "Scizor", "Shuckle", "Heracross", "Sneasel",
    "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Swinub", "Piloswine",
    "Corsola", "Remoraid", "Octillery", "Delibird", "Mantine", "Skarmory",
    "Houndour", "Houndoom", "Kingdra", "Phanpy", "Donphan", "Porygon2",
    "Stantler", "Smeargle", "Tyrogue", "Hitmontop", "Smoochum", "Elekid",
    "Magby", "Miltank", "Blissey", "Raikou", "Entei", "Suicune", "Larvitar",
    "Pupitar", "Tyranitar", "Lugia", "Ho-Oh", "Celebi"
];

const ITEMS_LIST = [
    "Life Orb", "Choice Scarf", "Choice Band", "Choice Specs", "Leftovers",
    "Focus Sash", "Assault Vest", "Rocky Helmet", "Eviolite", "Black Sludge",
    "Heavy-Duty Boots", "Air Balloon", "Weakness Policy", "Flame Orb",
    "Toxic Orb", "Light Ball", "Thick Club", "Metal Coat", "Kings Rock",
    "Dragon Scale", "Up-Grade", "Dubious Disc", "Protector", "Electirizer",
    "Magmarizer", "Razor Fang", "Razor Claw", "Reaper Cloth", "Prism Scale",
    "Expert Belt", "Muscle Band", "Wise Glasses", "Scope Lens", "Wide Lens",
    "Zoom Lens", "Metronome", "Iron Ball", "Lagging Tail", "Quick Claw",
    "Bright Powder", "White Herb", "Mental Herb", "Power Herb", "Absorb Bulb",
    "Cell Battery", "Red Card", "Eject Button", "Sitrus Berry", "Lum Berry"
];

const ABILITIES = {
    "Bulbasaur": ["Overgrow", "Chlorophyll"],
    "Charmander": ["Blaze", "Solar Power"],
    "Squirtle": ["Torrent", "Rain Dish"],
    "Pikachu": ["Static", "Lightning Rod"],
    "Eevee": ["Run Away", "Adaptability", "Anticipation"],
    "Garchomp": ["Sand Veil", "Rough Skin"],
    "Lucario": ["Steadfast", "Inner Focus", "Justified"],
    "Gengar": ["Cursed Body"],
    "Dragonite": ["Inner Focus", "Multiscale"],
    "Tyranitar": ["Sand Stream", "Unnerve"],
    "Charizard": ["Blaze", "Solar Power"],
    "Gyarados": ["Intimidate", "Moxie"],
    "Alakazam": ["Synchronize", "Inner Focus", "Magic Guard"],
    "Mewtwo": ["Pressure", "Unnerve"],
    "Snorlax": ["Immunity", "Thick Fat", "Gluttony"]
};

function getDexNumber(name) {
    const index = POKEMON_LIST.findIndex(p =>
        p.toLowerCase() === name.toLowerCase()
    );
    return index !== -1 ? index + 1 : 25;
}

function getPokemonSprite(name, shiny = false) {
    const dex = getDexNumber(name);
    const shinyPath = shiny ? 'shiny/' : '';
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${dex}.png`;
}

function getAbilities(pokemon) {
    return ABILITIES[pokemon] || ["Ability 1", "Ability 2"];
}
