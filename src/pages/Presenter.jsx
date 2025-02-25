import { useState, useEffect } from "react";
import { getFilteredPokemon, prefetchAllGenerations } from "../api";
import NavMenu from "../components/NavMenu";
import "../App.scss";

function Presenter() {
  const [generationId, setGenerationId] = useState(1);
  const [pokemonType, setPokemonType] = useState("fire");
  const [filteredPokemon, setFilteredPokemon] = useState([]);

  const generations = [
    { id: 1, name: "Génération I" },
    { id: 2, name: "Génération II" },
    { id: 3, name: "Génération III" },
    { id: 4, name: "Génération IV" },
    { id: 5, name: "Génération V" },
    { id: 6, name: "Génération VI" },
    { id: 7, name: "Génération VII" },
    { id: 8, name: "Génération VIII" },
    { id: 9, name: "Génération IX" },
  ];

  const types = [
    "normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel",
    "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"
  ];

  // Précharger les générations (optionnel si déjà effectué dans App)
  useEffect(() => {
    prefetchAllGenerations();
  }, []);

  // Met à jour la liste des Pokémon en fonction de la génération et du type sélectionnés
  useEffect(() => {
    async function fetchData() {
      const pokemonList = await getFilteredPokemon(generationId, pokemonType);
      setFilteredPokemon(pokemonList);
    }
    fetchData();
  }, [generationId, pokemonType]);

  return (
    <>
      <h2>Vue Présentateur : Sélectionnez la Génération et le Type</h2>
      <NavMenu />
      <div className="filters">
        <div className="filter-group">
          <label>Génération :</label>
          <select value={generationId} onChange={(e) => setGenerationId(Number(e.target.value))} className="filter-select">
            {generations.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type :</label>
          <select value={pokemonType} onChange={(e) => setPokemonType(e.target.value)} className="filter-select">
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="result">
        <h3>{filteredPokemon.length} Pokémon trouvés :</h3>
        <div className="pokemon-grid">
          {filteredPokemon.map((pokemon, index) => (
            <div key={index} className="pokemon-card">
              <img src={pokemon.sprite} alt={pokemon.name} />
              <p>{pokemon.name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Presenter;