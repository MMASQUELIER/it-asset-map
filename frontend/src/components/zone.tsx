// src/components/Zones.tsx
import { useEffect, useState } from "react";
import { Pane, Rectangle, Tooltip } from "react-leaflet";
import type { PathOptions } from "leaflet";

export type Zone = {
  id: number;
  nom: string;
  /** [x1, x2, y1, y2] en coordonnées image (CRS.Simple) */
  position: [number, number, number, number];
};

export type ZonesResponse = {
  zones: Zone[];
};

type ZonesProps = {
  /** ex: "http://localhost:8000/api/zones" */
  apiUrl: string;
  /** callback clic sur une zone */
  onSelect?: (zone: Zone) => void;
  /** style par défaut des rectangles */
  style?: PathOptions;
  /** style au survol */
  hoverStyle?: PathOptions;
};

export default function Zones({
  apiUrl,
  onSelect,
  style,
  hoverStyle,
}: ZonesProps) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Chargement des zones
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: unknown = await res.json();
        const parsed = parseZonesResponse(data);
        if (!cancelled) setZones(parsed.zones);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  if (error) {
    console.error("Erreur de chargement des zones:", error);
  }

  // Styles par défaut
  const baseStyle: PathOptions = {
    color: "#0099ff",
    weight: 1.5,
    fillColor: "#0099ff",
    fillOpacity: 0.25,
    pane: "zones-pane", // dans le Pane ci-dessous
    ...style,
  };
  const overStyle: PathOptions = {
    ...baseStyle,
    weight: 2,
    fillOpacity: 0.35,
    ...(hoverStyle || {}),
  };

  return (
    // Pane au-dessus de l'ImageOverlay
    <Pane name="zones-pane" style={{ zIndex: 450 }}>
      {zones.map((z) => {
        const [x1, x2, y1, y2] = z.position;
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        // Leaflet (CRS.Simple) attend des LatLng: [lat, lng] = [y, x]
        const bounds: [[number, number], [number, number]] = [
          [minY, minX], // coin haut-gauche
          [maxY, maxX], // coin bas-droit
        ];

        const pathOptions = hoveredId === z.id ? overStyle : baseStyle;

        return (
          <Rectangle
            key={z.id}
            bounds={bounds}
            pathOptions={pathOptions}
            eventHandlers={{
              click: () => onSelect?.(z),
              mouseover: () => setHoveredId(z.id),
              mouseout: () => setHoveredId(null),
            }}
          >
            <Tooltip
              direction="top"
              sticky
              opacity={0.9}
              offset={[0, -8]}
            >
              {z.nom}
            </Tooltip>
          </Rectangle>
        );
      })}
    </Pane>
  );
}

/* --------- Validation côté client --------- */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parseZonesResponse(v: unknown): ZonesResponse {
  if (!isRecord(v) || !Array.isArray(v.zones)) {
    throw new Error("Structure attendue: { zones: Zone[] }");
  }
  const zones: Zone[] = v.zones.map((z, i) => {
    if (!isRecord(z)) throw new Error(`zones[${i}] n'est pas un objet`);
    const id = z.id;
    const nom = z.nom;
    const pos = z.position;
    if (typeof id !== "number") {
      throw new Error(`zones[${i}].id doit être un nombre`);
    }
    if (typeof nom !== "string") {
      throw new Error(`zones[${i}].nom doit être une chaîne`);
    }
    if (
      !Array.isArray(pos) || pos.length !== 4 ||
      !pos.every((n) => typeof n === "number")
    ) {
      throw new Error(
        `zones[${i}].position doit être [number, number, number, number]`,
      );
    }
    return { id, nom, position: pos as [number, number, number, number] };
  });
  return { zones };
}
