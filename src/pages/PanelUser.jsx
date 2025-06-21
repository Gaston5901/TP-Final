import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./PanelUser.css";

function PanelUsuario() {
  const [clases, setClases] = useState([]);
  const [socios, setSocios] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/clases").then(res => setClases(res.data));
    axios.get("http://localhost:3001/socios").then(res => setSocios(res.data));
    axios.get("http://localhost:3001/instructores").then(res => setInstructores(res.data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  };

  return (
    <div className="panelusuario-container">
      <h2 className="panelusuario-title">Panel Usuario - Solo Vista</h2>
      <button className="panelusuario-link-cerrar" onClick={handleLogout}>
        Cerrar sesión
      </button>
      <div className="panelusuario-section">
        <h3>Clases</h3>
        <ul className="panelusuario-list">
          {clases.map(c => (
            <li key={c.id || c.nombre}>
              <b>{c.nombre}</b> - {c.horario} - Instructor: {c.instructor}
            </li>
          ))}
        </ul>
      </div>
      <div className="panelusuario-section">
        <h3>Socios</h3>
        <ul className="panelusuario-list">
          {socios.map(s => (
            <li key={s.id || s.nombre}>{s.nombre} ({s.plan})</li>
          ))}
        </ul>
      </div>
      <div className="panelusuario-section">
        <h3>Instructores</h3>
        <ul className="panelusuario-list">
          {instructores.map(i => (
            <li key={i.id || i.nombre}>{i.nombre} - {i.especialidades?.join(", ")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PanelUsuario;