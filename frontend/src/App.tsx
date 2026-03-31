import InfrastructureMap from "@/features/infrastructure-map";

/** URL de l'image de fond de la carte. */
const MAP_IMAGE_URL = "http://localhost:8000/api/map";
/** URL du catalogue infrastructure expose par le backend. */
const MAP_CATALOG_URL = "http://localhost:8000/api/catalog";
/** URL de lecture et de sauvegarde du layout. */
const MAP_LAYOUT_URL = "http://localhost:8000/api/layout";

/**
 * Shell principal de l'application.
 */
export default function App() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1500px] px-[clamp(18px,3vw,40px)] py-[clamp(20px,4vw,44px)]">
      <InfrastructureMap
        catalogUrl={MAP_CATALOG_URL}
        imageUrl={MAP_IMAGE_URL}
        layoutUrl={MAP_LAYOUT_URL}
      />
    </main>
  );
}
