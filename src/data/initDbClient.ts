import initSqlJs = require('sql.js');
import { Database } from 'sql.js';

import {
  creationCommand,
  getGotmRunnerup,
  getRetrobits,
  getRpgRunnerup,
  getWinningGotm,
  getWinningRpg,
} from '../data/DbCommands';
import { Game, gameDto, GameType, retrobitsGameDto } from '../models/game';

const initDbClient = () => {
  let SQL: initSqlJs.SqlJsStatic;
  let db: Database;

  const initDB = async () => {
    try {
      SQL = await initSqlJs({
        locateFile: (file) =>
          `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm`,
      });
      db = new SQL.Database();
      db.run(creationCommand);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    getGotmRunnerup: async () => {
      if (!db) {
        await initDB();
      }
      return db
        .exec(`${getGotmRunnerup}`)[0]
        .values.map((x) => gameDto(x, GameType.gotm));
    },
    getGotmWinners: async () => {
      if (!db) {
        await initDB();
      }
      return db
        .exec(`${getWinningGotm}`)[0]
        .values.map((x) => gameDto(x, GameType.gotm));
    },
    getRetrobits: async () => {
      if (!db) {
        await initDB();
      }
      return db
        .exec(`${getRetrobits}`)[0]
        .values.map((x) => retrobitsGameDto(x));
    },
    getRpgRunnerup: async () => {
      if (!db) {
        await initDB();
      }
      return db
        .exec(`${getRpgRunnerup}`)[0]
        .values.map((x) => gameDto(x, GameType.rpg));
    },
    getRpgWinners: async () => {
      if (!db) {
        await initDB();
      }
      return db
        .exec(`${getWinningRpg}`)[0]
        .values.map((x) => gameDto(x, GameType.rpg));
    },
  };
};

export default initDbClient;
