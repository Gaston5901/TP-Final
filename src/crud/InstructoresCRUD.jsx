import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import './InstructoresCRUD.css';
import Swal from 'sweetalert2';

function InstructoresCRUD() {
  const [instructores, setInstructores] = useState([]);
  const [nuevoInstructor, setNuevoInstructor] = useState({ nombre: "", especialidad: "", horario: "" });
  const [editando, setEditando] = useState(null);
  const [instructorEditado, setInstructorEditado] = useState({ nombre: "", especialidad: "", horario: "" });
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setCargando(true);
    axios.get("http://localhost:3001/instructores")
      .then((res) => setInstructores(res.data))
      .catch(() => setError("Error al cargar instructores"))
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
    setNuevoInstructor({ ...nuevoInstructor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoInstructor.nombre || !nuevoInstructor.especialidad || !nuevoInstructor.horario) {
      mostrarError("Completa todos los campos");
      return;
    }
    axios.post("http://localhost:3001/instructores", nuevoInstructor)
      .then((res) => {
        setInstructores([...instructores, res.data]);
        mostrarMensaje("Instructor agregado correctamente");
      })
      .catch(() => mostrarError("Error al agregar instructor"));
    setNuevoInstructor({ nombre: "", especialidad: "", horario: "" });
  };

    /* const handleEliminar = (id) => {
          if (window.confirm("¿Seguro que deseas eliminar este instructor?")) {
      axios.delete(`http://localhost:3001/instructores/${id}`)
        .then(() => {
          setInstructores(instructores.filter((i) => i.id !== id));
          mostrarMensaje("Instructor eliminado");
        })
        .catch(() => mostrarError("Error al eliminar instructor"));
    } 
  }; */


const handleEliminar = (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas eliminar este instructor?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`http://localhost:3001/instructores/${id}`)
        .then(() => {
          setInstructores(instructores.filter((i) => i.id !== id));
          mostrarMensaje("Instructor eliminado");
        })
        .catch(() => mostrarError("Error al eliminar instructor"));
    }
  });
};

 



  const handleEditar = (inst) => {
    setEditando(inst.id);
    setInstructorEditado({ nombre: inst.nombre, especialidad: inst.especialidad, horario: inst.horario });
  };

  const handleGuardarEdicion = (id) => {
    const instructorOriginal = instructores.find((i) => i.id === id);
    const instructorActualizado = { ...instructorOriginal, ...instructorEditado, id };
    axios.put(`http://localhost:3001/instructores/${id}`, instructorActualizado)
      .then((res) => {
        setInstructores(instructores.map((i) => (i.id === id ? res.data : i)));
        setEditando(null);
        mostrarMensaje("Instructor editado correctamente");
      })
      .catch(() => mostrarError("Error al editar instructor"));
  };

  const instructoresFiltrados = instructores.filter((inst) =>
    inst.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div id="instructores-crud">
      <Link to="/admin">← Volver al Panel de Administración</Link>
      <h2>Gestión de Instructores</h2>

      {mensaje && <div style={{ color: "green" }}>{mensaje}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <input
        type="text"
        placeholder="Buscar instructor por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: "1rem", width: "100%" }}
      />

      {cargando ? (
        <p>Cargando instructores...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
            <input
              name="nombre"
              placeholder="Nombre"
              value={nuevoInstructor.nombre}
              onChange={handleChange}
              required
            />
            <input
              name="especialidad"
              placeholder="Especialidad"
              value={nuevoInstructor.especialidad}
              onChange={handleChange}
              required
            />
            <input
              name="horario"
              placeholder="Horario"
              value={nuevoInstructor.horario}
              onChange={handleChange}
              required
            />
            <button type="submit">Agregar Instructor</button>
          </form>

          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Horario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {instructoresFiltrados.map((inst) => (
                <tr key={inst.id}>
                  {editando === inst.id ? (
                    <>
                      <td>
                        <input
                          value={instructorEditado.nombre}
                          onChange={(e) => setInstructorEditado({ ...instructorEditado, nombre: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={instructorEditado.especialidad}
                          onChange={(e) => setInstructorEditado({ ...instructorEditado, especialidad: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={instructorEditado.horario}
                          onChange={(e) => setInstructorEditado({ ...instructorEditado, horario: e.target.value })}
                        />
                      </td>
                      <td>
                        <button type="button" onClick={() => handleGuardarEdicion(inst.id)}>Guardar</button>
                        <button type="button" onClick={() => setEditando(null)} style={{ marginLeft: "0.5rem" }}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{inst.nombre}</td>
                      <td>{inst.especialidad}</td>
                      <td>{inst.horario}</td>
                      <td>
                        <button type="button" onClick={() => handleEditar(inst)}>Editar</button>
                        <button
                          type="button"
                          className="btn-eliminar"
                          onClick={() => handleEliminar(inst.id)}
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

export default InstructoresCRUD;