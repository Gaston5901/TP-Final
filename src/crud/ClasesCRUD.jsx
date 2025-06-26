import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; 
import './ClasesCRUD.css';

function ClasesCRUD() {
  const [clases, setClases] = useState([]);
  const [nuevaClase, setNuevaClase] = useState({ nombre: "", horario: "", cupo: "", instructor: "" });
  const [socios, setSocios] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [socioSeleccionado, setSocioSeleccionado] = useState("");
  const [editando, setEditando] = useState(null);
  const [claseEditada, setClaseEditada] = useState({ nombre: "", horario: "", cupo: "", instructor: "" });
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setCargando(true);
    Promise.all([
      axios.get("http://localhost:3001/clases"),
      axios.get("http://localhost:3001/socios"),
      axios.get("http://localhost:3001/instructores"),
    ]).then(([clasesRes, sociosRes, instructoresRes]) => {
      setClases(clasesRes.data);
      setSocios(sociosRes.data);
      setInstructores(instructoresRes.data);
    }).catch(() => setError("Error al cargar clases"))
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
    setNuevaClase({ ...nuevaClase, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevaClase.nombre || !nuevaClase.horario || !nuevaClase.cupo || !nuevaClase.instructor) {
      mostrarError("Completa todos los campos");
      return;
    }
    axios
      .post("http://localhost:3001/clases", { ...nuevaClase, cupo: parseInt(nuevaClase.cupo), socios: [] })
      .then((res) => {
        setClases([...clases, res.data]);
        setMensaje("Clase agregada correctamente");
        setNuevaClase({ nombre: "", horario: "", cupo: "", instructor: "" });
        setTimeout(() => setMensaje(""), 2000);
      })
      .catch(() => setError("Error al agregar clase"));
    
  };



 const handleEliminar = (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas eliminar esta clase?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`http://localhost:3001/clases/${id}`)
        .then(() => {
          setClases(clases.filter((c) => c.id !== id));
          setMensaje("Clase eliminada");
          setTimeout(() => setMensaje(""), 2000);
        })
        .catch(() => {
          setError("Error al eliminar clase");
          setTimeout(() => setError(""), 2000);
        });
    }
  });
}; 


  const handleEditar = (clase) => {
    // Opciones de instructores
    const selectOptions = instructores.map(
      (inst) =>
        `<option value="${inst.nombre}" ${inst.nombre === clase.instructor ? 'selected' : ''}>${inst.nombre}</option>`
    ).join('');

    // Socios inscriptos con botón "x"
    const sociosClase = (clase.socios || [])
      .map((id) => {
        const socio = socios.find((s) => String(s.id) === String(id));
        return socio
          ? `<span class="swal-socio" data-id="${socio.id}" style="display:inline-block;margin:2px 8px 2px 0;padding:2px 8px;background:#e0e7ef;border-radius:12px;">
              ${socio.nombre}
              <button type="button" class="swal-x" data-id="${socio.id}"  style="margin-left:6px;color:#fff;background:linear-gradient(135deg,#ef4444 60%,#f87171 100%);border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-weight:bold;font-size:16px;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;box-shadow:0 2px 6px #ef444422;transition: background 0.2s, transform 0.2s;line-height:1;padding:0;">×</button>
            </span>`
          : '';
      })
      .join('');

    Swal.fire({
      title: 'Editar Clase',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${clase.nombre}" />
        <input id="swal-horario" class="swal2-input" placeholder="Horario" value="${clase.horario}" />
        <input id="swal-cupo" class="swal2-input" type="number" placeholder="Cupo" value="${clase.cupo}" />
        <select id="swal-instructor" class="swal2-input">${selectOptions}</select>
        <div id="swal-socios-list" style="margin-top:10px;text-align:left;">
          <label style="font-size:0.95em;color:#2563eb;">Socios inscriptos:</label><br/>
          ${sociosClase || '<span style="color:#888;">Sin socios</span>'}
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        // Manejar clicks en las "x"
        document.querySelectorAll('.swal-x').forEach(btn => {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            // Elimina el span del DOM
            this.parentElement.remove();
          });
        });
      },
      preConfirm: () => {
        // Obtiene los IDs de los socios que quedan
        const sociosRestantes = Array.from(document.querySelectorAll('#swal-socios-list .swal-socio'))
          .map(span => span.getAttribute('data-id'));
        return {
          nombre: document.getElementById('swal-nombre').value,
          horario: document.getElementById('swal-horario').value,
          cupo: document.getElementById('swal-cupo').value,
          instructor: document.getElementById('swal-instructor').value,
          socios: sociosRestantes,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const claseActualizada = {
          ...clase,
          ...result.value,
          cupo: Number(result.value.cupo),
          socios: result.value.socios,
        };
        axios.put(`http://localhost:3001/clases/${clase.id}`, claseActualizada)
          .then((res) => {
            setClases(clases.map((c) => (c.id === clase.id ? res.data : c)));
            setMensaje("Clase editada correctamente");
            setTimeout(() => setMensaje(""), 2000);
          })
          .catch(() => {
            setError("Error al editar clase");
            setTimeout(() => setError(""), 2000);
          });
      }
    });
  };

  const handleRegistrarSocio = (clase) => {
    setClaseSeleccionada(clase);
    setSocioSeleccionado("");
  };

  const handleSocioChange = (e) => {
    setSocioSeleccionado(e.target.value);
  };

  const handleConfirmarRegistro = () => {
    if (!socioSeleccionado) return;
    const socioId = socioSeleccionado; // <-- string

    // Filtra nulos y evita duplicados
    const sociosActualizados = [
      ...(claseSeleccionada.socios || []).filter((id) => id !== null && id !== undefined),
    ];
    if (sociosActualizados.includes(socioId)) {
      setMensaje("Ese socio ya está inscripto en la clase");
      setTimeout(() => setMensaje(""), 2000);
      return;
    }
    sociosActualizados.push(socioId);

    const claseActualizada = {
      ...claseSeleccionada,
      socios: sociosActualizados,
    };

    axios
      .put(`http://localhost:3001/clases/${claseSeleccionada.id}`, claseActualizada)
      .then((res) => {
        setClases(clases.map((c) => (c.id === claseActualizada.id ? res.data : c)));
        setClaseSeleccionada(null);
        setMensaje("Socio registrado en la clase");
        setTimeout(() => setMensaje(""), 2000);
      })
      .catch(() => {
        setError("Error al registrar socio en la clase");
        setTimeout(() => setError(""), 2000);
      });
  };

  const clasesFiltradas = clases.filter((clase) =>
    clase.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div id="clases-crud">
      <Link to="/admin">← Volver al Panel de Administración</Link>
      <h2>Gestión de Clases y Rutinas</h2>

      {mensaje && <div style={{ color: "green" }}>{mensaje}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <input
        type="text"
        placeholder="Buscar clase por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: "1rem", width: "100%" }}
      />

      {cargando ? (
        <p>Cargando clases...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
            <input
              name="nombre"
              placeholder="Nombre de la clase"
              value={nuevaClase.nombre}
              onChange={handleChange}
              required
            />
            <input
              name="horario"
              placeholder="Horario"
              value={nuevaClase.horario}
              onChange={handleChange}
              required
            />
            <input
              name="cupo"
              type="number"
              placeholder="Cupo"
              value={nuevaClase.cupo}
              onChange={handleChange}
              required
            />
            <select
              name="instructor"
              value={nuevaClase.instructor}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un instructor</option>
              {instructores.map((inst) => (
                <option key={inst.id} value={inst.nombre}>
                  {inst.nombre}
                </option>
              ))}
            </select>
            <button type="submit">Agregar Clase</button>
          </form>

          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Horario</th>
                <th>Cupo</th>
                <th>Instructor</th>
                <th>Socios inscriptos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clasesFiltradas.map((clase) => (
                <tr key={clase.id}>
                  {editando === clase.id ? (
                    <>
                      <td>
                        <input
                          value={claseEditada.nombre}
                          onChange={(e) => setClaseEditada({ ...claseEditada, nombre: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={claseEditada.horario}
                          onChange={(e) => setClaseEditada({ ...claseEditada, horario: e.target.value })}
                        />
                      </td>
                      <td>
                        <input type="number" value={claseEditada.cupo} onChange={(e) => setClaseEditada({ ...claseEditada, cupo: e.target.value })} />
                      </td>
                      <td>
                        <select
                          value={claseEditada.instructor}
                          onChange={(e) => setClaseEditada({ ...claseEditada, instructor: e.target.value })}
                          required
                        >
                          <option value="">Selecciona un instructor</option>
                          {instructores.map((inst) => (
                            <option key={inst.id} value={inst.nombre}>
                              {inst.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {(clase.socios && clase.socios.length > 0)
                          ? clase.socios
                              .map((id) => {
                                // Asegura que la comparación sea por string para evitar problemas de tipo
                                const socio = socios.find((s) => String(s.id) === String(id));
                                return socio ? socio.nombre : null;
                              })
                              .filter(Boolean)
                              .join(", ")
                          : "-"}
                      </td>
                      <td>
                        <button type="button" onClick={() => handleGuardarEdicion(clase.id)}>Guardar</button>
                        <button type="button" onClick={() => setEditando(null)} style={{ marginLeft: "0.5rem" }}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{clase.nombre}</td>
                      <td>{clase.horario}</td>
                      <td>{clase.cupo}</td>
                      <td>{clase.instructor}</td>
                      <td>
                        {(clase.socios && clase.socios.length > 0)
                          ? clase.socios
                              .filter((id) => id !== null && id !== undefined)
                              .map((id) => {
                                const socio = socios.find((s) => String(s.id) === String(id));
                                return socio ? socio.nombre : null;
                              })
                              .filter(Boolean)
                              .join(", ")
                          : "-"}
                      </td>
                      <td>
                        <button onClick={() => handleRegistrarSocio(clase)}>
                          Registrar Socio
                        </button>
                        <button type="button" onClick={() => handleEditar(clase)} style={{ marginLeft: "0.5rem" }}>
                          Editar
                        </button>
                        <button type="button" className="btn-eliminar" onClick={() => handleEliminar(clase.id)}>Eliminar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Formulario para registrar socio */}
          {claseSeleccionada && (
            <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
              <h4>Registrar socio en: {claseSeleccionada.nombre}</h4>
              <select value={socioSeleccionado} onChange={handleSocioChange}>
                <option value="">Selecciona un socio</option>
                {socios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              <button onClick={handleConfirmarRegistro} style={{ marginLeft: "1rem" }}>
                Confirmar
              </button>
              <button onClick={() => setClaseSeleccionada(null)} style={{ marginLeft: "1rem" }}>
                Cancelar
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ClasesCRUD;