import initSqlJs from 'sql.js';
import { Database } from 'sql.js';
import databaseUrl from '../gotx-randomizer.sqlite?url';

import {
  avgNominationsBeforeWin,
  avgTimeToBeatByMonth,
  completionsCountByGame,
  getGotmRunnerup,
  getRetrobits,
  getRpgRunnerup,
  getWinningGotm,
  getWinningRpg,
  longestMonthsByAvgTimeToBeat,
  mostCompletedGames,
  mostCompletedGotmGames,
  mostCompletedGotyGames,
  mostCompletedRetrobitGames,
  mostCompletedRetrobitYearGames,
  mostCompletedRpgGames,
  mostNominatedGames,
  mostNominatedGamesByUser,
  mostNominatedLoserGames,
  newestCompletions,
  newestGotmCompletions,
  newestGotwotyCompletions,
  newestGotyCompletions,
  newestRetrobitCompletions,
  newestRpgCompletions,
  shortestMonthsByAvgTimeToBeat,
  topNominationWinsByUser,
  totalNomsBeforeWinByGame,
  totalTimeToBeatByMonth,
  nominationSuccessPercentByUser,
  getNominationDataByGameId as getNominationsByGameId,
  getNominationDataByUserId,
  getCompletionsByUserId,
  getGameById,
} from '../data/Queries';
import {
  completionsByUserIdDto,
  gameDto,
  labeledStatDto,
  nominationListItemDto,
  userListItemDto,
} from '../models/game';

const initDbClient = async () => {
  let SQL: initSqlJs.SqlJsStatic;
  let db: Database | null;

  try {
    SQL = await initSqlJs({
      locateFile: (file) =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`,
    });
    const response = await fetch(databaseUrl);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    db = new SQL.Database(buffer);
  } catch (e) {
    console.error(e);
  }

  return {
    getGotmRunnerup: () => {
      return db?.exec(`${getGotmRunnerup}`)[0].values.map((x) => gameDto(x));
    },
    getGotmWinners: () => {
      return db?.exec(`${getWinningGotm}`)[0].values.map((x) => gameDto(x));
    },
    getRetrobits: () => {
      return db?.exec(`${getRetrobits}`)[0].values.map((x) => gameDto(x));
    },
    getRpgRunnerup: () => {
      return db?.exec(`${getRpgRunnerup}`)[0].values.map((x) => gameDto(x));
    },
    getRpgWinners: () => {
      return db?.exec(`${getWinningRpg}`)[0].values.map((x) => gameDto(x));
    },
    getNominationsByUserId: (user_id: number) => {
      return (
        db
          ?.exec(getNominationDataByUserId(user_id))
          .flatMap((x) => x.values)
          .flatMap(nominationListItemDto) || []
      );
    },
    getNominationsByGameId: (game_id: number) => {
      return (
        db
          ?.exec(getNominationsByGameId(game_id))
          .flatMap((x) => x.values)
          .flatMap(nominationListItemDto) || []
      );
    },
    getCompletionsByUserId: (user_id: number) => {
      return db
        ?.exec(getCompletionsByUserId(user_id))
        .flatMap((x) => x.values)
        .flatMap(completionsByUserIdDto);
    },
    mostCompletedGames: () => {
      return (
        db?.exec(mostCompletedGames)[0]?.values.map((x) => labeledStatDto(x)) ??
        []
      );
    },
    mostCompletedGotmGames: () => {
      return (
        db
          ?.exec(mostCompletedGotmGames)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    mostCompletedGotyGames: () => {
      return (
        db
          ?.exec(mostCompletedGotyGames)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    mostCompletedRetrobitGames: () => {
      return (
        db
          ?.exec(mostCompletedRetrobitGames)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    mostCompletedRetrobitYearGames: () => {
      return (
        db
          ?.exec(mostCompletedRetrobitYearGames)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    mostCompletedRpgGames: () => {
      return (
        db
          ?.exec(mostCompletedRpgGames)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    newestCompletions: () => {
      return (
        db?.exec(newestCompletions)[0]?.values.map((x) => labeledStatDto(x)) ??
        []
      );
    },
    newestRetrobitCompletions: () => {
      return (
        db
          ?.exec(newestRetrobitCompletions)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    newestGotmCompletions: () => {
      return (
        db
          ?.exec(newestGotmCompletions)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    newestRpgCompletions: () => {
      return (
        db
          ?.exec(newestRpgCompletions)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    newestGotyCompletions: () => {
      return (
        db
          ?.exec(newestGotyCompletions)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    newestGotwotyCompletions: () => {
      return (
        db
          ?.exec(newestGotwotyCompletions)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    totalNomsBeforeWinByGame: () => {
      return (
        db
          ?.exec(totalNomsBeforeWinByGame)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    avgNominationsBeforeWin: () => {
      return (
        db?.exec(avgNominationsBeforeWin)[0]?.values.map((x) => Number(x)) ?? []
      );
    },
    topNominationWinsByUser: () => {
      return (
        db
          ?.exec(topNominationWinsByUser)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    mostNominatedGames: () => {
      return (
        db?.exec(mostNominatedGames)[0]?.values.map((x) => labeledStatDto(x)) ??
        []
      );
    },
    mostNominatedLoserGames: () => {
      return (
        db
          ?.exec(mostNominatedLoserGames)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    avgTimeToBeatByMonth: () => {
      return (
        db
          ?.exec(avgTimeToBeatByMonth)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    totalTimeToBeatByMonth: () => {
      return (
        db
          ?.exec(totalTimeToBeatByMonth)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    longestMonthsByAvgTimeToBeat: () => {
      return (
        db
          ?.exec(longestMonthsByAvgTimeToBeat)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    shortestMonthsByAvgTimeToBeat: () => {
      return (
        db
          ?.exec(shortestMonthsByAvgTimeToBeat)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    mostNominatedGamesByUser: () => {
      return (
        db
          ?.exec(mostNominatedGamesByUser)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    completionsCountByGame: () => {
      return (
        db
          ?.exec(completionsCountByGame)[0]
          ?.values.map((x) => labeledStatDto(x)) ?? []
      );
    },
    getNominationSuccessPercentByUser: () => {
      return (
        db
          ?.exec(nominationSuccessPercentByUser)[0]
          .values.map((x) => userListItemDto(x)) ?? []
      );
    },
    getGameById: (id: number) => {
      return db?.exec(getGameById(id)).pop()?.values.map((x) => gameDto(x))[0] ?? null
    }
  };
};

export default initDbClient;
