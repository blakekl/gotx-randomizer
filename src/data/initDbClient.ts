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
import { gameDto, nominationDataDto } from '../models/game';
import { initialize } from './DbInitialize';

const initDbClient = async () => {
  let SQL: initSqlJs.SqlJsStatic;
  let db: Database | null;
  try {
    SQL = await initSqlJs({
      locateFile: (file) =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
    });
    db = new SQL.Database();
    db.run(initialize);
  } catch (e) {
    console.error(e);
  }

  return {
    getGotmRunnerup: () => {
      return db
        ?.exec(`${getGotmRunnerup}`)[0]
        .values.map((x) => gameDto(x));
    },
    getGotmWinners: () => {
      return db
        ?.exec(`${getWinningGotm}`)[0]
        .values.map((x) => gameDto(x));
    },
    getRetrobits: () => {
      return db
        ?.exec(`${getRetrobits}`)[0]
        .values.map((x) => gameDto(x));
    },
    getRpgRunnerup: () => {
      return db
        ?.exec(`${getRpgRunnerup}`)[0]
        .values.map((x) => gameDto(x));
    },
    getRpgWinners: () => {
      return db
        ?.exec(`${getWinningRpg}`)[0]
        .values.map((x) => gameDto(x));
    },
    getNominationData: (game_id: number) => {
      const result = db?.exec(`${getNominationData(game_id)}`)[0];
      return result?.values.map(x => nominationDataDto(x)) || [];
    }
  };
};

export default initDbClient;
