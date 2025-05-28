import { Review, Note } from "./review";

export interface City {
  coodonnees: {
    long: number;
    lat: number;
  };
  nom: string;
  code: string;
  codesPostaux: string[];
  codeDepartement: string;
  codeRegion: string;
  codeEpci: string;
  siren: string;
  totalAvis: number;
  avisGlobal: Note;
  avis: Review[];
}
