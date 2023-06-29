export interface Nomination {
  nominator: string;
  date: Date;
}

export interface Title {
  usa?: string;
  eu?: string;
  jap?: string;
  world?: string;
  other?: string;
}

export interface GameData {
  title: Title;
  screenscraperId?: number;
  mobyGamesId?: number;
  year: number;
  system: string;
  developer: string;
  genre: string;
  description: string;
  img: string;
  timeToBeat: number;
  nominations?: Nomination[];
}
