function Home() {
  return (
    <div id="home-page">
      <h2>Catálogo de Clases y Rutinas</h2>
      <input
        type="text"
        placeholder="Buscar clase o rutina..."
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      {/* Aquí luego mostraremos la lista de clases/rutinas */}
      <div>
        <p>No hay clases para mostrar.</p>
      </div>
    </div>
  );
}

export default Home;