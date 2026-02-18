
export type Zone = {
  id: number;
  nom: string;
  position: [number, number, number, number];
};

export type ZonesFile = {
  zones: Zone[];
};
