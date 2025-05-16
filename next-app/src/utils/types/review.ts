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
  date: string;
  positif: string;
  negatif: string;
  peopleAgree: number;
  peopleDisagree: number;
  note: Note;
}
