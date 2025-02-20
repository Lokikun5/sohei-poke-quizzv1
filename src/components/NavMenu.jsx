import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";

function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Détection automatique du mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Gestion de l'affichage en fonction du type d'appareil
  const toggleMenu = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  // ✅ Ajout de la navigation avec les touches "1", "2", "3", "4"
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "1") {
        navigate("/");
      } else if (event.key === "2") {
        navigate("/presentateur");
      } else if (event.key === "3") {
        navigate("/infinite-fusion");
      } else if (event.key === "4") {
        navigate("/find-the-move/1");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  return (
    <div
      className="nav-menu"
      onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined}
    >
      <button className="nav-button" onClick={toggleMenu}>
        <Menu size={24} />
        <span className="menu-text">Menu</span>
        <ChevronDown size={20} />
      </button>

      {isOpen && (
        <div className="nav-popup">
          <Link to="/" className="nav-item" onClick={() => setIsOpen(false)}>Home (1)</Link>
          <Link to="/presentateur" className="nav-item" onClick={() => setIsOpen(false)}>Présentation (2)</Link>
          <Link to="/infinite-fusion" className="nav-item" onClick={() => setIsOpen(false)}>Infinite Fusion (3)</Link>
          <Link to="/find-the-move/1" className="nav-item" onClick={() => setIsOpen(false)}>Find The Move (4)</Link>
        </div>
      )}
    </div>
  );
}

export default NavMenu;