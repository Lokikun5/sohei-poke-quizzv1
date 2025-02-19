import { useState, useEffect } from "react";
import { useParams, useNavigate, Link  } from "react-router-dom";
import moves from "../data/moves.json";
import soheiLogo from "/Image1.png";
import NavMenu from "../components/NavMenu";
import "../App.scss";

function FindTheMove() {
  const { id } = useParams();
  const moveId = parseInt(id, 10);
  const navigate = useNavigate();

  const move = moves.find((m) => m.id === moveId);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
  }, [moveId]); 

  useEffect(() => {
    // Gestion de la touche "S" pour révéler la réponse
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "s") {
        setShowAnswer(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  if (!move) {
    return <h2>Attaque non trouvée !</h2>;
  }

  // Navigation entre les attaques
  const goToNext = () => {
    if (moveId < moves.length) navigate(`/find-the-move/${moveId + 1}`);
  };

  const goToPrevious = () => {
    if (moveId > 1) navigate(`/find-the-move/${moveId - 1}`);
  };

  return (
    <div className="move-container">
        <NavMenu />
        <div>
            <img src={soheiLogo} className="logo" alt="Vite logo" />
        </div>
        <h1>Find The Move {move.id}</h1>
        <h2 className="move-instructions">
            Trouve le nom de l’attaque représentée par cette image.
        </h2>

      {/* Image de l'attaque */}
      <div className="move-card">
        <img 
          src={move.path} 
          alt={`Indice pour ${move.name}`} 
          onClick={() => setShowAnswer(true)}
          className="move-image"
        />
      </div>

      {/* Affichage de la réponse */}
      {showAnswer && <h3 className="move-answer">{move.answer}</h3>}

      {/* Navigation */}
      <div className="navigation-buttons">
        <button onClick={goToPrevious} disabled={moveId === 1}>Précédent</button>
        <button onClick={goToNext} disabled={moveId === moves.length}>Suivant</button>
      </div>
    </div>
  );
}

export default FindTheMove;