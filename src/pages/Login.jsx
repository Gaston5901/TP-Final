import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      const res = await axios.get("http://localhost:3001/usuarios", {
        params: { usuario, password }
      });
      if (res.data.length > 0) {
        const user = res.data[0];
        localStorage.setItem("usuario", JSON.stringify(user));
        if (user.rol === "admin") {
          navigate("/admin", { replace: true });
        } else if (user.rol === "usuario") {
          navigate("/PanelUsuario", { replace: true });
        } else {
          setError("Rol no reconocido.");
        }
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <>
    <nav className="home-nav">
  <span className="home-logo">GYM TRIDENT 🔱</span>
  <div>
    <Link to="/" className="home-link">Inicio</Link>
    <Link to="/login" className="home-link">Login</Link>
  </div>
</nav>
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
    </>
  );
}

export default Login;