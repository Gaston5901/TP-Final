import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <nav className="home-nav">
      <span className="home-logo">GYM TRIDENT 🔱</span>
      <div>
        <Link to="/" className="home-link">Inicio</Link>
        <Link to="/login" className="home-link">Login</Link>
        <Link to="/clasesvista" className="home-link">Clases</Link>
      </div>
    </nav>
  );
}

export default Header;