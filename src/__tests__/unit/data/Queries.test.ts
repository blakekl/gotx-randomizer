import { describe, it, expect } from 'vitest';
import {
  getRetrobits,
  getRpgRunnerup,
  getWinningRpg,
  getGotmRunnerup,
  getWinningGotm,
  getUserById,
  getNominations,
  getGotmNominations,
  getRetrobitNominations,
  getNominationDataByGameId,
  getNominationDataByUserId,
  getCompletionsByUserId,
  getGameById,
  getThemesWithStatus,
  getCurrentWinners,
  getThemeDetailWithCategories,
} from '../../../data/Queries';

describe('Database Queries', () => {
  describe('Game queries', () => {
    it('should generate valid SQL for getRetrobits', () => {
      expect(getRetrobits).toContain('SELECT');
      expect(getRetrobits).toContain('[public.games]');
      expect(getRetrobits).toContain("nomination_type = 'retro'");
      expect(getRetrobits).not.toContain('undefined');
      expect(getRetrobits).not.toContain('null');
    });

    it('should generate valid SQL for getRpgRunnerup', () => {
      expect(getRpgRunnerup).toContain('SELECT');
      expect(getRpgRunnerup).toContain('[public.games]');
      expect(getRpgRunnerup).toContain("nomination_type = 'rpg'");
      expect(getRpgRunnerup).toContain('winner = 1');
      expect(getRpgRunnerup).toContain('NOT IN');
    });

    it('should generate valid SQL for getWinningRpg', () => {
      expect(getWinningRpg).toContain('SELECT');
      expect(getWinningRpg).toContain('[public.games]');
      expect(getWinningRpg).toContain("nomination_type = 'rpg'");
      expect(getWinningRpg).toContain('winner = 1');
    });

    it('should generate valid SQL for getGotmRunnerup', () => {
      expect(getGotmRunnerup).toContain('SELECT');
      expect(getGotmRunnerup).toContain('[public.games]');
      expect(getGotmRunnerup).toContain("nomination_type = 'gotm'");
      expect(getGotmRunnerup).toContain('winner = 1');
      expect(getGotmRunnerup).toContain('NOT IN');
    });

    it('should generate valid SQL for getWinningGotm', () => {
      expect(getWinningGotm).toContain('SELECT');
      expect(getWinningGotm).toContain('[public.games]');
      expect(getWinningGotm).toContain("nomination_type = 'gotm'");
      expect(getWinningGotm).toContain('winner = 1');
    });
  });

  describe('User queries', () => {
    it('should generate valid SQL for getUserById with parameter', () => {
      const query = getUserById(123);
      expect(query).toContain('SELECT');
      expect(query).toContain('[public.users]');
      expect(query).toContain("WHERE id = '123'");
    });

    it('should handle different user IDs', () => {
      const query1 = getUserById(1);
      const query2 = getUserById(999);

      expect(query1).toContain("WHERE id = '1'");
      expect(query2).toContain("WHERE id = '999'");
    });

    it('should escape user ID parameter', () => {
      const query = getUserById(123);
      expect(query).toContain("'123'"); // Should be quoted
    });
  });

  describe('Nomination queries', () => {
    it('should generate valid SQL for getNominations', () => {
      expect(getNominations).toContain('SELECT');
      expect(getNominations).toContain('[public.nominations]');
    });

    it('should generate valid SQL for getGotmNominations', () => {
      expect(getGotmNominations).toContain('SELECT');
      expect(getGotmNominations).toContain('[public.nominations]');
      expect(getGotmNominations).toContain("nomination_type = 'gotm'");
    });

    it('should generate valid SQL for getRetrobitNominations', () => {
      expect(getRetrobitNominations).toContain('SELECT');
      expect(getRetrobitNominations).toContain('[public.nominations]');
      expect(getRetrobitNominations).toContain("nomination_type = 'retro'");
    });
  });

  describe('Theme browser queries', () => {
    it('should generate valid SQL for getThemesWithStatus', () => {
      expect(getThemesWithStatus).toContain('SELECT');
      expect(getThemesWithStatus).toContain('[public.themes]');
      expect(getThemesWithStatus).toContain('winner = 1');
      expect(getThemesWithStatus).not.toContain('strftime'); // No date filtering
      expect(getThemesWithStatus).not.toContain('creation_date >'); // No date comparison
    });

    it('should generate valid SQL for getCurrentWinners', () => {
      expect(getCurrentWinners).toContain('SELECT');
      expect(getCurrentWinners).toContain('[public.nominations]');
      expect(getCurrentWinners).toContain('winner = 1');
      expect(getCurrentWinners).not.toContain('strftime'); // No date filtering
    });

    it('should generate valid SQL for getThemeDetailWithCategories', () => {
      const query = getThemeDetailWithCategories(123);
      expect(query).toContain('SELECT');
      expect(query).toContain('[public.themes]');
      expect(query).toContain('123');
      expect(query).toContain('winner = 1'); // Winner-based privacy
      expect(query).not.toContain('strftime'); // No date filtering
    });

    it('should use winner-based privacy in theme queries', () => {
      expect(getThemesWithStatus).toContain(
        'EXISTS(SELECT 1 FROM [public.nominations] n2 WHERE n2.theme_id = [public.themes].id AND n2.winner = 1)',
      );

      const detailQuery = getThemeDetailWithCategories(1);
      expect(detailQuery).toContain(
        'NOT EXISTS(SELECT 1 FROM [public.nominations] n3 WHERE n3.theme_id = [public.themes].id AND n3.winner = 1) THEN NULL',
      );
    });
  });

  describe('Parameterized queries', () => {
    it('should generate valid SQL for getNominationDataByGameId', () => {
      const query = getNominationDataByGameId(123);
      expect(query).toContain('SELECT');
      expect(query).toContain('123');
      expect(query).not.toContain('undefined');
    });

    it('should generate valid SQL for getNominationDataByUserId', () => {
      const query = getNominationDataByUserId(456);
      expect(query).toContain('SELECT');
      expect(query).toContain('456');
      expect(query).not.toContain('undefined');
    });

    it('should generate valid SQL for getCompletionsByUserId', () => {
      const query = getCompletionsByUserId(789);
      expect(query).toContain('SELECT');
      expect(query).toContain('789');
      expect(query).not.toContain('undefined');
    });

    it('should generate valid SQL for getGameById', () => {
      const query = getGameById(101);
      expect(query).toContain('SELECT');
      expect(query).toContain('101');
      expect(query).toContain('[public.games]');
      expect(query).not.toContain('undefined');
    });
  });

  describe('SQL injection prevention', () => {
    it('should handle numeric parameters safely', () => {
      const query = getUserById(123);
      expect(query).not.toContain('--');
      expect(query).not.toContain('DROP');
      expect(query).not.toContain('DELETE');
      expect(query).not.toContain('INSERT');
      expect(query).not.toContain('UPDATE');
    });

    it('should quote parameters appropriately', () => {
      const query = getUserById(123);
      expect(query).toMatch(/WHERE id = '[0-9]+'/);
    });
  });

  describe('Query structure validation', () => {
    const queries = [
      { name: 'getRetrobits', query: getRetrobits },
      { name: 'getRpgRunnerup', query: getRpgRunnerup },
      { name: 'getWinningRpg', query: getWinningRpg },
      { name: 'getGotmRunnerup', query: getGotmRunnerup },
      { name: 'getWinningGotm', query: getWinningGotm },
      { name: 'getNominations', query: getNominations },
      { name: 'getGotmNominations', query: getGotmNominations },
      { name: 'getRetrobitNominations', query: getRetrobitNominations },
      { name: 'getThemesWithStatus', query: getThemesWithStatus },
      { name: 'getCurrentWinners', query: getCurrentWinners },
    ];

    queries.forEach(({ name, query }) => {
      it(`${name} should be a valid SQL string`, () => {
        expect(typeof query).toBe('string');
        expect(query.length).toBeGreaterThan(0);
        expect(query.toUpperCase()).toContain('SELECT');
      });

      it(`${name} should not contain obvious syntax errors`, () => {
        expect(query).not.toContain(';;');
        expect(query).not.toContain('SELCT'); // Common typo
        expect(query).not.toContain('FORM'); // Common typo
      });
    });

    const parameterizedQueries = [
      { name: 'getUserById', fn: getUserById },
      { name: 'getNominationDataByGameId', fn: getNominationDataByGameId },
      { name: 'getNominationDataByUserId', fn: getNominationDataByUserId },
      { name: 'getCompletionsByUserId', fn: getCompletionsByUserId },
      { name: 'getGameById', fn: getGameById },
      {
        name: 'getThemeDetailWithCategories',
        fn: getThemeDetailWithCategories,
      },
    ];

    parameterizedQueries.forEach(({ name, fn }) => {
      it(`${name} should generate valid SQL with parameters`, () => {
        const query = fn(123);
        expect(typeof query).toBe('string');
        expect(query.length).toBeGreaterThan(0);
        expect(query.toUpperCase()).toContain('SELECT');
        expect(query).toContain('123');
      });
    });
  });

  describe('Table and column references', () => {
    it('should use consistent table naming convention', () => {
      const queries = [
        getRetrobits,
        getRpgRunnerup,
        getWinningRpg,
        getGotmRunnerup,
        getWinningGotm,
      ];

      queries.forEach((query) => {
        expect(query).toContain('[public.games]');
        expect(query).toContain('[public.nominations]');
      });
    });

    it('should reference valid nomination types', () => {
      expect(getRetrobits).toContain("'retro'");
      expect(getRpgRunnerup).toContain("'rpg'");
      expect(getWinningRpg).toContain("'rpg'");
      expect(getGotmRunnerup).toContain("'gotm'");
      expect(getWinningGotm).toContain("'gotm'");
      expect(getGotmNominations).toContain("'gotm'");
      expect(getRetrobitNominations).toContain("'retro'");
    });
  });
});
