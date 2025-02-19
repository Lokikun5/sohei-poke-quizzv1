import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";

function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
          <Link to="/" className="nav-item" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/presentateur" className="nav-item" onClick={() => setIsOpen(false)}>Présentation</Link>
          <Link to="/infinite-fusion" className="nav-item" onClick={() => setIsOpen(false)}>Infinite Fusion</Link>
          <Link to="/find-the-move/1" className="nav-item" onClick={() => setIsOpen(false)}>Find The Move</Link>
        </div>
      )}
    </div>
  );
}

export default NavMenu;