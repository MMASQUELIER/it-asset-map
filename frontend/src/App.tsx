import InfrastructureMap from "./components/InfrastructureMap";
import AppHeader from "./components/AppHeader";
import MapSection from "./components/MapSection";
import StatusCard from "./components/StatusCard";
import useZonesData from "./hooks/useZonesData";
import "./App.css";

const MAP_CONFIG = {
  url: "http://localhost:8000/api/map",
  zonesUrl: "http://localhost:8000/api/zones",
  width: 884,
  height: 609,
};

export default function App() {
  const { zones, loading, error } = useZonesData(MAP_CONFIG.zonesUrl);

  if (loading) {
    return (
      <div className="app-shell">
        <StatusCard title="IT Infrastructure Map" message="Chargement des zones et des points PC..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <StatusCard title="IT Infrastructure Map" message={`Erreur: ${error}`} isError />
      </div>
    );
  }

  const points = zones.flatMap((zone) => zone.pcs ?? []);

  return (
    <div className="app-shell">
      <AppHeader  />

      <MapSection>
        <InfrastructureMap
          imageUrl={MAP_CONFIG.url}
          imageWidth={MAP_CONFIG.width}
          imageHeight={MAP_CONFIG.height}
          zones={zones}
          points={points}
        />
      </MapSection>
    </div>
  );
}
