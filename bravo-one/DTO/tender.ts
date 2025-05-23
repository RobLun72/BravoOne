export interface Material {
  Benämning: string;
  Mängd: number;
  Enhet: string;
}

export interface ActCard {
  Uppgift: string;
  "Uppgift Beskrivning": string;
  "Total tid": number;
  Material: Material[];
}

export interface Tender {
  Aktivitetskort: ActCard[];
}
