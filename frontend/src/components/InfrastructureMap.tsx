// src/components/InfrastructureMap.tsx
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
  
  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [imageHeight, imageWidth],
  ];

  return (
    <div style={{ 
      height: "100vh",
      width: "100%",
      overflow: "hidden"
    }}>
      <MapContainer
        bounds={bounds}
        
        maxBounds={bounds}
        maxBoundsViscosity={2.0} 
        
        minZoom={-1}
        maxZoom={2}
        scrollWheelZoom={true}
        crs={L.CRS.Simple}
        style={{ height: "100%", width: "100%", background: "#222" }}
      >
        <ImageOverlay
          url={imageUrl}
          bounds={bounds}
        />
      </MapContainer>
    </div>
  );
}