import InfrastructureMap from "./features/infrastructure-map/InfrastructureMap";
import "./App.css";

/** URL used by the frontend to fetch the map background image. */
const MAP_IMAGE_URL = "http://localhost:8000/api/map";

/**
 * Root application shell.
 *
 * @returns Main application layout.
 */
export default function App() {
  return (
    <main className="app-shell">
      <InfrastructureMap imageUrl={MAP_IMAGE_URL} />
    </main>
  );
}
