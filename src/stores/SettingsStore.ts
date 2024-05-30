import { action, makeAutoObservable, observable } from 'mobx';

class SettingsStore {
  hltbFilter = [0, Number.MAX_SAFE_INTEGER];
  hltbMax = Number.MAX_SAFE_INTEGER;
  hltbMin = 0;
  hiddenGames: number[] = [];
  includeGotmRunnerUp = true;
  includeGotmWinners = true;
  includeHiddenGames = false;
  includeRetrobits = true;
  includeRpgRunnerUp = true;
  includeRpgWinners = true;

  private readonly HIDDEN_KEY = 'completed';

  constructor() {
    makeAutoObservable(this, {
      hiddenGames: observable,
      hltbFilter: observable,
      hltbMax: observable,
      hltbMin: observable,
      includeGotmRunnerUp: observable,
      includeGotmWinners: observable,
      includeHiddenGames: observable,
      includeRetrobits: observable,
      includeRpgRunnerUp: observable,
      includeRpgWinners: observable,

      toggleGotmRunnerUp: action,
      toggleGotmWinners: action,
      toggleHiddenGame: action,
      toggleHiddenGames: action,
      toggleRetrobits: action,
      toggleRpgRunnerUp: action,
      toggleRpgWinners: action,
      setHltbFilter: action,
      setHltbMax: action,
      setHltbMin: action,
    });
    this.hiddenGames = JSON.parse(
      localStorage?.getItem(this.HIDDEN_KEY) || '[]',
    ) as number[];
  }

  setHltbFilter = (filter: number[]) => {
    if (filter[0] >= this.hltbMin && filter[1] <= this.hltbMax) {
      this.hltbFilter = filter;
    }
  };

  setHltbMax = (max: number) => {
    this.hltbMax = max;
    if (this.hltbFilter[1] > max) {
      this.hltbFilter[1] = max;
    }
  };

  setHltbMin = (min: number) => {
    this.hltbMin = min;
    if (this.hltbFilter[0] < min) {
      this.hltbFilter[0] = min;
    }
  };

  toggleGotmRunnerUp = () => {
    this.includeGotmRunnerUp = !this.includeGotmRunnerUp;
  };

  toggleGotmWinners = () => {
    this.includeGotmWinners = !this.includeGotmWinners;
  };

  toggleHiddenGame = (id: number) => {
    if (this.hiddenGames.includes(id)) {
      this.hiddenGames = this.hiddenGames.filter((x) => x !== id);
    } else {
      this.hiddenGames = [...this.hiddenGames, id];
    }
    localStorage?.setItem(this.HIDDEN_KEY, JSON.stringify(this.hiddenGames));
  };

  toggleHiddenGames = () => {
    this.includeHiddenGames = !this.includeHiddenGames;
  };

  toggleRetrobits = () => {
    this.includeRetrobits = !this.includeRetrobits;
  };

  toggleRpgRunnerUp = () => {
    this.includeRpgRunnerUp = !this.includeRpgRunnerUp;
  };

  toggleRpgWinners = () => {
    this.includeRpgWinners = !this.includeRpgWinners;
  };
}

export default SettingsStore;
