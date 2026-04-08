const DEFAULT_SECTOR_COLOR = "#4f6d7a";
const LEGACY_SECTOR_COLOR_PATTERN = /^hsl\(\d{1,3}\s+58%\s+46%\)$/i;
const SECTOR_COLOR_CANDIDATES = [
  "hsl(0 84% 54%)",
  "hsl(24 90% 54%)",
  "hsl(48 94% 50%)",
  "hsl(72 80% 42%)",
  "hsl(98 74% 40%)",
  "hsl(122 68% 42%)",
  "hsl(146 70% 40%)",
  "hsl(170 80% 38%)",
  "hsl(192 86% 44%)",
  "hsl(214 84% 48%)",
  "hsl(238 74% 56%)",
  "hsl(262 74% 58%)",
  "hsl(286 72% 54%)",
  "hsl(310 76% 50%)",
  "hsl(334 84% 54%)",
  "hsl(12 92% 64%)",
  "hsl(42 94% 64%)",
  "hsl(84 78% 54%)",
  "hsl(114 72% 54%)",
  "hsl(140 74% 52%)",
  "hsl(166 80% 48%)",
  "hsl(188 90% 56%)",
  "hsl(208 88% 60%)",
  "hsl(230 78% 64%)",
  "hsl(254 80% 66%)",
  "hsl(278 78% 64%)",
  "hsl(302 80% 58%)",
  "hsl(326 86% 58%)",
  "hsl(350 92% 62%)",
  "hsl(18 72% 36%)",
  "hsl(58 72% 34%)",
  "hsl(96 64% 32%)",
  "hsl(132 62% 34%)",
  "hsl(164 66% 32%)",
  "hsl(196 74% 34%)",
  "hsl(222 72% 40%)",
  "hsl(248 68% 46%)",
  "hsl(274 66% 44%)",
  "hsl(300 68% 42%)",
  "hsl(330 72% 40%)",
  "hsl(352 76% 44%)",
] as const;

interface RgbColor {
  blue: number;
  green: number;
  red: number;
}

export function buildSectorColor(sectorName: string): string {
  const normalizedSectorName = normalizeSectorName(sectorName);

  if (normalizedSectorName.length === 0) {
    return DEFAULT_SECTOR_COLOR;
  }

  return pickRotatedCandidate(normalizedSectorName, SECTOR_COLOR_CANDIDATES);
}

export function buildAvailableSectorColor(
  sectorName: string,
  usedColors: string[],
): string {
  const normalizedSectorName = normalizeSectorName(sectorName);

  if (normalizedSectorName.length === 0) {
    return DEFAULT_SECTOR_COLOR;
  }

  const normalizedUsedColors = Array.from(
    new Set(
      usedColors
        .map(normalizeColorValue)
        .filter((color) => color.length > 0),
    ),
  );
  const availableCandidates = SECTOR_COLOR_CANDIDATES.filter((candidate) =>
    !normalizedUsedColors.includes(normalizeColorValue(candidate))
  );

  if (availableCandidates.length > 0) {
    return pickMostDistinctColor(
      normalizedSectorName,
      availableCandidates,
      normalizedUsedColors,
    );
  }

  return buildFallbackSectorColor(normalizedSectorName, normalizedUsedColors);
}

export function isLegacySectorColor(color: string | null | undefined): boolean {
  const normalizedColor = normalizeColorValue(color ?? "");
  return LEGACY_SECTOR_COLOR_PATTERN.test(normalizedColor);
}

function buildFallbackSectorColor(
  normalizedSectorName: string,
  usedColors: string[],
): string {
  const fallbackCandidates: string[] = [];
  const baseHash = hashText(normalizedSectorName);

  for (let index = 0; index < 720; index += 1) {
    const hue = (baseHash + index * 47) % 360;
    const saturation = 64 + (index % 4) * 8;
    const lightness = 34 + (index % 5) * 8;
    fallbackCandidates.push(`hsl(${hue} ${saturation}% ${lightness}%)`);
  }

  return pickMostDistinctColor(
    normalizedSectorName,
    fallbackCandidates,
    usedColors,
  );
}

function pickMostDistinctColor(
  normalizedSectorName: string,
  candidates: readonly string[],
  usedColors: string[],
): string {
  const rotatedCandidates = rotateCandidates(
    normalizedSectorName,
    candidates,
  );

  if (usedColors.length === 0) {
    return rotatedCandidates[0] ?? DEFAULT_SECTOR_COLOR;
  }

  let bestCandidate = rotatedCandidates[0] ?? DEFAULT_SECTOR_COLOR;
  let bestDistance = -1;
  let bestIndex = Number.MAX_SAFE_INTEGER;

  for (const [candidateIndex, candidate] of rotatedCandidates.entries()) {
    const minimumDistance = getMinimumColorDistance(candidate, usedColors);

    if (
      minimumDistance > bestDistance ||
      (minimumDistance === bestDistance && candidateIndex < bestIndex)
    ) {
      bestCandidate = candidate;
      bestDistance = minimumDistance;
      bestIndex = candidateIndex;
    }
  }

  return bestCandidate;
}

function getMinimumColorDistance(
  candidate: string,
  usedColors: string[],
): number {
  let minimumDistance = Number.POSITIVE_INFINITY;

  for (const usedColor of usedColors) {
    const distance = getColorDistance(candidate, usedColor);
    minimumDistance = Math.min(minimumDistance, distance);
  }

  return Number.isFinite(minimumDistance) ? minimumDistance : 0;
}

function getColorDistance(firstColor: string, secondColor: string): number {
  const firstRgb = parseColorToRgb(firstColor);
  const secondRgb = parseColorToRgb(secondColor);

  if (firstRgb === null || secondRgb === null) {
    return normalizeColorValue(firstColor) === normalizeColorValue(secondColor)
      ? 0
      : 1;
  }

  const redDelta = firstRgb.red - secondRgb.red;
  const greenDelta = firstRgb.green - secondRgb.green;
  const blueDelta = firstRgb.blue - secondRgb.blue;

  return Math.sqrt(
    redDelta * redDelta +
      greenDelta * greenDelta +
      blueDelta * blueDelta,
  );
}

function rotateCandidates(
  normalizedSectorName: string,
  candidates: readonly string[],
): readonly string[] {
  if (candidates.length <= 1) {
    return [...candidates];
  }

  const startIndex = hashText(normalizedSectorName) % candidates.length;
  return [
    ...candidates.slice(startIndex),
    ...candidates.slice(0, startIndex),
  ];
}

function pickRotatedCandidate(
  normalizedSectorName: string,
  candidates: readonly string[],
): string {
  return rotateCandidates(normalizedSectorName, candidates)[0] ??
    DEFAULT_SECTOR_COLOR;
}

function parseColorToRgb(color: string): RgbColor | null {
  const normalizedColor = normalizeColorValue(color);

  if (normalizedColor.startsWith("#")) {
    return parseHexColor(normalizedColor);
  }

  if (normalizedColor.startsWith("hsl(") && normalizedColor.endsWith(")")) {
    return parseHslColor(normalizedColor);
  }

  return null;
}

function parseHexColor(color: string): RgbColor | null {
  const hexColor = color.slice(1);

  if (!/^[0-9a-f]{6}$/i.test(hexColor)) {
    return null;
  }

  return {
    blue: Number.parseInt(hexColor.slice(4, 6), 16),
    green: Number.parseInt(hexColor.slice(2, 4), 16),
    red: Number.parseInt(hexColor.slice(0, 2), 16),
  };
}

function parseHslColor(color: string): RgbColor | null {
  const match = color.match(
    /^hsl\(\s*(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*\)$/i,
  );

  if (match === null) {
    return null;
  }

  const [, rawHue, rawSaturation, rawLightness] = match;
  const hue = Number.parseFloat(rawHue);
  const saturation = Number.parseFloat(rawSaturation);
  const lightness = Number.parseFloat(rawLightness);

  if (
    !Number.isFinite(hue) ||
    !Number.isFinite(saturation) ||
    !Number.isFinite(lightness)
  ) {
    return null;
  }

  return convertHslToRgb(hue, saturation, lightness);
}

function convertHslToRgb(
  hue: number,
  saturation: number,
  lightness: number,
): RgbColor {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const normalizedSaturation = Math.max(0, Math.min(100, saturation)) / 100;
  const normalizedLightness = Math.max(0, Math.min(100, lightness)) / 100;
  const chroma =
    (1 - Math.abs(2 * normalizedLightness - 1)) * normalizedSaturation;
  const huePrime = normalizedHue / 60;
  const secondary = chroma * (1 - Math.abs((huePrime % 2) - 1));
  let redPrime = 0;
  let greenPrime = 0;
  let bluePrime = 0;

  if (huePrime < 1) {
    redPrime = chroma;
    greenPrime = secondary;
  } else if (huePrime < 2) {
    redPrime = secondary;
    greenPrime = chroma;
  } else if (huePrime < 3) {
    greenPrime = chroma;
    bluePrime = secondary;
  } else if (huePrime < 4) {
    greenPrime = secondary;
    bluePrime = chroma;
  } else if (huePrime < 5) {
    redPrime = secondary;
    bluePrime = chroma;
  } else {
    redPrime = chroma;
    bluePrime = secondary;
  }

  const matchLightness = normalizedLightness - chroma / 2;

  return {
    blue: Math.round((bluePrime + matchLightness) * 255),
    green: Math.round((greenPrime + matchLightness) * 255),
    red: Math.round((redPrime + matchLightness) * 255),
  };
}

function normalizeColorValue(color: string): string {
  return color.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeSectorName(sectorName: string): string {
  return sectorName
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .trim()
    .toUpperCase();
}

function hashText(value: string): number {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}
