import { useEffect, useState } from "react";
import { getPokemonData } from "../fusionApi";
import imagesData from "../data/images.json";
import ADN from "/Miniature_Pointeau_ADN_EV.png";
import soheiLogo from "/Image1.png";
import "../App.scss";

function InfiniteFusion() {
  const [fusion, setFusion] = useState(null);
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [showOriginals, setShowOriginals] = useState(false);

  // Sélectionne une fusion aléatoire
  useEffect(() => {
    const randomFusion = imagesData[Math.floor(Math.random() * imagesData.length)];
    setFusion(randomFusion);

    // Récupère les données des Pokémon d'origine
    async function fetchPokemonData() {
      if (!randomFusion) return;
      const data1 = await getPokemonData(randomFusion.firstId);
      const data2 = await getPokemonData(randomFusion.secondId);
      setPokemon1(data1);
      setPokemon2(data2);
    }

    fetchPokemonData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "s") {
        setShowOriginals(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="fusion-container">
         <img src={soheiLogo} className="logo" alt="Vite logo" />
        <div className="name-section">
            <img className="ANDimg" src={ADN} alt="Pointeau ADN" />
            <h2> Devinez les Pokémon fusionnés !</h2>
        </div>

      {/* Affichage de la fusion */}
      {fusion && (
        <div className="fusion-card">
          <img src={fusion.path} alt={`Fusion de ${fusion.firstId} et ${fusion.secondId}`} />
        </div>
      )}

      {/* Affichage des types des Pokémon d'origine */}
      {pokemon1 && pokemon2 && (
        <div className="type-info">
        <p>Types des Pokémon d'origine :</p>
        <div className="types-container">
          {pokemon1.types.map((type, index) => (
            <span key={`pokemon1-type-${index}`} style={{ marginRight: 8, display: "inline-flex", alignItems: "center", fontSize:30 }}>
              <span className={`icon ${type.toLowerCase()}`} style={{ display: "inline-block" }}>
                <img src={`/icons/${type.toLowerCase()}.svg`} alt={type} />
              </span>
              {type}
            </span>
          ))} 
          /
          {pokemon2.types.map((type, index) => (
            <span key={`pokemon2-type-${index}`} style={{ marginLeft: 8, display: "inline-flex", alignItems: "center", fontSize:30  }}>
              <span className={`icon ${type.toLowerCase()}`} style={{ display: "inline-block" }}>
                <img src={`/icons/${type.toLowerCase()}.svg`} alt={type} />
              </span>
              {type}
            </span>
          ))}
        </div>
      </div>
      
      
      )}

      {/* Bouton pour révéler les Pokémon d'origine */}
      <button className="answer-button" onClick={() => setShowOriginals(true)}>
        Révéler les Pokémon d'origine
      </button>

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