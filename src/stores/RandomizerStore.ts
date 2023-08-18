import { action, computed, makeAutoObservable, observable } from 'mobx';
import { Game } from '../models/game';
import dbClient from '../data';
import { runInAction } from 'mobx';

interface GameCollection {
  gotmRunnerUp: Game[];
  gotmWinners: Game[];
  retrobits: Game[];
  rpgRunnerUp: Game[];
  rpgWinners: Game[];
}

class RandomizerStore {
  allGames: GameCollection = {
    gotmRunnerUp: [],
    gotmWinners: [],
    retrobits: [],
    rpgRunnerUp: [],
    rpgWinners: [],
  } as GameCollection;
  currentGameIndex = 0;
  includeGotmRunnerUp = true;
  includeGotmWinners = true;
  includeRetrobits = true;
  includeRpgRunnerUp = true;
  includeRpgWinners = true;
  ttbFilter: number[] = [0, Number.MAX_SAFE_INTEGER];
  emptyGame = {
    id: 0,
    title: {
      usa: '',
      eu: '',
      jap: '',
      world: '',
      other: '',
    },
    screenscraper_id: 0,
    img: '',
    year: 0,
    system: '',
    developer: '',
    genre: '',
    time_to_beat: 0,
  } as Game;

  constructor() {
    makeAutoObservable(this, {
      includeGotmRunnerUp: observable,
      includeGotmWinners: observable,
      includeRetrobits: observable,
      includeRpgRunnerUp: observable,
      includeRpgWinners: observable,
      ttbFilter: observable,
      currentGameIndex: observable,
      allGames: observable,

      filteredGamePool: computed,
      currentGame: computed,
      ttbMin: computed,
      ttbMax: computed,

      nextGame: action,
      setIncludeGotmRunnerUp: action,
      setIncludeGotmWinners: action,
      setIncludeRetrobits: action,
      setIncludeRpgRunnerUp: action,
      setIncludeRpgWinners: action,
      setTtbFilter: action,
      setAllGames: action,
    });

    const initialize = async () => {
      const gotmRunnerUp = (await dbClient.getGotmRunnerup()) || [];
      const gotmWinners = (await dbClient.getGotmWinners()) || [];
      const retrobits = (await dbClient.getRetrobits()) || [];
      const rpgRunnerUp = (await dbClient.getRpgRunnerup()) || [];
      const rpgWinners = (await dbClient.getRpgWinners()) || [];
      runInAction(() => {
        this.setAllGames({
          gotmRunnerUp,
          gotmWinners,
          retrobits,
          rpgRunnerUp,
          rpgWinners,
        });
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initialize();
  }

  shuffle(inputArray: Game[]): Game[] {
    const outputArray = [...inputArray];
    for (let i = outputArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [outputArray[i], outputArray[j]] = [outputArray[j], outputArray[i]];
    }
    return outputArray;
  }

  setAllGames(value: GameCollection) {
    this.allGames = value;
  }

  get filteredGamePool(): Game[] {
    let pool: Game[] = [];
    pool = this.includeGotmRunnerUp
      ? pool.concat(this.allGames.gotmRunnerUp)
      : pool;
    pool = this.includeGotmWinners
      ? pool.concat(this.allGames.gotmWinners)
      : pool;
    pool = this.includeRetrobits ? pool.concat(this.allGames.retrobits) : pool;
    pool = this.includeRpgRunnerUp
      ? pool.concat(this.allGames.rpgRunnerUp)
      : pool;
    pool = this.includeRpgWinners
      ? pool.concat(this.allGames.rpgWinners)
      : pool;
    pool = this.shuffle(pool);
    pool = pool.filter(
      (x) =>
        x.time_to_beat >= this.ttbFilter[0] &&
        x.time_to_beat <= this.ttbFilter[1],
    );
    return this.shuffle(pool);
  }

  get currentGame(): Game {
    if (this.filteredGamePool.length > 0) {
      return this.filteredGamePool[this.currentGameIndex];
    }
    return this.emptyGame;
  }

  get ttbMin(): number {
    const allList = [
      ...this.allGames.gotmRunnerUp,
      ...this.allGames.gotmWinners,
      ...this.allGames.retrobits,
      ...this.allGames.rpgRunnerUp,
      ...this.allGames.rpgWinners,
    ];
    if (allList.length > 0) {
      return allList
        .map((x) => x.time_to_beat)
        .filter((x) => !isNaN(x))
        .filter((x) => x > -1)
        .reduce(
          (aggregate, current) => Math.min(aggregate, Math.round(current)),
          Number.MAX_SAFE_INTEGER,
        );
    }
    return 0;
  }

  get ttbMax(): number {
    const allList = [
      ...this.allGames.gotmRunnerUp,
      ...this.allGames.gotmWinners,
      ...this.allGames.retrobits,
      ...this.allGames.rpgRunnerUp,
      ...this.allGames.rpgWinners,
    ];
    if (allList.length > 0) {
      return allList
        .map((x) => x.time_to_beat)
        .reduce((aggregate, current) => Math.max(aggregate, current), 0);
    }
    return Number.MAX_SAFE_INTEGER;
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

  setTtbFilter(value: number[]) {
    this.ttbFilter = value;
  }
}

export default RandomizerStore;
