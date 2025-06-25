import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} GYM TRIDENT. Todos los derechos reservados.
    </footer>
  );
}

export default Footer;