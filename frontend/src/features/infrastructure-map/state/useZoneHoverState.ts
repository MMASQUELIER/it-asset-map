import { useEffect, useRef, useState } from "react";

const LEAVE_ZONE_DELAY_MS = 40;

interface ZoneHoverState {
  hoveredZoneId: number | null;
  handleHoverZone: (zoneId: number) => void;
  handleLeaveZone: () => void;
  clearHoveredZoneIfMatches: (zoneId: number) => void;
}

export function useZoneHoverState(): ZoneHoverState {
  const [hoveredZoneId, setHoveredZoneId] = useState<number | null>(null);
  const leaveZoneTimeoutRef = useRef<number | null>(null);

  function clearLeaveZoneTimeout(): void {
    if (leaveZoneTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(leaveZoneTimeoutRef.current);
    leaveZoneTimeoutRef.current = null;
  }

  function handleHoverZone(zoneId: number): void {
    clearLeaveZoneTimeout();
    setHoveredZoneId(zoneId);
  }

  function handleLeaveZone(): void {
    clearLeaveZoneTimeout();
    leaveZoneTimeoutRef.current = window.setTimeout(function clearHoveredZone() {
      setHoveredZoneId(null);
      leaveZoneTimeoutRef.current = null;
    }, LEAVE_ZONE_DELAY_MS);
  }

  function clearHoveredZoneIfMatches(zoneId: number): void {
    setHoveredZoneId(function clearHoveredZone(currentZoneId) {
      if (currentZoneId !== zoneId) {
        return currentZoneId;
      }

      return null;
    });
  }

  useEffect(() => {
    return () => {
      clearLeaveZoneTimeout();
    };
  }, []);

  return {
    hoveredZoneId,
    handleHoverZone,
    handleLeaveZone,
    clearHoveredZoneIfMatches,
  };
}
