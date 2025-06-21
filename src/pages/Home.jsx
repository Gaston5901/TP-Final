import { Link } from "react-router-dom";
import React from "react";
import "./Home.css";

const imagenesCarrusel = [
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNbVPWYFpB7-f36BIcAfCJoZ_hNZwG5oueEA&s",
    titulo: "Resistencia",
  },
  {
    url: "https://www.webconsultas.com/sites/default/files/styles/wc_adaptive_image__small/public/media/0d/temas/gimnasio-primera-vez.jpg.webp",
    titulo: "Fitness",
  },
  {
    url: "https://media.istockphoto.com/id/2175627911/es/foto/atleta-femenina-empujando-un-trineo-con-peso-en-un-gimnasio-vista-superior-de-una-mujer.jpg?s=612x612&w=0&k=20&c=IS2LF4Z4GSmjcODr8MzaUNjq0iKo8GsDo-P-CtPkoVQ=",
    titulo: "Funcional",
  },
];

function Home() {
  return (
    <div id="home-page">
      
      <nav className="home-nav">
        <span className="home-logo">GYM TRIDENT 🔱</span>
        <div>
          <Link to="/" className="home-link">
            Inicio
          </Link>
          <Link to="/login" className="home-link">
            Login
          </Link>
          <Link to="/clasesvista" className="home-link">
            Clases
          </Link>
        </div>
      </nav>
    
      {/* CARRUSEL */}
      <section className="home-carrusel-section">
        <Carrusel imagenes={imagenesCarrusel} />
      </section>

      {/* CATÁLOGOS */}
      <section className="home-catalogos">
        <h2>Catálogos</h2>
        <ul>
          <li>Clases grupales</li>
          <li>Entrenamiento personalizado</li>
          <li>Planes y membresías</li>
          <li>Horarios</li>
        </ul>
      </section>

      {/* UBICACIÓN */}
      <section className="home-ubicacion">
        <h2>Ubicación</h2>
        <ul
          style={{listStyle: "none",padding: 0,fontSize: "1.1rem",lineHeight: "2",}}>
          <li>
            <span role="img" aria-label="ubicación">
              📌
            </span>
            <b> Dirección:</b> Av. Chacabuco 1234, Tucuman, Argentina
          </li>
          <li>
            <span role="img" aria-label="teléfono">
              📞
            </span>
            <b> Teléfono:</b> +54 9 11 1234-5678
          </li>
          <li>
            <span role="img" aria-label="email">
              ✉️
            </span>
            <b> Email:</b> contacto@gymtrident.com
          </li>
          <li>
            <span role="img" aria-label="horario">
              ⏰
            </span>
            <b> Horario:</b> Lunes a Sábado 8:00 a 22:00
          </li>
        </ul>
       
      </section>
    </div>
    
  );
}

// Carrusel simple con React y CSS
function Carrusel({ imagenes }) {
  const [actual, setActual] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActual((a) => (a + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(id);
  }, [imagenes.length]);

  return (
    <div className="home-carrusel">
      {imagenes.map((img, idx) => (
        <div
          key={idx}
          className={`home-carrusel-item${
            idx === actual ? " activo" : ""
          }`}
          style={{ backgroundImage: `url(${img.url})` }}
        >
          <div className="home-carrusel-titulo">{img.titulo}</div>
        </div>
      ))}
      <div className="home-carrusel-dots">
        {imagenes.map((_, idx) => (
          <span
            key={idx}
            className={idx === actual ? "dot activo" : "dot"}
            onClick={() => setActual(idx)}
          ></span>
        ))}




      </div>
    </div>
    
  );
}

export default Home;