import InfrastructureMap from "./components/InfrastructureMap";
import "./App.css";

export default function App() {
  const MAP_CONFIG = {
    imageUrl: "http://localhost:8000/api/map",
  };

  return (
    <main className="app-shell">
      <InfrastructureMap imageUrl={MAP_CONFIG.imageUrl} />
    </main>
  );
}
