interface MapHudProps {
  zoneCount: number;
  pointCount: number;
}

export default function MapHud({ zoneCount, pointCount }: MapHudProps) {
  return (
    <div className="map-hud">
      <span>{zoneCount} zones</span>
      <span>{pointCount} points PC</span>
    </div>
  );
}
