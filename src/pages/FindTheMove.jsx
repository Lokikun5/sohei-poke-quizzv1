import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  // ✅ Fonction de navigation (toujours à jour)
  const goToNext = useCallback(() => {
    if (moveId < moves.length) navigate(`/find-the-move/${moveId + 1}`);
  }, [moveId, navigate]);

  const goToPrevious = useCallback(() => {
    if (moveId > 1) navigate(`/find-the-move/${moveId - 1}`);
  }, [moveId, navigate]);

  // ✅ Réinitialisation de la réponse lorsqu'on change de question
  useEffect(() => {
    setShowAnswer(false);
  }, [moveId]);

  // ✅ Gestion du clavier pour la navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase();

      if (key === "s") {
        setShowAnswer(true); // ✅ Affiche la réponse avec "S"
      } else if (key === "n") {
        goToNext(); // ✅ Page suivante avec "N"
      } else if (key === "p") {
        goToPrevious(); // ✅ Page précédente avec "P"
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [goToNext, goToPrevious]); // ✅ Ajout des dépendances pour toujours utiliser les bonnes valeurs

  if (!move) {
    return <h2>Attaque non trouvée !</h2>;
  }

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
          src={`${import.meta.env.BASE_URL}${move.path.replace(/^\/+/, "")}`} 
          alt={`Indice pour ${move.name}`} 
          onClick={() => setShowAnswer(true)}
          className="move-image"
        />
      </div>

      {/* Affichage de la réponse */}
      {showAnswer && <h3 className="move-answer">{move.answer}</h3>}

      {/* Navigation */}
      <div className="navigation-buttons">
        <button onClick={goToPrevious} disabled={moveId === 1}>⬅ Précédent (P)</button>
        <button onClick={goToNext} disabled={moveId === moves.length}>Suivant (N) ➡</button>
      </div>
    </div>
  );
}

export default FindTheMove;