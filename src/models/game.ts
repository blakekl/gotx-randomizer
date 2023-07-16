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

export const gameDto = (data: any[]) => {
  return {
    id: data[0],
    screenscapre_id: data[1],
    img: data[2],
    year: data[3],
    system: data[4],
    developer: data[5],
    genre: data[6],
    time_to_beat: data[7],
    title: {
      title_usa: data[8],
      title_eu: data[9],
      title_jap: data[10],
      title_world: data[11],
      title_other: data[12]
    } as Title,
  } as Game
};