import "./Footer.css";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  let content;
  if (location.pathname === "/") {
    content = (
      <>
        © {new Date().getFullYear()} GYM TRIDENT. Todos los derechos reservados. <br />
        📍<a href="https://maps.app.goo.gl/i1ac3ufe22VELCHJ6?g_st=aw" target="_blank" rel="noopener noreferrer">Ubicación</a>
        &nbsp;|&nbsp;📞 Teléfono: +54 9 11 1234-5678
      </>
    );
  
  } else if (location.pathname === "/clasesvista" || location.pathname === "/integrantes") {
    content = (
      <>
        © {new Date().getFullYear()}
GYM TRIDENT. Todos los derechos reservados.
      </>
    );
  } else {
    content = (
      <>
        © {new Date().getFullYear()} GYM TRIDENT. Todos los derechos reservados. 📍<a href="https://maps.app.goo.gl/i1ac3ufe22VELCHJ6?g_st=aw" target="_blank" rel="noopener noreferrer">Ubicación</a>
📞 Teléfono: +54 9 11 1234-5678
✉️ Email: contacto@gymtrident.com

      </>
    );
  }

  return (
    <footer className="footer">
      {content}
    </footer>
  );
}

export default Footer;