import { action, makeAutoObservable, observable } from 'mobx';
import { Game } from '../models/game';
import dbClient from '../data';
import { runInAction } from 'mobx';

class DatabaseStore {
  gotmWinners: Game[] = [];
  gotmRunnerUp: Game[] = [];
  retrobits: Game[] = [];
  rpgWinners: Game[] = [];
  rpgRunnerUp: Game[] = [];

  constructor() {
    makeAutoObservable(this, {
      gotmWinners: observable,
      gotmRunnerUp: observable,
      retrobits: observable,
      rpgWinners: observable,
      rpgRunnerUp: observable,

      getGotmRunnerUp: action,
      getRetrobits: action,
      getRpgRunnerUp: action,
      getRpgWinners: action,
    });
  }

  async loadData() {
    await this.getGotmRunnerUp();
    await this.getGotmWinners();
    await this.getRetrobits();
    await this.getRpgRunnerUp();
    await this.getRpgWinners();
  }

  async getGotmRunnerUp() {
    if (this.gotmRunnerUp.length <= 0) {
      const result = await dbClient.getGotmRunnerup();
      runInAction(() => (this.gotmRunnerUp = result));
    }
  }

  async getGotmWinners() {
    if (this.gotmWinners.length <= 0) {
      const result = await dbClient.getGotmWinners();
      runInAction(() => (this.gotmWinners = result));
    }
  }

  async getRetrobits() {
    if (this.retrobits.length <= 0) {
      const result = await dbClient.getRetrobits();
      runInAction(() => (this.retrobits = result));
    }
  }

  async getRpgRunnerUp() {
    if (this.rpgRunnerUp.length <= 0) {
      const result = await dbClient.getRpgRunnerup();
      runInAction(() => (this.rpgRunnerUp = result));
    }
  }

  async getRpgWinners() {
    if (this.rpgWinners.length <= 0) {
      const result = await dbClient.getRpgWinners();
      runInAction(() => (this.rpgWinners = result));
    }
  }
}

export default DatabaseStore;
