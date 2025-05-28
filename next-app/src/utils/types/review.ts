export interface Note {
  globalNote: number;
  environment: number;
  transports: number;
  security: number;
  health: number;
  sportsAndLeisure: number;
  culture: number;
  education: number;
  shops: number;
  lifeQuality: number;
}

export interface Review {
  positif: string;
  negatif: string;
  soutenu: number;
  pasSoutenu: number;
  note: Note;
}
