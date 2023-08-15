export enum GameType {
  gotm,
  retrobit,
  rpg,
}

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
  type: GameType;
  title: Title;
  id: number;
  screenscraper_id?: number;
  img: string;
  year: number;
  system: string;
  developer: string;
  genre: string;
  time_to_beat: number;
  description?: string;
}

export const retrobitsGameDto = (data: any[]) => {
  return {
    type: GameType.retrobit,
    id: data[0],
    img: data[1],
    year: data[2],
    system: data[3],
    developer: data[4],
    genre: data[5],
    time_to_beat: data[6],
    title: {
      usa: data[7],
      eu: data[8],
      jap: data[9],
      world: data[10],
      other: data[11],
    } as Title,
    description: data[12],
  } as Game;
};

export const gameDto = (data: any[], type: GameType) => {
  return {
    type,
    id: data[0],
    screenscraper_id: data[1],
    img: data[2],
    year: data[3],
    system: data[4],
    developer: data[5],
    genre: data[6],
    time_to_beat: data[7] !== "" ? data[7] : -1,
    title: {
      usa: data[8],
      eu: data[9],
      jap: data[10],
      world: data[11],
      other: data[12],
    } as Title,
    description: data[13],
  } as Game;
};
