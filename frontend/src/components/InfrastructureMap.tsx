import { MapContainer, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface InfrastructureMapProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
}

export default function InfrastructureMap({ 
  imageUrl, 
  imageWidth, 
  imageHeight 
}: InfrastructureMapProps) {
  
  // Calcul des limites (Bounds)
  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [imageHeight, imageWidth],
  ];

  // Calcul du centre pour que la vue démarre au milieu de l'image
  const center: L.LatLngExpression = [imageHeight / 2, imageWidth / 2];

  return (
    <div style={{ 
      border: "2px solid #000000", 
      borderRadius: "8px", 
      overflow: "hidden",
      height: "600px",
      width: "100%"
    }}>
      <MapContainer
        center={center}
        zoom={0} // Zoom initial
        minZoom={-2}
        scrollWheelZoom={true}
        crs={L.CRS.Simple} // Mode "Plan" (non-géographique)
        style={{ height: "100%", width: "100%", background: "#f0f0f0" }}
      >
        <ImageOverlay
          url={imageUrl}
          bounds={bounds}
        />
    
        
      </MapContainer>
    </div>
  );
}