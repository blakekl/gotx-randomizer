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
  title_usa: string;
  title_eu: string;
  title_jap: string;
  title_world: string;
  title_other: string;
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
