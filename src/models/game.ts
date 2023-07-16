export interface Nominator {
  id: number;
  name: string;
}

export interface Nomination {
  id: number;
  game_id: number;
  nominator_id: number;
  date: Date;
  description: string;
}

export interface Title {
  usa: string;
  eu: string;
  jap: string;
  world: string;
  other: string;
}

export interface Game {
  title: Title;
  id: number;
  screenscapre_id: number;
  img: string;
  year: number;
  system: string;
  developer: string;
  genre: string;
  time_to_beat: number;
  description?: string;
}
