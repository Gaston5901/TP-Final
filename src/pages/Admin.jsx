import { Link, useNavigate } from "react-router-dom";
import "./Admin.css"; // Importa el CSS específico

function Admin() {
  

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    window.location.replace("/login");
  };

  return (
    <div className="admin-bg">
      <div className="admin-overlay">
        <div className="admin-content">
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
          <h2>Panel de Administración</h2>
          <div className="admin-links">
            <Link className="admin-link" to="/socios">Gestionar Socios</Link>
            <Link className="admin-link" to="/instructores">Gestionar Instructores</Link>
            <Link className="admin-link" to="/clases">Gestionar Clases/Rutinas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;