import InfrastructureMap from "./features/infrastructure-map/InfrastructureMap";
import "./App.css";

/** URL used by the frontend to fetch the map background image. */
const MAP_IMAGE_URL = "http://localhost:8000/api/map";
/** URL used by the frontend to fetch the backend asset catalog. */
const MAP_ASSETS_URL = "http://localhost:8000/api/assets";
/** URL used by the frontend to fetch and persist the editable map layout. */
const MAP_LAYOUT_URL = "http://localhost:8000/api/layout";
/** URL used by the frontend to fetch the allowed sector list. */
const MAP_SECTORS_URL = "http://localhost:8000/api/sectors";

/**
 * Root application shell.
 *
 * @returns Main application layout.
 */
export default function App() {
  return (
    <main className="app-shell">
      <InfrastructureMap
        assetsUrl={MAP_ASSETS_URL}
        imageUrl={MAP_IMAGE_URL}
        layoutUrl={MAP_LAYOUT_URL}
        sectorsUrl={MAP_SECTORS_URL}
      />
    </main>
  );
}
