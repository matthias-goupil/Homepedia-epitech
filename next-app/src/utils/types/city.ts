import { Review, Note } from "./review";

export interface City {
  coordinates: {
    long: number;
    lat: number;
  };
  cityName: string;
  postalCode: string;
  totalNotes: number;
  note?: Note;
  reviews?: Review[];
}
