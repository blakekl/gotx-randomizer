/* eslint @typescript-eslint/no-explicit-any: 0 */

import dayjs from 'dayjs';

/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
export enum NominationType {
  GOTM = 'gotm',
  RETROBIT = 'retro',
  RPG = 'rpg',
  GOTWOTY = 'gotwoty',
  GOTY = 'goty',
}

export enum Subscription {
  SUPPORTER = 'supporter',
  CHAMPION = 'champion',
  LEGEND = 'legend',
}

export interface User {
  id: number;
  name: string;
  discord_id: string;
  old_discord_name: string;
  current_points: number;
  redeemed_points: number;
  earned_points: number;
  premium_points: number;
  created_at: string;
  updated_at: string;
  premium_subscriber: Subscription;
}

export interface Game {
  id: number;
  title_usa?: string;
  title_eu?: string;
  title_jap?: string;
  title_world?: string;
  title_other?: string;
  year: number;
  system: string;
  developer: string;
  genre: string;
  img_url: string;
  time_to_beat?: number;
  screenscraper_id: number;
  created_at: string;
  updated_at: string;
}

export interface Nomination {
  id: number;
  nomination_type: NominationType;
  description: string;
  winner: boolean;
  game_id: number;
  user_id: number;
  theme_id: number;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: number;
  creation_date: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  nomination_type: NominationType;
}

export const gameDto = (data: any[]): Game => {
  const [
    id,
    title_usa,
    title_eu,
    title_jap,
    title_world,
    title_other,
    year,
    system,
    developer,
    genre,
    img_url,
    time_to_beat,
    screenscraper_id,
    created_at,
    updated_at,
  ] = data;
  return {
    id,
    title_usa,
    title_eu,
    title_jap,
    title_world,
    title_other,
    year,
    system,
    developer,
    genre,
    img_url,
    time_to_beat,
    screenscraper_id,
    created_at,
    updated_at,
  } as Game;
};

export const nominationDto = (data: any[]): Nomination => {
  const [id, nomination_type, description, winner, game_id, user_id, theme_id, created_at, updated_at ] = data;

  return {
    id,
    nomination_type,
    description,
    winner,
    game_id,
    user_id,
    theme_id,
    created_at,
    updated_at,
  } as Nomination;
};

export const themeDto = (data: any[]): Theme => {
  const [id, creation_date, title, description, created_at, updated_at, nomination_type] = data;
  return {
    id,
    creation_date,
    title,
    description,
    created_at,
    updated_at,
    nomination_type,
  };
};

export const userDto = (data: any[]): User => {
  const [id, name, discord_id, old_discord_name, current_points, redeemed_points, earned_points, premium_points, created_at, updated_at, premium_subscriber] = data;

  return {
    id,
    name,
    discord_id,
    old_discord_name,
    current_points,
    redeemed_points,
    earned_points,
    premium_points,
    created_at,
    updated_at,
    premium_subscriber,
  } as User;
};

const firstRetrobitDate = dayjs('2022-03-27T00:00:00.000Z');
const firstRpgDate = dayjs('2023-01-01T13:00:00.000Z');
export const convertDate = (nomination: Nomination, index: number) => {
  switch (nomination.nomination_type) {
    case NominationType.RETROBIT:
      return {
        ...nomination,
        date: firstRetrobitDate
          .add(7 * index, 'days')
          .toDate()
          .toLocaleDateString(),
      };
    case NominationType.RPG:
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
