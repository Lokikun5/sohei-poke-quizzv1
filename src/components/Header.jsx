import soheiLogo from "/Image1.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div>
        <img src={soheiLogo} className="logo" alt="Vite logo" />
      </div>
      <h1>Master Quizz Pokemon</h1>
      <nav className="nav-links">
        <Link to="/presentateur" className="nav-button">Présentation</Link>
      </nav>
    </header>
  );
}

export default Header;