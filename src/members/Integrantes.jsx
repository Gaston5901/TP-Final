import React, { useEffect, useState } from "react";
import axios from "axios";
import './Integrantes.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

function Integrantes() {
  const [integrantes, setIntegrantes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/integrantes")
      .then(res => setIntegrantes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>   
   <Header />       
    <div>
       <div className="integrantes-wrapper"> 
      <h2 className="integrantes-title">Integrantes</h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "1.5rem" }}>
        Te presentamos al equipo de desarrollo de <b>GYM TRIDENT</b>: estudiantes apasionados y dedicados que trabajaron en conjunto para crear y mejorar esta plataforma. ¡Gracias por confiar en nuestro trabajo!
      </p>
        </div>

      <div className="integrantes-container">
        {integrantes.map(integrante => (
          <div key={integrante.id} className="integrante-card">
            <img
              src={integrante.foto}
              alt={integrante.nombre}
              className="integrante-foto"
            />
            <div className="integrante-info">
              <p><strong>Nombre:</strong> {integrante.nombre}</p>
              <p><strong>Legajo:</strong> {integrante.legajo}</p>
              {integrante.url && (
                <a
                  href={integrante.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                  title="Ver perfil de GitHub"
                  style={{ display: "inline-block", marginTop: 4 }}
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                    alt="GitHub"
                    width={28}
                    height={28}
                    style={{ verticalAlign: "middle" }}
                  />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
        <Footer />
     </>
  );
}

export default Integrantes;