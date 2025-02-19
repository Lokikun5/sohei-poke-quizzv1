import { useState, useEffect } from "react";
import { getRandomGeneration, getRandomType, getFilteredPokemon } from "./api";
import Header from "./components/Header";
import FullscreenButton from "./components/FullscreenButton";
import "./App.scss";
import pikaquizz from "../public/pikaquizz.jpg";
import icons from "./data/icons";

function App() {
  const [generation, setGeneration] = useState(null);
  const [pokemonType, setPokemonType] = useState(null);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0); // ✅ Compteur de bonnes réponses

  // ✅ Fonction pour récupérer une nouvelle question
  const fetchNewQuestion = async () => {
    const genData = await getRandomGeneration();
    const typeData = await getRandomType();

    setGeneration(genData);
    setPokemonType(typeData);

    if (genData && typeData) {
      const pokemonList = await getFilteredPokemon(genData.id, typeData);
      setFilteredPokemon(pokemonList);
      setCorrectAnswers(0); // ✅ Réinitialiser le compteur
      setShowAnswers(false); // ✅ Masquer les réponses
    }
  };

  // Charger les premières données
  useEffect(() => {
    fetchNewQuestion();
  }, []);

  // ✅ Fonction pour gérer les bonnes réponses
  const handleCorrectAnswer = () => {
    setCorrectAnswers((prev) => {
      const newCount = prev + 1;
      if (newCount >= filteredPokemon.length) {
        setShowAnswers(true); // ✅ Affiche la réponse automatiquement quand toutes les bonnes réponses sont trouvées
      }
      return newCount;
    });
  };

  // ✅ Gestion de la touche "S" pour afficher les réponses
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "s") {
        setShowAnswers((prev) => !prev);
      } else if (event.key.toLowerCase() === "y") {
        handleCorrectAnswer(); // ✅ Ajout d'une bonne réponse en appuyant sur "Y"
      } else if (event.key.toLowerCase() === "r") {
        fetchNewQuestion(); // ✅ Recharger la question avec la touche "R"
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [filteredPokemon.length]);

  return (
    <>
      <Header />
      <FullscreenButton />
      
      <h2>
        {generation && pokemonType ? (
          <>
            Nous cherchons des Pokémon de type "
            <span className={`icon ${pokemonType.toLowerCase()}`} style={{ display: "inline-flex", alignItems: "center", marginRight: 5 }}>
              <img
                src={icons[pokemonType.toLowerCase()]}
                alt={pokemonType}
                style={{ width: 24, height: 24 }}
              />
            </span>
            {pokemonType}" de la {generation.name} {generation.region ? ` (${generation.region})` : ""}
          </>
        ) : (
          "Chargement des données..."
        )}
      </h2>

      <section className="result">
        <h3>{filteredPokemon.length} Pokémon à trouver :</h3>

        {/* Cercle noir avec point d'interrogation */}
        <div className="mystery-image">
          <img src={pikaquizz} alt="Mystery Pokémon" />
        </div>

        {/* ✅ Affichage du compteur de bonnes réponses */}
        <p className="score">Bonnes réponses : {correctAnswers} / {filteredPokemon.length}</p>
        <div className="btn-section">
          {/* ✅ Bouton pour recharger la question sans quitter le plein écran */}
          <button onClick={fetchNewQuestion} className="reload-button">
             Nouvelle Question
          </button>

          {/* ✅ Bouton pour afficher les réponses */}
          <button onClick={() => setShowAnswers(true)} className="answer-button">
            Afficher les réponses
          </button>
        </div>

        {/* Liste des Pokémon (affichée seulement si `showAnswers` est `true`) */}
        {showAnswers && (
          <div className="pokemon-grid">
            {filteredPokemon.map((pokemon, index) => (
              <div 
                key={index} 
                className="pokemon-card"
                onClick={handleCorrectAnswer} // ✅ Clic = bonne réponse
              >
                <img src={pokemon.sprite} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default App;