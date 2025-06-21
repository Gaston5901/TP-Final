import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ClasesSoloVista() {
  const [clases, setClases] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/clases").then(res => setClases(res.data));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: "2rem" }}>
      <h2 style={{ color: "#2563eb" }}>Clases Disponibles</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <Link to="/home">← Volver al inicio</Link>
        {clases.map((c, idx) => (
          <li key={idx} style={{ marginBottom: 16, background: "#f1f5f9", borderRadius: 8, padding: "1rem" }}>
            <b>Nombre:</b> {c.nombre}<br />
            <b>Horario:</b> {c.horario}<br />
            <b>Cupo:</b> {c.cupo}<br />
            <b>Instructor:</b> {c.instructor}
          </li> 
        ))}
      </ul>
    </div>
  );
}

export default ClasesSoloVista;