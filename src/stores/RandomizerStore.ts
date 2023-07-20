import { action, computed, observable } from 'mobx';
import { makeAutoObservable } from 'mobx';
import { Game } from '../models/game';
import DatabaseStore from './DatabaseStore';

class RandomizerStore {
  includeGotmRunnerUp = true;
  includeGotmWinners = true;
  includeRetrobits = true;
  includeRpgRunnerUp = true;
  includeRpgWinners = true;
  ttbMax = Number.MAX_SAFE_INTEGER;
  ttbMin = 0;
  ttbFilter = [this.ttbMin, this.ttbMax];
  currentIndex = 0;

  private readonly databaseStore: DatabaseStore;
  constructor(databaseStore: DatabaseStore) {
    makeAutoObservable(this, {
      includeGotmRunnerUp: observable,
      includeGotmWinners: observable,
      includeRetrobits: observable,
      includeRpgRunnerUp: observable,
      includeRpgWinners: observable,
      ttbMax: observable,
      ttbMin: observable,
      ttbFilter: observable,
      currentIndex: observable,
      gamePool: computed,
      filteredGamePool: computed,

      setIncludeGotmRunnerUp: action,
      setIncludeGotmWinners: action,
      setIncludeRetrobits: action,
      setIncludeRpgRunnerUp: action,
      setIncludeRpgWinners: action,
      setTtbMax: action,
      setTtbMin: action,
      setTtbFilter: action,
      nextGame: action,
    });
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
  }

  setTtbMin(value: number) {
    this.ttbMin = value;
  }

  setTtbFilter(value: number[]) {
    this.ttbFilter = value;
  }

  nextGame() {
    this.currentIndex = (this.currentIndex + 1) % this.filteredGamePool.length;
  }

  get gamePool(): Game[] {
    let gamePool = [];

    gamePool = this.includeGotmRunnerUp
      ? gamePool.concat(this.databaseStore.gotmRunnerUp)
      : gamePool;
    gamePool = this.includeGotmRunnerUp
      ? gamePool.concat(this.databaseStore.gotmWinners)
      : gamePool;
    gamePool = this.includeGotmRunnerUp
      ? gamePool.concat(this.databaseStore.retrobits)
      : gamePool;
    gamePool = this.includeGotmRunnerUp
      ? gamePool.concat(this.databaseStore.rpgRunnerUp)
      : gamePool;
    gamePool = this.includeGotmRunnerUp
      ? gamePool.concat(this.databaseStore.rpgWinners)
      : gamePool;

    return gamePool;
  }

  get filteredGamePool(): Game[] {
    return this.gamePool.filter(
      (x) =>
        x.time_to_beat <= this.ttbFilter[0] &&
        x.time_to_beat >= this.ttbFilter[1]
    );
  }
}

export default RandomizerStore;
