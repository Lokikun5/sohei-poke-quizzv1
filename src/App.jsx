import { useState, useEffect } from "react";
import { getRandomGeneration, getRandomType, getFilteredPokemon } from "./api";
import Header from "./components/Header";
import FullscreenButton from "./components/FullscreenButton";
import "./App.scss";
import pikaquizz from "../public/pikaquizz.jpg";
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
  const [correctAnswers, setCorrectAnswers] = useState(0); // ✅ Compteur de bonnes réponses
  const [showGame, setShowGame] = useState(false); // ✅ Affichage du jeu après l'écran d'accueil

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

  // ✅ Gestion des touches
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
        setShowGame(true); // ✅ Touche "G" pour afficher le jeu
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [filteredPokemon.length]);

  // ✅ Écran d'introduction (avant d'afficher le jeu)
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

  // ✅ Affichage du jeu
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
            {pokemonType}" de la {generation.name}{" "}
            {generation.id && generationRegions[generation.id] ? `(${generationRegions[generation.id]})` : "(Aucune région détectée)"}
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
             Nouvelle Question (R)
          </button>

          {/* ✅ Bouton pour afficher les réponses */}
          <button onClick={() => setShowAnswers(true)} className="answer-button">
            Afficher les réponses (S)
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