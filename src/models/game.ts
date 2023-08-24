/* eslint @typescript-eslint/no-explicit-any: 0 */

import dayjs from 'dayjs';

/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
export enum NominationType {
  gotm,
  retrobit,
  rpg,
}

export interface User {
  discord_name_original: string;
  discord_name: string;
  display_name: string;
  id: number;
}

export interface Game {
  developer: string;
  genre: string;
  id: number;
  img: string;
  screenscraper_id: number;
  system: string;
  time_to_beat?: number;
  title_eu?: string;
  title_jap?: string;
  title_other?: string;
  title_usa?: string;
  title_world?: string;
  year: number;
}

export interface Nomination {
  game_id: number;
  id: number;
  is_winner: boolean;
  nomination_type: NominationType;
  theme_id?: number;
  user_id?: number;
}

export interface Theme {
  creation_date: string;
  description: string;
  id: number;
  title: string;
}

export interface UserNomination {
  date: string;
  game_description: string;
  game_id: number;
  nomination_type: NominationType;
  theme_description: string;
  theme_title: string;
  user_name: string;
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
  const [id, nomination_type, game_id, user_id, theme_id, is_winner] = data;

  return {
    id,
    nomination_type,
    game_id,
    user_id,
    theme_id,
    is_winner,
  } as Nomination;
};

export const themeDto = (data: any[]): Theme => {
  const [id, creation_date, title, description] = data;
  return {
    id,
    creation_date,
    title,
    description,
  };
};

export const userDto = (data: any[]): User => {
  const [id, discord_name_original, display_name, discord_name] = data;

  return {
    id,
    discord_name_original,
    display_name,
    discord_name,
  } as User;
};

const firstRetrobitDate = dayjs('2022-03-27T00:00:00.000Z');
const firstRpgDate = dayjs('2023-01-01T13:00:00.000Z');

export const userNominationDto = (data: any[]): UserNomination => {
  const [
    nomination_type,
    game_id,
    user_name,
    game_description,
    theme_title,
    theme_description,
    date,
  ] = data;

  return {
    date: dayjs(`${date}T13:00:00.000Z`).toDate().toLocaleDateString(),
    game_description,
    game_id,
    nomination_type,
    theme_description,
    theme_title,
    user_name,
  } as UserNomination;
};

export const convertDate = (nomination: UserNomination, index: number) => {
  switch (nomination.nomination_type) {
    case NominationType.retrobit:
      return {
        ...nomination,
        date: firstRetrobitDate
          .add(7 * index, 'days')
          .toDate()
          .toLocaleDateString(),
      };
    case NominationType.rpg:
      return {
        ...nomination,
        date: firstRpgDate
          .add(3 * index, 'months')
          .toDate()
          .toLocaleDateString(),
      };
    default:
      return nomination;
  }
};
