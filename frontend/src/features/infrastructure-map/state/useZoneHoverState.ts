import { useEffect, useRef, useState } from "react";

/** Delay used before clearing the hovered zone to avoid flicker. */
const LEAVE_ZONE_DELAY_MS = 40;

/** State and handlers used to manage transient zone hover highlighting. */
interface ZoneHoverState {
  hoveredZoneId: number | null;
  handleHoverZone: (zoneId: number) => void;
  handleLeaveZone: () => void;
  clearHoveredZoneIfMatches: (zoneId: number) => void;
}

/**
 * Encapsulates the hovered zone lifecycle, including the delayed leave logic
 * that prevents flicker when the pointer moves between adjacent overlays.
 *
 * @returns Hovered zone state and the handlers consumed by the main map hook.
 */
export function useZoneHoverState(): ZoneHoverState {
  const [hoveredZoneId, setHoveredZoneId] = useState<number | null>(null);
  const leaveZoneTimeoutRef = useRef<number | null>(null);

  /**
   * Cancels the delayed zone leave timeout if one exists.
   */
  function clearLeaveZoneTimeout(): void {
    if (leaveZoneTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(leaveZoneTimeoutRef.current);
    leaveZoneTimeoutRef.current = null;
  }

  /**
   * Highlights a zone immediately when the pointer enters it.
   *
   * @param zoneId Zone being hovered.
   */
  function handleHoverZone(zoneId: number): void {
    clearLeaveZoneTimeout();
    setHoveredZoneId((currentZoneId) =>
      currentZoneId === zoneId ? currentZoneId : zoneId,
    );
  }

  /**
   * Clears the hovered zone with a tiny delay to avoid hover flicker.
   */
  function handleLeaveZone(): void {
    clearLeaveZoneTimeout();
    leaveZoneTimeoutRef.current = window.setTimeout(() => {
      setHoveredZoneId(null);
      leaveZoneTimeoutRef.current = null;
    }, LEAVE_ZONE_DELAY_MS);
  }

  /**
   * Clears the hover highlight when a deleted zone was still highlighted.
   *
   * @param zoneId Zone identifier that may no longer exist.
   */
  function clearHoveredZoneIfMatches(zoneId: number): void {
    setHoveredZoneId((currentZoneId) =>
      currentZoneId === zoneId ? null : currentZoneId,
    );
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
