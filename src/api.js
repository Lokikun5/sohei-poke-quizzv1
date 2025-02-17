const API_BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Génère un nombre entier aléatoire entre min et max inclus.
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Récupère une génération Pokémon aléatoire et son nom en français.
 * @returns {Promise<{ id: number, name: string }>}
 */
export async function getRandomGeneration() {
  const generationId = getRandomNumber(1, 9);
  console.log(`🎲 Génération aléatoire choisie: ${generationId}`);

  try {
    const response = await fetch(`${API_BASE_URL}/generation/${generationId}`);
    if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);

    const data = await response.json();
    const frenchName = data.names.find(name => name.language.name === "fr")?.name || `Génération ${generationId}`;

    console.log(`📊 Génération récupérée: ${frenchName} (${generationId})`);
    console.log(`📜 Nombre de Pokémon dans cette génération: ${data.pokemon_species.length}`);

    return { id: generationId, name: frenchName, pokemon_species: data.pokemon_species };
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
  try {
    const response = await fetch(`${API_BASE_URL}/type/`);
    if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);

    const data = await response.json();
    const types = data.results.slice(0, 18);

    const randomType = types[getRandomNumber(0, types.length - 1)];

    console.log(`🎯 Type aléatoire choisi: ${randomType.name}`);
    return randomType.name;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des types :", error);
    return null;
  }
}

/**
 * Récupère les Pokémon d'une génération et filtre ceux qui correspondent au type donné.
 * @param {number} generationId - ID de la génération
 * @param {string} type - Type de Pokémon (ex: "grass", "fire")
 * @returns {Promise<Array>} - Liste des Pokémon filtrés avec leur nom français et sprite.
 */
export async function getFilteredPokemon(generationId, type) {
  try {
    console.log(`🔍 Début de la recherche des Pokémon de type "${type}" dans la génération ${generationId}`);

    const generationData = await fetch(`${API_BASE_URL}/generation/${generationId}`);
    if (!generationData.ok) throw new Error("Erreur lors de la récupération de la génération");
    const generation = await generationData.json();

    console.log(`📜 ${generation.pokemon_species.length} Pokémon dans la génération ${generationId}`);

    const pokemonList = [];

    for (const species of generation.pokemon_species) {
      console.log(`➡ Vérification du Pokémon: ${species.name}`);

      // Récupération des détails de l'espèce
      const speciesData = await fetch(species.url);
      if (!speciesData.ok) {
        console.warn(`⚠ Erreur lors de la récupération de l'espèce : ${species.name}`);
        continue;
      }
      const speciesDetails = await speciesData.json();

      // Trouver la variété par défaut
      const pokemonVariety = speciesDetails.varieties.find(v => v.is_default);
      if (!pokemonVariety) {
        console.warn(`⚠ Aucune variété par défaut pour ${species.name}`);
        continue;
      }

      // Récupération des détails du Pokémon
      const pokemonData = await fetch(pokemonVariety.pokemon.url);
      if (!pokemonData.ok) {
        console.warn(`⚠ Erreur lors de la récupération des détails du Pokémon : ${species.name}`);
        continue;
      }
      const pokemonDetails = await pokemonData.json();

      // Vérification du type
      const hasType = pokemonDetails.types.some(t => t.type.name === type);
      console.log(`🔎 ${species.name} → Type(s): ${pokemonDetails.types.map(t => t.type.name).join(", ")}`);

      if (!hasType) {
        console.log(`❌ ${species.name} exclu (pas du type ${type})`);
        continue;
      }

      // Récupération du nom français
      const frenchName = speciesDetails.names.find(n => n.language.name === "fr")?.name || species.name;
      const sprite = pokemonDetails.sprites.other["official-artwork"].front_default;

      console.log(`✅ ${species.name} validé: ${frenchName} (${type})`);
      pokemonList.push({ name: frenchName, sprite });
    }

    console.log(`✅ ${pokemonList.length} Pokémon de type "${type}" trouvés dans la génération ${generationId}`);
    return pokemonList;
  } catch (error) {
    console.error("❌ Erreur lors du filtrage des Pokémon :", error);
    return [];
  }
}