import initSqlJs from 'sql.js';
import { Database } from 'sql.js';

import {
  getGotmRunnerup,
  getRetrobits,
  getRpgRunnerup,
  getWinningGotm,
  getWinningRpg,
} from '../data/Queries';
import { gameDto, GameType, retrobitsGameDto } from '../models/game';
import { initialize } from './DbInitialize';

const initDbClient = () => {
  let SQL: initSqlJs.SqlJsStatic;
  let db: Database | null;

  const getDb = async () => {
    if (db){
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
    }
    return db;
  };

  return {
    getGotmRunnerup: async () => {
      const db = await getDb();
      return db?.exec(`${getGotmRunnerup}`)[0]
        .values.map((x) => gameDto(x, GameType.gotm));
    },
    getGotmWinners: async () => {
      const db = await getDb();
      return db?.exec(`${getWinningGotm}`)[0]
        .values.map((x) => gameDto(x, GameType.gotm));
    },
    getRetrobits: async () => {
        const db = await getDb();
      return db?.exec(`${getRetrobits}`)[0]
        .values.map((x) => retrobitsGameDto(x));
    },
    getRpgRunnerup: async () => {
        const db = await getDb();
      return db?.exec(`${getRpgRunnerup}`)[0]
        .values.map((x) => gameDto(x, GameType.rpg));
    },
    getRpgWinners: async () => {
        const db = await getDb();
      return db?.exec(`${getWinningRpg}`)[0]
        .values.map((x) => gameDto(x, GameType.rpg));
    },
  };
};

export default initDbClient;
