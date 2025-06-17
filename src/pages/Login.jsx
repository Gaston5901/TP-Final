import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; 

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Supón que tienes un endpoint /usuarios en tu db.json
      const res = await axios.get("http://localhost:3001/usuarios", {
        params: { usuario, password }
      });
      if (res.data.length > 0) {
        localStorage.setItem("usuario", JSON.stringify(res.data[0]));
        navigate("/admin", { replace: true }); // replace para limpiar historial
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-background">
      <div className="login-bg-overlay"></div>
      <div className="login-form-container">
        <h2>Iniciar sesión</h2>
        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              background: "#2563eb",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;