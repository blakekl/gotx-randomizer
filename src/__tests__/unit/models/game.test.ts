import { describe, it, expect } from 'vitest';
import {
  gameDto,
  nominationDto,
  themeDto,
  userDto,
  nominationListItemDto,
  completionsByUserIdDto,
  labeledStatDto,
  userListItemDto,
  nominationTypeToPoints,
  NominationType,
} from '../../../models/game';

describe('Game Models and DTOs', () => {
  describe('gameDto', () => {
    it('should convert array data to Game object correctly', () => {
      const mockData = [
        1, // id
        'Super Mario Bros.', // title_usa
        'Super Mario Bros.', // title_eu
        'スーパーマリオブラザーズ', // title_jap
        'Super Mario Bros.', // title_world
        '', // title_other
        1985, // year
        'NES', // system
        'Nintendo', // developer
        'Platform', // genre
        'https://example.com/mario.jpg', // img_url
        2, // time_to_beat
        12345, // screenscraper_id
        '2023-01-01T00:00:00Z', // created_at
        '2023-01-01T00:00:00Z', // updated_at
      ];

      const result = gameDto(mockData);

      expect(result).toEqual({
        id: 1,
        title_usa: 'Super Mario Bros.',
        title_eu: 'Super Mario Bros.',
        title_jap: 'スーパーマリオブラザーズ',
        title_world: 'Super Mario Bros.',
        title_other: '',
        year: 1985,
        system: 'NES',
        developer: 'Nintendo',
        genre: 'Platform',
        img_url: 'https://example.com/mario.jpg',
        time_to_beat: 2,
        screenscraper_id: 12345,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      });
    });

    it('should handle null/undefined values gracefully', () => {
      const mockData = [
        1, // id
        null, // title_usa
        undefined, // title_eu
        '', // title_jap
        'Test Game', // title_world
        null, // title_other
        2000, // year
        'Test System', // system
        'Test Developer', // developer
        'Test Genre', // genre
        '', // img_url
        null, // time_to_beat
        0, // screenscraper_id
        '2023-01-01T00:00:00Z', // created_at
        '2023-01-01T00:00:00Z', // updated_at
      ];

      const result = gameDto(mockData);

      expect(result.id).toBe(1);
      expect(result.title_usa).toBeNull();
      expect(result.title_eu).toBeUndefined();
      expect(result.title_world).toBe('Test Game');
      expect(result.time_to_beat).toBeNull();
    });

    it('should preserve all required fields', () => {
      const mockData = [
        1,
        '',
        '',
        '',
        '',
        '',
        2000,
        '',
        '',
        '',
        '',
        0,
        0,
        '',
        '',
      ];
      const result = gameDto(mockData);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('year');
      expect(result).toHaveProperty('system');
      expect(result).toHaveProperty('developer');
      expect(result).toHaveProperty('genre');
      expect(result).toHaveProperty('img_url');
      expect(result).toHaveProperty('screenscraper_id');
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
    });
  });

  describe('nominationDto', () => {
    it('should convert array data to Nomination object correctly', () => {
      const mockData = [
        1, // id
        'gotm', // nomination_type
        'Great platformer game', // description
        true, // winner
        1, // game_id
        1, // user_id
        1, // theme_id
        '2023-01-01T00:00:00Z', // created_at
        '2023-01-01T00:00:00Z', // updated_at
      ];

      const result = nominationDto(mockData);

      expect(result).toEqual({
        id: 1,
        nomination_type: 'gotm',
        description: 'Great platformer game',
        winner: true,
        game_id: 1,
        user_id: 1,
        theme_id: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      });
    });

    it('should handle boolean winner field correctly', () => {
      const mockDataTrue = [1, 'gotm', 'desc', true, 1, 1, 1, '', ''];
      const mockDataFalse = [2, 'gotm', 'desc', false, 1, 1, 1, '', ''];

      expect(nominationDto(mockDataTrue).winner).toBe(true);
      expect(nominationDto(mockDataFalse).winner).toBe(false);
    });
  });

  describe('themeDto', () => {
    it('should convert array data to Theme object correctly', () => {
      const mockData = [
        1, // id
        '2023-01-01', // creation_date
        'Platformers', // title
        'Classic platform games', // description
        '2023-01-01T00:00:00Z', // created_at
        '2023-01-01T00:00:00Z', // updated_at
        'gotm', // nomination_type
      ];

      const result = themeDto(mockData);

      expect(result).toEqual({
        id: 1,
        creation_date: '2023-01-01',
        title: 'Platformers',
        description: 'Classic platform games',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        nomination_type: 'gotm',
      });
    });
  });

  describe('userDto', () => {
    it('should convert array data to User object correctly', () => {
      const mockData = [
        1, // id
        'TestUser', // name
        '123456789', // discord_id
        'OldTestUser', // old_discord_name
        100, // current_points
        50, // redeemed_points
        150, // earned_points
        25, // premium_points
        '2023-01-01T00:00:00Z', // created_at
        '2023-01-01T00:00:00Z', // updated_at
        'supporter', // premium_subscriber
      ];

      const result = userDto(mockData);

      expect(result).toEqual({
        id: 1,
        name: 'TestUser',
        discord_id: '123456789',
        old_discord_name: 'OldTestUser',
        current_points: 100,
        redeemed_points: 50,
        earned_points: 150,
        premium_points: 25,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        premium_subscriber: 'supporter',
      });
    });
  });

  describe('nominationListItemDto', () => {
    it('should convert array data and format date correctly', () => {
      const mockData = [
        'Super Mario Bros.', // game_title
        'gotm', // nomination_type
        1, // game_id
        'TestUser', // user_name
        'Great game', // game_description
        'Platformers', // theme_title
        'Platform games', // theme_description
        '2023-01-01', // date
        1, // winner (as number)
      ];

      const result = nominationListItemDto(mockData);

      expect(result.game_title).toBe('Super Mario Bros.');
      expect(result.nomination_type).toBe('gotm');
      expect(result.game_id).toBe(1);
      expect(result.user_name).toBe('TestUser');
      expect(result.winner).toBe(true);
      expect(result.date).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Date format
    });

    it('should convert winner number to boolean correctly', () => {
      const mockDataWinner = [
        'Game',
        'gotm',
        1,
        'User',
        'Desc',
        'Theme',
        'Theme Desc',
        '2023-01-01',
        1,
      ];
      const mockDataLoser = [
        'Game',
        'gotm',
        1,
        'User',
        'Desc',
        'Theme',
        'Theme Desc',
        '2023-01-01',
        0,
      ];

      expect(nominationListItemDto(mockDataWinner).winner).toBe(true);
      expect(nominationListItemDto(mockDataLoser).winner).toBe(false);
    });
  });

  describe('completionsByUserIdDto', () => {
    it('should convert array data and format date correctly', () => {
      const mockData = [
        1, // id
        'Super Mario Bros.', // title_world
        'Super Mario Bros.', // title_usa
        'Super Mario Bros.', // title_eu
        'スーパーマリオブラザーズ', // title_jap
        '', // title_other
        '2023-01-01', // date
        'gotm', // nomination_type
        1, // theme_id
        true, // retroachievements
      ];

      const result = completionsByUserIdDto(mockData);

      expect(result.id).toBe(1);
      expect(result.title_world).toBe('Super Mario Bros.');
      expect(result.nomination_type).toBe('gotm');
      expect(result.theme_id).toBe(1);
      expect(result.retroachievements).toBe(true);
      expect(result.date).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });

  describe('labeledStatDto', () => {
    it('should convert array data to LabeledStat correctly', () => {
      const mockData = ['Test Label', 42];
      const result = labeledStatDto(mockData);

      expect(result).toEqual({
        label: 'Test Label',
        value: 42,
      });
    });

    it('should handle numeric labels', () => {
      const mockData = [2023, 100];
      const result = labeledStatDto(mockData);

      expect(result.label).toBe(2023);
      expect(result.value).toBe(100);
    });
  });

  describe('userListItemDto', () => {
    it('should convert array data to UserListItem correctly', () => {
      const mockData = [1, 'TestUser', 0.75, 8, 6];
      const result = userListItemDto(mockData);

      expect(result).toEqual({
        id: 1,
        name: 'TestUser',
        success_rate: 0.75,
        nominations: 8,
        wins: 6,
      });
    });
  });

  describe('nominationTypeToPoints', () => {
    it('should return 3 points for RPG with retroachievements', () => {
      const result = nominationTypeToPoints(20, NominationType.RPG, true);
      expect(result).toBe(3);
    });

    it('should return 1 point for GOTM after theme 16', () => {
      const result = nominationTypeToPoints(17, NominationType.GOTM, false);
      expect(result).toBe(1);
    });

    it('should return 0.5 points for RETROBIT after theme 16', () => {
      const result = nominationTypeToPoints(17, NominationType.RETROBIT, false);
      expect(result).toBe(0.5);
    });

    it('should return 0.5 points for GOTWOTY after theme 16', () => {
      const result = nominationTypeToPoints(17, NominationType.GOTWOTY, false);
      expect(result).toBe(0.5);
    });

    it('should return 1 point for GOTY after theme 16', () => {
      const result = nominationTypeToPoints(17, NominationType.GOTY, false);
      expect(result).toBe(1);
    });

    it('should return 0 points for themes <= 16 (except RPG with retroachievements)', () => {
      expect(nominationTypeToPoints(16, NominationType.GOTM, false)).toBe(0);
      expect(nominationTypeToPoints(10, NominationType.RPG, false)).toBe(0); // RPG without retroachievements
      expect(nominationTypeToPoints(1, NominationType.RETROBIT, false)).toBe(0);
    });

    it('should handle edge cases with invalid theme numbers', () => {
      expect(nominationTypeToPoints(0, NominationType.GOTM, false)).toBe(0);
      expect(nominationTypeToPoints(-1, NominationType.GOTM, false)).toBe(0);
    });

    it('should prioritize RPG with retroachievements over theme rules', () => {
      // Even for theme <= 16, RPG with retroachievements should return 3
      const result = nominationTypeToPoints(10, NominationType.RPG, true);
      expect(result).toBe(3);
    });
  });
});
