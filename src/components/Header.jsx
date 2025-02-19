import soheiLogo from "/Image1.png";

import NavMenu from "../components/NavMenu";
function Header() {
  return (
    <header>
      <div>
        <img src={soheiLogo} className="logo" alt="Vite logo" />
        <NavMenu />
      </div>
      <h1>Master Quizz Pokemon</h1>
      
    </header>
  );
}

export default Header;