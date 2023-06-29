export interface Nomination {
  nominator: string;
  date: Date;
}
export interface GameData {
  title: string;
  alternateTitles: string[];
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
