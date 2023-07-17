import { useEffect, useState } from 'react';
import initSqlJs = require('sql.js');
import {
  creationCommand,
  getGotmRunnerup,
  getWinningGotm,
} from '../data/DbCommands';
import { Game, gameDto, Nomination, Nominator } from '../models/game';

export const useData = () => {
  const [isDbReady, setIsDbReady] = useState(false);
  const [db, setDb] = useState(null);
  const [nominators, setNominators] = useState(new Array<Nominator>());
  const [nominations, setNominations] = useState(new Array<Nomination>());
  const [gotmWinners, setGotmWinners] = useState(new Array<Game>());
  const [gotmRunnerUp, setGotmRunnerUp] = useState(new Array<Game>());
  const [retrobits, setRetrobits] = useState(new Array<Game>());
  const [rpgWinners, setRpgWinners] = useState(new Array<Game>());
  const [rpgRunnerUp, setRpgRunnerUp] = useState(new Array<Game>());

  const setupDatabase = async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: (file) =>
          `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm`,
      });
      const db = new SQL.Database();
      setDb(db);
      db.run(creationCommand);
      const result = db.exec(`${getGotmRunnerup} ${getWinningGotm}`);
      const gotmRunnerup = result[0].values.map((x) => gameDto(x));
      const gotWinners = result[1].values.map((x) => gameDto(x));
      console.log(gotmRunnerup);
      setGotmRunnerUp(gotmRunnerup);
      setGotmWinners(gotWinners);
      setIsDbReady(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setupDatabase();
  }, []);

  return {
    isDbReady,
    nominators,
    nominations,
    gotmWinners,
    gotmRunnerUp,
    retrobits,
    rpgWinners,
    rpgRunnerUp,
  };
};
