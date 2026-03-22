import type { StaticMapData, TestPc } from "../../../types/layout";
import { createPcTechnicalDetails } from "./pcTechnicalDetails";

interface RawStaticMapData {
  image: StaticMapData["image"];
  zones: Array<
    Omit<StaticMapData["zones"][number], "pcs"> & {
      pcs: Array<Pick<TestPc, "id" | "x" | "y">>;
    }
  >;
}

const RAW_STATIC_MAP_DATA: RawStaticMapData = {
  image: {
    width: 884,
    height: 609,
  },
  zones: [
    {
      id: 100,
      color: "#6782b8",
      bounds: { x: 40, y: 60, width: 160, height: 105 },
      pcs: [
        { id: "PC-100-01", x: 63, y: 85 },
        { id: "PC-100-02", x: 96, y: 106 },
        { id: "PC-100-03", x: 137, y: 92 },
        { id: "PC-100-04", x: 172, y: 126 },
        { id: "PC-100-05", x: 118, y: 146 },
      ],
    },
    {
      id: 110,
      color: "#bf2f2f",
      bounds: { x: 230, y: 58, width: 210, height: 108 },
      pcs: [
        { id: "PC-110-01", x: 254, y: 82 },
        { id: "PC-110-02", x: 294, y: 111 },
        { id: "PC-110-03", x: 333, y: 94 },
        { id: "PC-110-04", x: 376, y: 122 },
        { id: "PC-110-05", x: 407, y: 87 },
        { id: "PC-110-06", x: 349, y: 146 },
      ],
    },
    {
      id: 120,
      color: "#0f9e64",
      bounds: { x: 614, y: 160, width: 152, height: 88 },
      pcs: [
        { id: "PC-120-01", x: 631, y: 184 },
        { id: "PC-120-02", x: 668, y: 205 },
        { id: "PC-120-03", x: 706, y: 191 },
        { id: "PC-120-04", x: 744, y: 220 },
        { id: "PC-120-05", x: 725, y: 176 },
      ],
    },
    {
      id: 130,
      color: "#002fff",
      bounds: { x: 44, y: 218, width: 248, height: 110 },
      pcs: [
        { id: "PC-130-01", x: 68, y: 242 },
        { id: "PC-130-02", x: 104, y: 283 },
        { id: "PC-130-03", x: 151, y: 254 },
        { id: "PC-130-04", x: 197, y: 305 },
        { id: "PC-130-05", x: 240, y: 261 },
        { id: "PC-130-06", x: 272, y: 229 },
      ],
    },
    {
      id: 200,
      color: "#9e16a0",
      bounds: { x: 437, y: 233, width: 140, height: 122 },
      pcs: [
        { id: "PC-200-01", x: 454, y: 258 },
        { id: "PC-200-02", x: 484, y: 312 },
        { id: "PC-200-03", x: 509, y: 275 },
        { id: "PC-200-04", x: 536, y: 330 },
        { id: "PC-200-05", x: 558, y: 249 },
      ],
    },
    {
      id: 210,
      color: "#ff9100",
      bounds: { x: 40, y: 372, width: 198, height: 122 },
      pcs: [
        { id: "PC-210-01", x: 61, y: 396 },
        { id: "PC-210-02", x: 94, y: 451 },
        { id: "PC-210-03", x: 126, y: 419 },
        { id: "PC-210-04", x: 171, y: 478 },
        { id: "PC-210-05", x: 205, y: 435 },
        { id: "PC-210-06", x: 223, y: 391 },
      ],
    },
    {
      id: 220,
      color: "#ffe100",
      bounds: { x: 267, y: 387, width: 148, height: 108 },
      pcs: [
        { id: "PC-220-01", x: 284, y: 408 },
        { id: "PC-220-02", x: 316, y: 468 },
        { id: "PC-220-03", x: 343, y: 432 },
        { id: "PC-220-04", x: 372, y: 451 },
        { id: "PC-220-05", x: 397, y: 410 },
      ],
    },
    {
      id: 300,
      color: "#ff005d",
      bounds: { x: 612, y: 367, width: 183, height: 147 },
      pcs: [
        { id: "PC-300-01", x: 629, y: 388 },
        { id: "PC-300-02", x: 661, y: 472 },
        { id: "PC-300-03", x: 701, y: 426 },
        { id: "PC-300-04", x: 736, y: 488 },
        { id: "PC-300-05", x: 779, y: 438 },
        { id: "PC-300-06", x: 749, y: 382 },
      ],
    },
  ],
};

export const STATIC_MAP_DATA: StaticMapData = {
  image: RAW_STATIC_MAP_DATA.image,
  zones: RAW_STATIC_MAP_DATA.zones.map((zone) => ({
    ...zone,
    pcs: zone.pcs.map((pc) => enrichPcWithTechnicalDetails(pc, zone.id)),
  })),
};

function enrichPcWithTechnicalDetails(
  pc: Pick<TestPc, "id" | "x" | "y">,
  zoneId: number,
): TestPc {
  return {
    ...pc,
    technicalDetails: createPcTechnicalDetails(pc.id, zoneId),
  };
}
