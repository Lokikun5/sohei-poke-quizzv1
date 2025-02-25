import { useState, useEffect } from "react";
import { getRandomGeneration, getRandomType, getFilteredPokemon, prefetchAllGenerations } from "./api";
import Header from "./components/Header";
import FullscreenButton from "./components/FullscreenButton";
import "./App.scss";
import pikaquizz from "../public/pikaquizz.jpg";
import sonia from "../public/Sonia_Emote_3_Masters.png";
import icons from "./data/icons";

const generationRegions = {
  1: "Kanto",
  2: "Johto",
  3: "Hoenn",
  4: "Sinnoh",
  5: "Unys",
  6: "Kalos",
  7: "Alola",
  8: "Galar",
  9: "Paldea"
};

function App() {
  const [generation, setGeneration] = useState(null);
  const [pokemonType, setPokemonType] = useState(null);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Précharger toutes les générations au lancement de l'application
  useEffect(() => {
    prefetchAllGenerations();
  }, []);

  // Fonction pour récupérer une nouvelle question avec indication de chargement
  const fetchNewQuestion = async () => {
    setIsLoading(true);
    const genData = await getRandomGeneration();
    const typeData = await getRandomType();

    setGeneration(genData);
    setPokemonType(typeData);

    if (genData && typeData) {
      const pokemonList = await getFilteredPokemon(genData.id, typeData);
      setFilteredPokemon(pokemonList);
      setCorrectAnswers(0);
      setShowAnswers(false);
    }
    setIsLoading(false);
  };

  // Charger les premières données
  useEffect(() => {
    fetchNewQuestion();
  }, []);

  // Gestion des bonnes réponses
  const handleCorrectAnswer = () => {
    setCorrectAnswers((prev) => {
      const newCount = prev + 1;
      if (newCount >= filteredPokemon.length) {
        setShowAnswers(true);
      }
      return newCount;
    });
  };

  // Gestion des touches
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase();

      if (key === "s") {
        setShowAnswers((prev) => !prev);
      } else if (key === "y") {
        handleCorrectAnswer();
      } else if (key === "r") {
        fetchNewQuestion();
      } else if (key === "g") {
        setShowGame(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [filteredPokemon.length]);

  // Écran d'introduction
  if (!showGame) {
    return (
      <div className="intro-screen">
        <Header />
        <FullscreenButton />

        <h1>Bienvenue sur le Quizz Pokémon !</h1>
        <p>Votre objectif est de retrouver les Pokémon correspondant au type et à la génération affichés.</p>

        <button className="start-button" onClick={() => setShowGame(true)}>GO</button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <FullscreenButton />

      {/* Affichage d'un indicateur de chargement */}
      {isLoading && (
        <div className="loading-overlay">
          <p>Chargement des nouvelles données...</p>
          <div className="mystery-image">
          <img src={sonia} alt="sonia Pokémon" />
        </div>
        </div>
      )}

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
            {pokemonType}" de la {generation.name}{" "}
            {generation.id && generationRegions[generation.id] ? `(${generationRegions[generation.id]})` : "(Aucune région détectée)"}
          </>
        ) : (
          "Chargement des données..."
        )}
      </h2>

      <section className="result">
        <h3>{filteredPokemon.length} Pokémon à trouver :</h3>

        <div className="mystery-image">
          <img src={pikaquizz} alt="Mystery Pokémon" />
        </div>

        <p className="score">Bonnes réponses : {correctAnswers} / {filteredPokemon.length}</p>
        <div className="btn-section">
          <button onClick={fetchNewQuestion} className="reload-button" disabled={isLoading}>
            Nouvelle Question (R)
          </button>
          <button onClick={() => setShowAnswers(true)} className="answer-button" disabled={isLoading}>
            Afficher les réponses (S)
          </button>
        </div>

        {showAnswers && (
          <div className="pokemon-grid">
            {filteredPokemon.map((pokemon, index) => (
              <div 
                key={index} 
                className="pokemon-card"
                onClick={handleCorrectAnswer}
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