import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import initSqlJs = require('sql.js');
import {
  creationCommand,
  getGotmRunnerup,
  getRetrobits,
  getRpgRunnerup,
  getWinningGotm,
  getWinningRpg,
} from '../data/DbCommands';
import { Game, gameDto, GameType, retrobitsGameDto } from '../models/game';

class DatabaseStore {
  isLoading = true;
  gotmWinners: Array<Game> = [];
  gotmRunnerUp: Array<Game> = [];
  retrobits: Array<Game> = [];
  rpgWinners: Array<Game> = [];
  rpgRunnerUp: Array<Game> = [];

  constructor() {
    makeAutoObservable(this, {
      isLoading: observable,
      gotmWinners: observable,
      gotmRunnerUp: observable,
      retrobits: observable,
      rpgWinners: observable,
      rpgRunnerUp: observable,

      setupDatabase: action,
      setIsLoading: action,
      setGotmRunnerUp: action,
      setRetrobits: action,
      setRpgRunnerUp: action,
      setRpgWinners: action,
    });

    runInAction(() => this.setupDatabase());
  }

  setIsLoading(isLoading = true) {
    this.isLoading = isLoading;
  }

  async setupDatabase() {
    try {
      const SQL = await initSqlJs({
        locateFile: (file) =>
          `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm`,
      });
      const db = new SQL.Database();
      db.run(creationCommand);
      const result = db.exec(
        `${getGotmRunnerup} ${getWinningGotm} ${getRetrobits} ${getRpgRunnerup} ${getWinningRpg}`
      );
      this.setGotmRunnerUp(
        result[0].values.map((x) => gameDto(x, GameType.gotm))
      );
      this.setGotmWinners(
        result[1].values.map((x) => gameDto(x, GameType.gotm))
      );
      this.setRetrobits(result[2].values.map((x) => retrobitsGameDto(x)));
      this.setRpgRunnerUp(
        result[3].values.map((x) => gameDto(x, GameType.rpg))
      );
      this.setRpgWinners(result[4].values.map((x) => gameDto(x, GameType.rpg)));

      this.setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  setGotmRunnerUp(values: Game[]) {
    this.gotmRunnerUp = values;
  }

  setGotmWinners(values: Game[]) {
    this.gotmWinners = values;
  }

  setRetrobits(values: Game[]) {
    this.retrobits = values;
  }

  setRpgRunnerUp(values: Game[]) {
    this.rpgRunnerUp = values;
  }

  setRpgWinners(values: Game[]) {
    this.rpgWinners = values;
  }
}

export default DatabaseStore;
