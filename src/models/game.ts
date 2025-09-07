/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/no-unsafe-assignment: 0 */

import dayjs from 'dayjs';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

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

export enum SeriesType {
  BAR = 'bar',
  COLUMN = 'column',
  LINE = 'line',
  SPLINE = 'spline',
}

export const nominationTypeToPoints = (
  theme: number,
  type: NominationType,
  retroachievements: boolean,
): number => {
  if (type === NominationType.RPG && retroachievements) {
    return 3;
  } else {
    if (theme > 16) {
      // this is the last theme before we implemented the points system.
      switch (type) {
        case NominationType.RETROBIT:
        case NominationType.GOTWOTY:
          return 0.5;
        default:
          return 1;
      }
    }
  }
  return 0;
};

// ============================================================================
// CORE TABLE INTERFACES
// ============================================================================

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

export interface Theme {
  id: number;
  creation_date: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  nomination_type: NominationType;
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

// ============================================================================
// COMPOSED INTERFACES (List Items & Stats)
// ============================================================================

export interface UserListItem {
  id: number;
  name: string;
  success_rate: number;
  nominations: number;
  wins: number;
  completions: number;
}

export interface NominationListItem {
  game_title: string;
  nomination_type: NominationType;
  game_id: number;
  user_name: string;
  game_description: string;
  theme_title: string;
  theme_description: string;
  date: string;
  winner: boolean;
}

export interface CompletionListItem {
  id: number;
  title_world: string;
  title_usa: string;
  title_eu: string;
  title_jap: string;
  title_other: string;
  date: string;
  nomination_type: NominationType;
  theme_id: number;
  retroachievements: boolean;
}

export interface LabeledStat {
  label: string;
  value: number;
}

// ============================================================================
// DTO FUNCTIONS (Database Result Mappers)
// ============================================================================

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
  const [
    id,
    nomination_type,
    description,
    winner,
    game_id,
    user_id,
    theme_id,
    created_at,
    updated_at,
  ] = data;

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
  const [
    id,
    creation_date,
    title,
    description,
    created_at,
    updated_at,
    nomination_type,
  ] = data;
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
  const [
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
  ] = data;

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

export const nominationListItemDto = (data: any[]): NominationListItem => {
  const [
    game_title,
    nomination_type,
    game_id,
    user_name,
    game_description,
    theme_title,
    theme_description,
    date,
    winner,
  ] = data;
  return {
    game_title,
    nomination_type,
    game_id,
    user_name,
    game_description,
    theme_title,
    theme_description,
    date: dayjs(`${date}T13:00:00.000Z`).toDate().toLocaleDateString(),
    winner: winner === 1,
  } as NominationListItem;
};

export const completionsByUserIdDto = (data: any[]): CompletionListItem => {
  const [
    id,
    title_world,
    title_usa,
    title_eu,
    title_jap,
    title_other,
    date,
    nomination_type,
    theme_id,
    retroachievements,
  ] = data;
  return {
    id,
    title_world,
    title_usa,
    title_eu,
    title_jap,
    title_other,
    date: dayjs(`${date}T13:00:00.000Z`).toDate().toLocaleDateString(),
    nomination_type,
    theme_id,
    retroachievements,
  } as CompletionListItem;
};

export const labeledStatDto = (data: any[]): LabeledStat => {
  const [label, value] = data;
  return { label, value } as LabeledStat;
};

export const userListItemDto = (data: any[]): UserListItem => {
  const [id, name, success_rate, nominations, wins] = data;
  return { id, name, success_rate, nominations, wins } as UserListItem;
};

// ============================================================================
// THEME BROWSER INTERFACES
// ============================================================================

export interface YearCategoryBreakdown {
  'pre 96': number;
  '96-99'?: number; // Only for theme_id < 235 (from existing logic)
  '2k+'?: number; // Only for theme_id < 235 (from existing logic)
  '96-01'?: number; // Only for theme_id >= 235 (from existing logic)
  '02+'?: number; // Only for theme_id >= 235 (from existing logic)
}

// Extend existing Theme interface for theme browser needs
export interface ThemeWithStatus extends Theme {
  status: 'current' | 'upcoming' | 'historical';
  displayTitle: string; // For privacy handling - "Upcoming GotM Theme" vs actual title
  nominationCount: number;
  winners: Game[]; // Multiple winners possible (GotM categories, GotY awards)
  categoryBreakdown: YearCategoryBreakdown;
  winnersByCategory?: { [category: string]: Game }; // For GotM year categories
}

// Extend existing Nomination for theme browser context
export interface NominationWithGame extends Nomination {
  game: Game; // Full game object instead of just game_id
  yearCategory: string; // Computed category based on theme_id and year
  user_name?: string; // From user join
  themeDescription?: string; // Theme description for GotY categories
}

// For current active themes dashboard - updated for multiple winners
export interface CurrentTheme {
  nominationType: NominationType;
  theme: ThemeWithStatus;
  winners: Game[]; // Array to handle multiple winners
  isMultiWinner: boolean; // Flag for special display logic
}

// For GotY program - multiple themes per year with same creation_date
export interface GotyYearGroup {
  year: number;
  creation_date: string;
  themes: ThemeWithStatus[]; // Multiple award categories
  allWinners: Game[]; // All winners across categories
}

// Theme filtering options
export interface ThemeFilters {
  programType?: NominationType | 'all';
  year?: number | 'all';
  status?: 'current' | 'upcoming' | 'historical' | 'all';
  searchTerm?: string; // Only searches historical themes (privacy)
}

// ============================================================================
// THEME BROWSER DTO FUNCTIONS
// ============================================================================

export const themeWithStatusDto = (data: any[]): ThemeWithStatus => {
  const [
    id,
    nomination_type,
    creation_date,
    description,
    created_at,
    updated_at,
    status,
    display_title,
    nomination_count,
    // winner_count - not used in this DTO but part of query result
  ] = data;

  return {
    id,
    creation_date,
    title: display_title, // Privacy-aware title
    description,
    created_at,
    updated_at,
    nomination_type,
    status,
    displayTitle:
      display_title ||
      `Upcoming ${String(nomination_type).toUpperCase()} Theme`,
    nominationCount: nomination_count || 0,
    winners: [], // Will be populated separately
    categoryBreakdown: {}, // Will be computed separately
  } as ThemeWithStatus;
};

export const nominationWithGameDto = (data: any[]): NominationWithGame => {
  // Extract only the fields we need, using array indices
  const theme_id = data[0]; // t.id
  // const theme_title = data[1]; // t.title (not used)
  const nomination_type = data[2]; // t.nomination_type
  // const creation_date = data[3]; // t.creation_date (not used)
  const theme_description = data[4]; // t.description
  const title_world = data[5]; // g.title_world
  const title_usa = data[6]; // g.title_usa
  const title_eu = data[7]; // g.title_eu
  const title_jap = data[8]; // g.title_jap
  const title_other = data[9]; // g.title_other
  const game_id = data[10]; // g.id as game_id
  const year = data[11]; // g.year
  const screenscraper_id = data[12]; // g.screenscraper_id
  const system = data[13]; // g.system
  const developer = data[14]; // g.developer
  const genre = data[15]; // g.genre
  const img_url = data[16]; // g.img_url
  const time_to_beat = data[17]; // g.time_to_beat
  const winner = data[18]; // n.winner
  const nomination_description = data[19]; // n.description as nomination_description
  const user_name = data[20]; // u.name as user_name
  const year_category = data[21]; // year_category

  return {
    // Nomination fields (using existing Nomination interface structure)
    id: 0, // Will be set separately if needed
    nomination_type,
    description: nomination_description || '',
    winner: winner === 1,
    game_id,
    user_id: 0, // Will be set separately if needed
    theme_id,
    created_at: '',
    updated_at: '',

    // Game object with all title fields
    game: {
      id: game_id,
      title_world,
      title_usa,
      title_eu,
      title_jap,
      title_other,
      year,
      system,
      developer,
      genre,
      img_url,
      time_to_beat,
      screenscraper_id,
      created_at: '',
      updated_at: '',
    } as Game,

    // Additional fields
    yearCategory: year_category || 'Unknown',
    user_name,
    themeDescription: theme_description || undefined, // Theme description for GotY categories
  } as NominationWithGame;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the best available title for a game, following the same priority as coalescedTitle
 * Priority: title_world > title_usa > title_eu > title_jap > title_other
 */
export const getBestGameTitle = (game: Game): string => {
  return (
    game.title_world ||
    game.title_usa ||
    game.title_eu ||
    game.title_jap ||
    game.title_other ||
    'Unknown Title'
  );
};

/**
 * Get the display name for a theme type
 * Uses enum for type safety and consistent handling
 */
export const getThemeTypeDisplay = (type: NominationType): string => {
  switch (type) {
    case NominationType.GOTM:
      return 'Game of the Month';
    case NominationType.GOTY:
      return 'Game of the Year';
    case NominationType.RETROBIT:
      return 'Retrobit';
    case NominationType.RPG:
      return 'RPG';
    case NominationType.GOTWOTY:
      return 'Game of the Week of the Year';
    default:
      return 'Unknown Theme Type';
  }
};

/**
 * Get the short display name for a theme type
 * Used for filter buttons, navigation, and compact displays
 */
export const getThemeTypeShort = (type: NominationType): string => {
  switch (type) {
    case NominationType.GOTM:
      return 'GotM';
    case NominationType.GOTY:
    case NominationType.GOTWOTY:
      return 'GotY';
    case NominationType.RETROBIT:
      return 'Retrobit';
    case NominationType.RPG:
      return 'RPG';
    default:
      return 'Unknown';
  }
};

/**
 * Get the FontAwesome icon class for a theme type
 * Returns appropriate icon classes for visual representation of theme types
 */
export const getThemeIcon = (type: NominationType): string => {
  switch (type) {
    case NominationType.GOTM:
      return 'fas fa-trophy';
    case NominationType.GOTY:
      return 'fas fa-crown';
    case NominationType.RETROBIT:
      return 'fas fa-gamepad';
    case NominationType.RPG:
      return 'fas fa-dragon';
    case NominationType.GOTWOTY:
      return 'fas fa-calendar-week';
    default:
      return 'fas fa-star';
  }
};

export const currentThemeDto = (data: any[]): CurrentTheme => {
  const [
    nomination_type,
    theme_title,
    theme_id,
    creation_date,
    theme_description,
    theme_created_at,
    theme_updated_at,
    title_world,
    title_usa,
    title_eu,
    title_jap,
    title_other,
    game_id,
    screenscraper_id,
    year,
    system,
    developer,
    genre,
    img_url,
    time_to_beat, // year_category - not used
    ,
    nomination_count,
  ] = data;

  const game: Game = {
    id: game_id,
    title_world,
    title_usa,
    title_eu,
    title_jap,
    title_other,
    year,
    system,
    developer,
    genre,
    img_url,
    time_to_beat,
    screenscraper_id,
    created_at: '',
    updated_at: '',
  };

  const theme: ThemeWithStatus = {
    id: theme_id,
    creation_date,
    title: theme_title,
    description: theme_description || '',
    created_at: theme_created_at,
    updated_at: theme_updated_at,
    nomination_type,
    status: 'current',
    displayTitle: theme_title,
    nominationCount: nomination_count || 0,
    winners: [game],
    categoryBreakdown: {},
  };

  return {
    nominationType: nomination_type,
    theme,
    winners: [game],
    isMultiWinner: false, // Will be determined by caller
  } as CurrentTheme;
};
