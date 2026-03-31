import { useEffect, useState } from "react";
import { Pane, Rectangle, Tooltip } from "react-leaflet";
import type { PathOptions } from "leaflet";

export interface Zone {
  id: number;
  nom: string;
  /** [x1, x2, y1, y2] en coordonnées image (CRS.Simple) */
  position: [number, number, number, number];
}

export interface ZonesResponse {
  zones: Zone[];
}

interface ZonesProps {
  /** Exemple : `http://localhost:8000/api/zones`. */
  apiUrl: string;
  /** Callback declenche au clic sur une zone. */
  onSelect?: (zone: Zone) => void;
  /** Style applique aux rectangles hors survol. */
  style?: PathOptions;
  /** Style applique au survol. */
  hoverStyle?: PathOptions;
}

export default function Zones({
  apiUrl,
  onSelect,
  style,
  hoverStyle,
}: ZonesProps) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [hoveredZoneId, setHoveredZoneId] = useState<number | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadZones(): Promise<void> {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const parsedResponse = parseZonesResponse(await response.json() as unknown);

        if (!isCancelled) {
          setZones(parsedResponse.zones);
        }
      } catch {
        if (!isCancelled) {
          setZones([]);
        }
      }
    }

    void loadZones();

    return () => {
      isCancelled = true;
    };
  }, [apiUrl]);

  const baseStyle: PathOptions = {
    color: "#0099ff",
    weight: 1.5,
    fillColor: "#0099ff",
    fillOpacity: 0.25,
    pane: "zones-pane",
    ...style,
  };
  const overStyle: PathOptions = {
    ...baseStyle,
    weight: 2,
    fillOpacity: 0.35,
    ...(hoverStyle || {}),
  };

  return (
    <Pane name="zones-pane" style={{ zIndex: 450 }}>
      {zones.map(function renderZone(zone) {
        const [x1, x2, y1, y2] = zone.position;
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        const bounds: [[number, number], [number, number]] = [
          [minY, minX],
          [maxY, maxX],
        ];

        return (
          <Rectangle
            key={zone.id}
            bounds={bounds}
            pathOptions={hoveredZoneId === zone.id ? overStyle : baseStyle}
            eventHandlers={{
              click: function handleZoneClick() {
                onSelect?.(zone);
              },
              mouseover: function handleZoneMouseOver() {
                setHoveredZoneId(zone.id);
              },
              mouseout: function handleZoneMouseOut() {
                setHoveredZoneId(null);
              },
            }}
          >
            <Tooltip direction="top" sticky opacity={0.9} offset={[0, -8]}>
              {zone.nom}
            </Tooltip>
          </Rectangle>
        );
      })}
    </Pane>
  );
}

/** Verifie qu'une valeur inconnue est bien un objet indexable. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Valide la forme minimale de la reponse zones cote navigateur. */
function parseZonesResponse(value: unknown): ZonesResponse {
  if (!isRecord(value) || !Array.isArray(value.zones)) {
    throw new Error("Structure attendue: { zones: Zone[] }");
  }

  const zones = value.zones.map(function parseZone(zone, index): Zone {
    if (!isRecord(zone)) {
      throw new Error(`zones[${index}] n'est pas un objet`);
    }

    const id = zone.id;
    const nom = zone.nom;
    const position = zone.position;

    if (typeof id !== "number") {
      throw new Error(`zones[${index}].id doit etre un nombre`);
    }

    if (typeof nom !== "string") {
      throw new Error(`zones[${index}].nom doit etre une chaine`);
    }

    if (
      !Array.isArray(position) || position.length !== 4 ||
      !position.every((coordinate) => typeof coordinate === "number")
    ) {
      throw new Error(
        `zones[${index}].position doit etre [number, number, number, number]`,
      );
    }

    return {
      id,
      nom,
      position: position as [number, number, number, number],
    };
  });

  return { zones };
}
