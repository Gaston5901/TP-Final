import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import './SociosCRUD.css';

function SociosCRUD() {
  const [socios, setSocios] = useState([]);
  const [nuevoSocio, setNuevoSocio] = useState({ nombre: "", plan: "", cuota: "" });
  const [editando, setEditando] = useState(null);
  const [socioEditado, setSocioEditado] = useState({ nombre: "", plan: "", cuota: "" });
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setCargando(true);
    axios.get("http://localhost:3001/socios")
      .then((res) => setSocios(res.data))
      .catch(() => setError("Error al cargar socios"))
      .finally(() => setCargando(false));
  }, []);

  const mostrarMensaje = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(""), 2000);
  };

  const mostrarError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const handleChange = (e) => {
    setNuevoSocio({ ...nuevoSocio, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoSocio.nombre || !nuevoSocio.plan || !nuevoSocio.cuota) {
      mostrarError("Completa todos los campos");
      return;
    }
    axios.post("http://localhost:3001/socios", nuevoSocio)
      .then((res) => {
        setSocios([...socios, res.data]);
        mostrarMensaje("Socio agregado correctamente");
      })
      .catch(() => mostrarError("Error al agregar socio"));
    setNuevoSocio({ nombre: "", plan: "", cuota: "" });
  };

  const handleEliminar = (id) => {
    axios.delete(`http://localhost:3001/socios/${id}`)
      .then(() => {
        setSocios(socios.filter((s) => s.id !== id));
        mostrarMensaje("Socio eliminado");
      })
      .catch(() => mostrarError("Error al eliminar socio"));
  };

  const handleEditar = (socio) => {
    setEditando(socio.id);
    setSocioEditado({ nombre: socio.nombre, plan: socio.plan, cuota: socio.cuota });
  };

  const handleGuardarEdicion = (id) => {
    const socioActualizado = { ...socioEditado, id };
    axios.put(`http://localhost:3001/socios/${id}`, socioActualizado)
      .then((res) => {
        setSocios(socios.map((s) => (s.id === id ? res.data : s)));
        setEditando(null);
        mostrarMensaje("Socio editado correctamente");
      })
      .catch(() => mostrarError("Error al editar socio"));
  };

  const sociosFiltrados = socios.filter((socio) =>
    socio.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div id="socios-crud">
      <Link to="/admin">← Volver al Panel de Administración</Link>
      <h2>Gestión de Socios</h2>

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      {error && <div className="mensaje-error">{error}</div>}

      <input
        type="text"
        placeholder="Buscar socio por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: "1rem", width: "100%" }}
      />

      {cargando ? (
        <p>Cargando socios...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
            <input
              name="nombre"
              placeholder="Nombre"
              value={nuevoSocio.nombre}
              onChange={handleChange}
              required
            />
            <select
              name="plan"
              value={nuevoSocio.plan}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un plan</option>
              <option value="anual">Anual</option>
              <option value="trimestral">Trimestral</option>
              <option value="mensual">Mensual</option>
            </select>
            <select
              name="cuota"
              value={nuevoSocio.cuota}
              onChange={handleChange}
              required
            >
              <option value="">Estado de cuota</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
            </select>
            <button type="submit">Agregar Socio</button>
          </form>

          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Plan</th>
                <th>Estado de cuota</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sociosFiltrados.map((socio) => (
                <tr key={socio.id}>
                  {editando === socio.id ? (
                    <>
                      <td>
                        <input
                          value={socioEditado.nombre}
                          onChange={(e) => setSocioEditado({ ...socioEditado, nombre: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={socioEditado.plan}
                          onChange={(e) => setSocioEditado({ ...socioEditado, plan: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={socioEditado.cuota}
                          onChange={(e) => setSocioEditado({ ...socioEditado, cuota: e.target.value })}
                        />
                      </td>
                      <td>
                        <button type="button" onClick={() => handleGuardarEdicion(socio.id)}>Guardar</button>
                        <button type="button" onClick={() => setEditando(null)} style={{ marginLeft: "0.5rem" }}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{socio.nombre}</td>
                      <td>{socio.plan}</td>
                      <td>{socio.cuota}</td>
                      <td>
                        <button type="button" onClick={() => handleEditar(socio)}>Editar</button>
                        <button
                          type="button"
                          className="btn-eliminar"
                          onClick={() => handleEliminar(socio.id)}
                          style={{ marginLeft: "0.5rem" }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default SociosCRUD;