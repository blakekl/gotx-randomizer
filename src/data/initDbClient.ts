import initSqlJs from 'sql.js';
import { Database } from 'sql.js';

import {
  getGotmRunnerup,
  getNominationData,
  getRetrobits,
  getRpgRunnerup,
  getWinningGotm,
  getWinningRpg,
} from '../data/Queries';
import {
  NominationType,
  convertDate,
  gameDto,
  userNominationDto,
} from '../models/game';
import {
  createTables,
  insertCompletions,
  insertGames,
  insertNominations,
  insertThemes,
  insertUsers,
} from './DbInitialize';

const initDbClient = async () => {
  let SQL: initSqlJs.SqlJsStatic;
  let db: Database | null;

  try {
    SQL = await initSqlJs({
      locateFile: (file) =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
    });
    db = new SQL.Database();
    db.run(createTables);
    db.run(insertGames);
    db.run(insertUsers);
    db.run(insertThemes);
    db.run(insertNominations);
    db.run(insertCompletions);
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
    getNominationData: (game_id: number) => {
      const nominations =
        db
          ?.exec(getNominationData)
          .flatMap((x) => x.values)
          .flatMap(userNominationDto) || [];
      const gameNoms = nominations.filter((x) => x.game_id === game_id);
      const retrobitIndexes = nominations
        .filter((x) => x.nomination_type === NominationType.retrobit)
        .reduce((aggregate, current, index) => {
          if (current.game_id === game_id) {
            aggregate.push(index);
            return [...aggregate, index];
          }
          return aggregate;
        }, new Array<number>());

      const rpgIndexes = nominations
        .filter((x) => x.nomination_type === NominationType.rpg)
        .reduce((aggregate, current, index) => {
          if (current.game_id === game_id) {
            aggregate.push(index);
            return [...aggregate, index];
          }
          return aggregate;
        }, new Array<number>());

      gameNoms.map((x) => {
        if (x.nomination_type === NominationType.gotm) {
          return x;
        } else if (x.nomination_type === NominationType.retrobit) {
          return;
        }
      });
      return gameNoms.map((x) => {
        switch (x.nomination_type) {
          case NominationType.retrobit:
            return convertDate(x, retrobitIndexes.shift() || 0);
          case NominationType.rpg:
            return convertDate(x, rpgIndexes.shift() || 0);
          default:
            return x;
        }
      });
    },
  };
};

export default initDbClient;
