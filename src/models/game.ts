/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
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
  user_id: number;
  description: string;
  theme_id: number;
}

export interface Theme {
  id: number;
  creation_date: Date;
  title: string;
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
  creation_date?: Date;
}

export const retrobitsGameDto = (data: any[]) => {
  return {
    type: GameType.retrobit,
    id: data[0],
    creation_date: new Date('' + data[1]),
    img: data[2],
    year: data[3],
    system: data[4],
    developer: data[5],
    genre: data[6],
    time_to_beat: data[7],
    title: {
      usa: data[8] || '',
      eu: data[9] || '',
      jap: data[10] || '',
      world: data[11] || '',
      other: data[12] || '',
    } as Title,
    description: data[13],
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
    time_to_beat: data[7] !== '' ? data[7] : -1,
    title: {
      usa: data[8] || '',
      eu: data[9] || '',
      jap: data[10] || '',
      world: data[11] || '',
      other: data[12] || '',
    } as Title,
    description: data[13],
  } as Game;
};
