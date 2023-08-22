/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
export enum NominationType {
  gotm, retrobit, rpg
}

export interface User {
  id: number;
  discord_name_original: string,
  display_name: string,
  discord_name: string,
  theme_id: number;
}

export interface Theme {
  id: number;
  creation_date: Date;
  title: string;
}

export interface Game {
  id: number;
  screenscraper_id: number;
  img: string;
  year: number;
  system: string;
  developer: string;
  genre: string;
  time_to_beat?: number;
  title_usa?: string;
  title_eu?: string;
  title_jap?: string;
  title_world?: string;
  title_other?: string;
}

export interface Nomination {
  id: number;
  nomination_type: NominationType;
  game_id: number;
  user_id?: number;
  theme_id?: number;
  is_winner: boolean
}

export interface Theme {
  id: number;
  creation_date: string;
  title: string;
  description: string;
}

export interface NominationData {
  display_name: string,
  game_description: string,
  title: string,
  description: string,
  date: string,
}

export const gameDto = (data: any[]): Game => {
  const [
    id,
    screenscraper_id,
    img,
    year,
    system,
    developer,
    genre,
    time_to_beat,
    title_usa,
    title_eu,
    title_jap,
    title_world,
    title_other,
  ] = data;
  return {
    id,
    screenscraper_id,
    img,
    year,
    system,
    developer,
    genre,
    time_to_beat: time_to_beat || 0,
    title_usa,
    title_eu,
    title_jap,
    title_world,
    title_other,
  } as Game;
};

export const nominationDto = (data: any[]): Nomination => {
  const [
    id,
  nomination_type,
  game_id,
  user_id,
  theme_id,
  is_winner
] = data;

  return {
    id,
  nomination_type,
  game_id,
  user_id,
  theme_id,
  is_winner
  } as Nomination;
};

export const themeDto = (data: any[]): Theme => {
 const [
  id,
  creation_date,
  title,
  description,
 ] = data;
 return {
  id,
  creation_date,
  title,
  description, 
 }
};

export const user = (data: any[]): User => {
  const [
    id,
    discord_name_original,
    display_name,
    discord_name,
  ] = data;

  return {
    id,
    discord_name_original,
    display_name,
    discord_name,
  } as User;
};

export const nominationDataDto = (data: any[]): NominationData => {
  const [
    display_name,
    game_description,
    title,
    description,
    date,
  ] = data;
  
  return {
    display_name,
    game_description,
    title,
    description,
    date,
  } as NominationData;
};