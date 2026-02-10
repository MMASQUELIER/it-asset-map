import { useState } from "react";

export default function App() {
  const [error, setError] = useState(false);
  const imageUrl = "http://localhost:8000/api/map";

  return (
    <div style={{ padding: 20 }}>
      <h1>IT Map</h1>
      
      {error ? (
        <p style={{ color: "red" }}>
            Impossible de charger la carte. Vérifie que le serveur Deno tourne.
        </p>
      ) : (
        <img 
          src={imageUrl} 
          alt="IT Map" 
          style={{ maxWidth: "100%", border: "1px solid #ccc" }}
          onError={() => setError(true)} 
        />
      )}
    </div>
  );
}