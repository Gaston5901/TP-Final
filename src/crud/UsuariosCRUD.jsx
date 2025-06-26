// src/pages/UsuariosCRUD.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UsuariosCRUD.css";
import Swal from 'sweetalert2';


function UsuariosCRUD() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ usuario: "", password: "", rol: "usuario" });
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ usuario: "", password: "", rol: "usuario" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    axios.get("http://localhost:3001/usuarios").then(res => setUsuarios(res.data));
  };

  const handleChange = e => setNuevo({ ...nuevo, [e.target.name]: e.target.value });

  const handleAgregar = e => {
    e.preventDefault();
    axios.post("http://localhost:3001/usuarios", nuevo).then(() => {
      cargarUsuarios();
      setNuevo({ usuario: "", password: "", rol: "usuario" });
    });
  };

  

  const handleEliminar = (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará al usuario de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://localhost:3001/usuarios/${id}`).then(cargarUsuarios);
    }
  });
};


  const abrirModalEditar = usuario => {
    setEditando(usuario.id);
    setEditData({ usuario: usuario.usuario, password: usuario.password, rol: usuario.rol || "usuario" });
    setShowModal(true);
  };

  const handleEditChange = e => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleGuardarEdicion = e => {
    e.preventDefault();
    axios.put(`http://localhost:3001/usuarios/${editando}`, editData).then(() => {
      setShowModal(false);
      setEditando(null);
      cargarUsuarios();
    });
  };

  return (
    <div className="usuarios-container">
      <Link to="/admin" className="usuarios-volver">
        ← Volver al Panel de Administración <br />
      </Link>
      <h2 className="usuarios-title">Usuarios</h2>
      <form onSubmit={handleAgregar} className="usuarios-form">
        <input name="usuario" placeholder="Usuario" value={nuevo.usuario} onChange={handleChange} required />
        <input name="password" placeholder="Contraseña" value={nuevo.password} onChange={handleChange} required />
        <select name="rol" value={nuevo.rol} onChange={handleChange}>
          <option value="admin">admin</option>
          <option value="usuario">usuario</option>
        </select>
        <button type="submit" className="usuarios-btn-agregar">Agregar</button>
      </form>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.usuario}</td>
              <td>{u.rol || "usuario"}</td>
              <td>
                <button onClick={() => abrirModalEditar(u)} className="usuarios-btn-editar">Editar</button>
                <button onClick={() => handleEliminar(u.id)} className="usuarios-btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {showModal && (
        <div className="usuarios-modal-bg">
          <form onSubmit={handleGuardarEdicion} className="usuarios-modal">
            <h3>Editar usuario</h3>
            <input name="usuario" placeholder="Usuario" value={editData.usuario} onChange={handleEditChange} required />
            <input name="password" placeholder="Contraseña" value={editData.password} onChange={handleEditChange} required />
            <select name="rol" value={editData.rol} onChange={handleEditChange}>
              <option value="admin">admin</option>
              <option value="usuario">usuario</option>
            </select>
            <div className="usuarios-modal-actions">
              <button type="button" onClick={() => setShowModal(false)} className="usuarios-btn-cancelar">Cancelar</button>
              <button type="submit" className="usuarios-btn-guardar">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UsuariosCRUD;  