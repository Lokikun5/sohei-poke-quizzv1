import { useState, useEffect } from "react";

function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ✅ Fonction pour activer/désactiver le plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Erreur lors du passage en plein écran :", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // ✅ Gestion de la touche "F" pour basculer en plein écran
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <button onClick={toggleFullscreen} className="fullscreen-button">
      {isFullscreen ? "Quitter le plein écran (F) " : "Passer en plein écran (F)"}
    </button>
  );
}

export default FullscreenButton;