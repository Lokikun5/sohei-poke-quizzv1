import { useEffect, useState } from "react";
import NavMenu from "../components/NavMenu";
import { getPokemonData } from "../fusionApi";
import imagesData from "../data/images.json";
import ADN from "/Miniature_Pointeau_ADN_EV.png";
import soheiLogo from "/Image1.png";
import icons from "../data/icons";
import "../App.scss";

function InfiniteFusion() {
  const [fusion, setFusion] = useState(null);
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [showOriginals, setShowOriginals] = useState(false);
  const [showHint, setShowHint] = useState(false); // ✅ État pour afficher les indices des types
  const [showGame, setShowGame] = useState(false); // ✅ Ajout d'un écran d'intro

  // ✅ Fonction pour sélectionner une nouvelle fusion aléatoire
  const fetchNewFusion = async () => {
    const randomFusion = imagesData[Math.floor(Math.random() * imagesData.length)];
    setFusion(randomFusion);
    setShowOriginals(false); // ✅ Réinitialise la réponse
    setShowHint(false); // ✅ Cache les indices lors du rechargement

    if (randomFusion) {
      const data1 = await getPokemonData(randomFusion.firstId);
      const data2 = await getPokemonData(randomFusion.secondId);
      setPokemon1(data1);
      setPokemon2(data2);
    }
  };

  // Charge une première fusion au montage
  useEffect(() => {
    fetchNewFusion();
  }, []);

  // ✅ Gestion des touches "S" pour la réponse, "R" pour relancer et "I" pour afficher les indices
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase();

      if (key === "s") {
        setShowOriginals(true);
      } else if (key === "r") {
        fetchNewFusion();
      } else if (key === "i") {
        setShowHint((prev) => !prev);
      } else if (key === "g") {
        setShowGame(true); // ✅ Touche "G" pour afficher le jeu
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // ✅ Écran d'introduction avant d'afficher le jeu
  if (!showGame) {
    return (
      <div className="intro-screen">
        <img src={soheiLogo} className="logo" alt="Vite logo" />
        <NavMenu />

        <h1>Bienvenue sur Infinite Fusion !</h1>
        <p>Essayez de deviner les deux Pokémon fusionnés à partir de l'image.</p>

        <button className="start-button" onClick={() => setShowGame(true)}>GO</button>
      </div>
    );
  }

  // ✅ Affichage du jeu
  return (
    <div className="fusion-container">
      <div className="flex-col">
        <img src={soheiLogo} className="logo" alt="Vite logo" />
        <NavMenu />
      </div>

      <div className="name-section">
        <img className="ANDimg" src={ADN} alt="Pointeau ADN" />
        <h2>Devinez les Pokémon fusionnés !</h2>
      </div>

      {/* Affichage de la fusion */}
      {fusion && (
        <div className="fusion-card">
          <img 
            src={`${import.meta.env.BASE_URL}${fusion.path.replace(/^\/+/, "")}`} 
            alt={`Fusion de ${fusion.firstId} et ${fusion.secondId}`} 
          />
        </div>
      )}

      {/* ✅ Bouton pour révéler l'indice des types */}
      <button className="hint-button" onClick={() => setShowHint((prev) => !prev)}>
        {showHint ? "Masquer l'indice" : "Découvrir l'indice (I)"}
      </button>

      {/* ✅ Affichage des types (caché par défaut) */}
      {showHint && pokemon1 && pokemon2 && (
        <div className="type-info">
          <p>Types des Pokémon d'origine :</p>
          <div className="types-container">
            {pokemon1.types.map((type, index) => (
              <span key={`pokemon1-type-${index}`} style={{ marginRight: 8, display: "inline-flex", alignItems: "center", fontSize: 30 }}>
                <span className={`icon ${type.toLowerCase()}`} style={{ display: "inline-block" }}>
                  <img src={icons[type.toLowerCase()]} alt={type} />
                </span>
                {type}
              </span>
            ))} 
            /
            {pokemon2.types.map((type, index) => (
              <span key={`pokemon2-type-${index}`} style={{ marginLeft: 8, display: "inline-flex", alignItems: "center", fontSize: 30 }}>
                <span className={`icon ${type.toLowerCase()}`} style={{ display: "inline-block" }}>
                  <img src={icons[type.toLowerCase()]} alt={type} />
                </span>
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Boutons de contrôle */}
      <div className="buttons-container">
        <button className="reload-button" onClick={fetchNewFusion}>
           Nouvelle Fusion (R)
        </button>
        <button className="answer-button" onClick={() => setShowOriginals(true)}>
          Révéler les Pokémon d'origine (S)
        </button>
      </div>

      {/* Affichage des Pokémon d'origine */}
      {showOriginals && pokemon1 && pokemon2 && (
        <div className="original-pokemon">
          <div className="pokemon-card">
            <img src={pokemon1.sprite} alt={pokemon1.name} />
            <p>{pokemon1.name}</p>
          </div>
          <div className="pokemon-card">
            <img src={pokemon2.sprite} alt={pokemon2.name} />
            <p>{pokemon2.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfiniteFusion;