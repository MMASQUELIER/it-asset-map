import { useEffect, useState } from "react";
import type { ZoneData } from "../components/InfrastructureMap";

interface ZonesApiResponse {
  zones: ZoneData[];
}

interface UseZonesDataResult {
  zones: ZoneData[];
  loading: boolean;
  error: string | null;
}

export default function useZonesData(zonesUrl: string): UseZonesDataResult {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadZones = async () => {
      try {
        setLoading(true);
        setError(null);

        const zonesResponse = await fetch(zonesUrl);
        if (!zonesResponse.ok) {
          throw new Error(`Erreur API zones (${zonesResponse.status})`);
        }

        const zonesJson = (await zonesResponse.json()) as ZonesApiResponse;
        setZones(zonesJson.zones ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    void loadZones();
  }, [zonesUrl]);

  return { zones, loading, error };
}
