import InfrastructureMap from "./components/InfrastructureMap";

export default function App() {
  // Configuration
  const MAP_CONFIG = {
    url: "http://localhost:8000/api/map",
    width: 2000, 
    height: 1500, 
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>IT Infrastructure Map</h1>
      <p>Vue globale du réseau et des équipements.</p>

      {/* Appel du composant */}
      <InfrastructureMap 
        imageUrl={MAP_CONFIG.url}
        imageWidth={MAP_CONFIG.width}
        imageHeight={MAP_CONFIG.height}
      />
    </div>
  );
}