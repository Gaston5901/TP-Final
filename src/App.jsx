import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import SociosCRUD from "./crud/SociosCRUD";
import InstructoresCRUD from "./crud/InstructoresCRUD";
import ClasesCRUD from "./crud/ClasesCRUD";
import './Styles.css'; // Asegúrate de que este archivo exista y tenga los estilos necesarios

// RutaPrivada dentro del mismo archivo
function RutaPrivada({ children }) {
  const usuario = localStorage.getItem("usuario");
  return usuario ? children : <Navigate to="/login" replace />;
}

function App() {
  // Opcional: Forzar recarga si el usuario no está logueado y está en /admin
  useEffect(() => {
    if (
      window.location.pathname === "/admin" &&
      !localStorage.getItem("usuario")
    ) {
      window.location.replace("/login");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RutaPrivada>
              <Admin />
            </RutaPrivada>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/socios" element={<SociosCRUD />} />
        <Route path="/instructores" element={<InstructoresCRUD />} />
        <Route path="/clases" element={<ClasesCRUD />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
