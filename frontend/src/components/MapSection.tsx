import type { ReactNode } from "react";

interface MapSectionProps {
  children: ReactNode;
}

export default function MapSection({ children }: MapSectionProps) {
  return <section className="map-panel">{children}</section>;
}
