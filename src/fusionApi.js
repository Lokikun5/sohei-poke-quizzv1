const API_BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Récupère les informations d'un Pokémon à partir de son ID.
 * @param {number} pokemonId - ID du Pokémon
 * @returns {Promise<{ name: string, types: string[], sprite: string }>}
 */
async function getPokemonData(pokemonId) {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon/${pokemonId}`);
    if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);

    const data = await response.json();

    // Récupérer les types du Pokémon
    const types = data.types.map(t => t.type.name);

    // Récupérer l'URL pour le nom français
    const speciesResponse = await fetch(data.species.url);
    if (!speciesResponse.ok) throw new Error("Erreur lors de la récupération de l'espèce");

    const speciesData = await speciesResponse.json();
    const frenchName = speciesData.names.find(n => n.language.name === "fr")?.name || data.name;

    // Récupérer l'image officielle
    const sprite = data.sprites.other["official-artwork"].front_default;

    return { name: frenchName, types, sprite };
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du Pokémon ${pokemonId} :`, error);
    return null;
  }
}

export { getPokemonData };
