import { action, computed, observable } from 'mobx';
import { makeAutoObservable } from 'mobx';
import { Game } from '../models/game';
import dbClient from '../data';
import { runInAction } from 'mobx';

class RandomizerStore {
  gamePool: Game[] = [];
  currentGameIndex = 0;
  includeGotmRunnerUp = true;
  includeGotmWinners = true;
  includeRetrobits = true;
  includeRpgRunnerUp = true;
  includeRpgWinners = true;
  ttbMax = Number.MAX_SAFE_INTEGER;
  ttbMin = 0;
  ttbFilter: number[] = [this.ttbMin, this.ttbMax];

  constructor() {
    makeAutoObservable(this, {
      includeGotmRunnerUp: observable,
      includeGotmWinners: observable,
      includeRetrobits: observable,
      includeRpgRunnerUp: observable,
      includeRpgWinners: observable,
      ttbFilter: observable,
      ttbMax: observable,
      ttbMin: observable,
      currentGameIndex: observable,
      gamePool: observable,

      filteredGamePool: computed,
      currentGame: computed,

      nextGame: action,
      setIncludeGotmRunnerUp: action,
      setIncludeGotmWinners: action,
      setIncludeRetrobits: action,
      setIncludeRpgRunnerUp: action,
      setIncludeRpgWinners: action,
      setTtbFilter: action,
      setTtbMax: action,
      setTtbMin: action,
      setGamePool: action,
    });

    (async () => {
      const gotmRunnerUp = await dbClient.getGotmRunnerup();
      const gotmWinners = await dbClient.getGotmWinners();
      const retrobits = await dbClient.getRetrobits();
      const rpgRunnerUp = await dbClient.getRpgRunnerup();
      const rpgWinners = await dbClient.getRpgRunnerup();
      runInAction(() =>
        this.setGamePool([
          ...gotmRunnerUp,
          ...gotmWinners,
          ...retrobits,
          ...rpgRunnerUp,
          ...rpgWinners,
        ])
      );
    })();
  }

  setGamePool(value: Game[]) {
    this.gamePool = value;
  }

  get filteredGamePool(): Game[] {
    if (
      this.ttbFilter[0] === this.ttbMin &&
      this.ttbFilter[1] === this.ttbMax
    ) {
      return this.gamePool;
    } else {
      return this.gamePool.filter(
        (x) =>
          x.time_to_beat >= this.ttbFilter[0] &&
          x.time_to_beat <= this.ttbFilter[1]
      );
    }
  }

  get currentGame(): Game {
    return this.filteredGamePool[this.currentGameIndex];
  }

  nextGame() {
    this.currentGameIndex =
      (this.currentGameIndex + 1) % this.filteredGamePool.length;
  }

  setIncludeGotmRunnerUp(value: boolean) {
    this.includeGotmRunnerUp = value;
  }

  setIncludeGotmWinners(value: boolean) {
    this.includeGotmWinners = value;
  }

  setIncludeRetrobits(value: boolean) {
    this.includeRetrobits = value;
  }

  setIncludeRpgRunnerUp(value: boolean) {
    this.includeRpgRunnerUp = value;
  }

  setIncludeRpgWinners(value: boolean) {
    this.includeRpgWinners = value;
  }

  setTtbMax(value: number) {
    this.ttbMax = value;
    if (this.ttbFilter[1] > this.ttbMax) {
      this.setTtbFilter([this.ttbFilter[0], this.ttbMax]);
    }
  }

  setTtbMin(value: number) {
    this.ttbMin = value;
    if (this.ttbFilter[0] < this.ttbMin) {
      this.setTtbFilter([this.ttbMin, this.ttbFilter[1]]);
    }
  }

  setTtbFilter(value: number[]) {
    this.ttbFilter = value;
  }
}

export default RandomizerStore;
