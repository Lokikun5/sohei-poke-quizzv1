const API_BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Génère un nombre entier aléatoire entre min et max inclus.
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Précharge toutes les générations (1 à 9) dans le cache local.
 */
export async function prefetchAllGenerations() {
  for (let generationId = 1; generationId <= 9; generationId++) {
    const generationKey = `generation-${generationId}`;
    if (!localStorage.getItem(generationKey)) {
      try {
        const response = await fetch(`${API_BASE_URL}/generation/${generationId}`);
        if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);
        const data = await response.json();
        const frenchName = data.names.find(name => name.language.name === "fr")?.name || `Génération ${generationId}`;
        const generationData = {
          id: generationId,
          name: frenchName,
          pokemon_species: data.pokemon_species
        };
        localStorage.setItem(generationKey, JSON.stringify(generationData));
        console.log(`Génération ${generationId} préchargée`);
      } catch (error) {
        console.error(`❌ Erreur lors de la précharge de la génération ${generationId} :`, error);
      }
    }
  }
}

/**
 * Récupère une génération Pokémon aléatoire et son nom en français.
 * @returns {Promise<{ id: number, name: string }>}
 */
export async function getRandomGeneration() {
  const generationId = getRandomNumber(1, 9);
  console.log(`🎲 Génération aléatoire choisie: ${generationId}`);

  // Vérifie si la génération est déjà en cache
  const cachedData = localStorage.getItem(`generation-${generationId}`);
  if (cachedData) {
    console.log("📌 Chargement depuis le cache local !");
    return JSON.parse(cachedData);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/generation/${generationId}`);
    if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);

    const data = await response.json();
    console.log("✅ Réponse complète de l'API :", data);
    const frenchName = data.names.find(name => name.language.name === "fr")?.name || `Génération ${generationId}`;

    const generationData = {
      id: generationId,
      name: frenchName,
      pokemon_species: data.pokemon_species
    };

    // Stocke les données en cache
    localStorage.setItem(`generation-${generationId}`, JSON.stringify(generationData));

    console.log(`📊 Génération récupérée: ${frenchName} (${generationId})`);
    return generationData;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de la génération :", error);
    return null;
  }
}

/**
 * Récupère un type Pokémon aléatoire parmi les 18 premiers types.
 * @returns {Promise<string>} - Nom du type en anglais.
 */
export async function getRandomType() {
  // Vérifie si les types sont déjà en cache
  const cachedTypes = localStorage.getItem("pokemon-types");
  let types;

  if (cachedTypes) {
    console.log("📌 Chargement des types depuis le cache !");
    types = JSON.parse(cachedTypes);
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/type/`);
      if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);

      const data = await response.json();
      types = data.results.slice(0, 18);

      // Stocke les types en cache
      localStorage.setItem("pokemon-types", JSON.stringify(types));
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des types :", error);
      return null;
    }
  }

  const randomType = types[getRandomNumber(0, types.length - 1)];
  console.log(`🎯 Type aléatoire choisi: ${randomType.name}`);
  return randomType.name;
}

/**
 * Récupère les Pokémon d'une génération et filtre ceux qui correspondent au type donné.
 * @param {number} generationId - ID de la génération
 * @param {string} type - Type de Pokémon (ex: "grass", "fire")
 * @returns {Promise<Array>} - Liste des Pokémon filtrés avec leur nom français et sprite.
 */
export async function getFilteredPokemon(generationId, type) {
  console.log(`🔍 Recherche des Pokémon de type "${type}" dans la génération ${generationId}`);

  // Vérifier si le résultat est déjà en cache
  const cacheKey = `pokemon-${generationId}-${type}`;
  const cachedPokemon = localStorage.getItem(cacheKey);
  if (cachedPokemon) {
    console.log("📌 Chargement des Pokémon depuis le cache !");
    return JSON.parse(cachedPokemon);
  }

  // Récupérer la génération depuis le cache
  const generationKey = `generation-${generationId}`;
  let generationData = localStorage.getItem(generationKey);
  if (generationData) {
    generationData = JSON.parse(generationData);
  } else {
    // Fallback : si la génération n'est pas en cache, la récupérer depuis l'API
    try {
      const response = await fetch(`${API_BASE_URL}/generation/${generationId}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération de la génération");
      const data = await response.json();
      const frenchName = data.names.find(name => name.language.name === "fr")?.name || `Génération ${generationId}`;
      generationData = {
        id: generationId,
        name: frenchName,
        pokemon_species: data.pokemon_species
      };
      localStorage.setItem(generationKey, JSON.stringify(generationData));
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de la génération :", error);
      return [];
    }
  }

  const pokemonList = [];
  for (const species of generationData.pokemon_species) {
    console.log(`➡ Vérification du Pokémon: ${species.name}`);
    try {
      const speciesResponse = await fetch(species.url);
      if (!speciesResponse.ok) continue;
      const speciesDetails = await speciesResponse.json();

      const pokemonVariety = speciesDetails.varieties.find(v => v.is_default);
      if (!pokemonVariety) continue;

      const pokemonResponse = await fetch(pokemonVariety.pokemon.url);
      if (!pokemonResponse.ok) continue;
      const pokemonDetails = await pokemonResponse.json();

      const hasType = pokemonDetails.types.some(t => t.type.name === type);
      if (!hasType) continue;

      const frenchName =
        speciesDetails.names.find(n => n.language.name === "fr")?.name || species.name;
      const sprite = pokemonDetails.sprites.other["official-artwork"].front_default;
      console.log(`✅ ${species.name} validé: ${frenchName} (${type})`);
      pokemonList.push({ name: frenchName, sprite });
    } catch (error) {
      console.error("❌ Erreur lors du traitement de ", species.name, error);
    }
  }

  // Stocker le résultat filtré en cache
  localStorage.setItem(cacheKey, JSON.stringify(pokemonList));
  console.log(`✅ ${pokemonList.length} Pokémon stockés en cache pour la génération ${generationId} et le type ${type}`);
  return pokemonList;
}