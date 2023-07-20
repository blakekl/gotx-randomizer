import { action, observable } from 'mobx';
import { makeAutoObservable } from 'mobx';

class SettingsStore {
  includeGotmRunnerUp = true;
  includeGotmWinners = true;
  includeRetrobits = true;
  includeRpgRunnerUp = true;
  includeRpgWinners = true;
  ttbMax = Number.MAX_SAFE_INTEGER;
  ttbMin = 0;
  ttbFilter = [this.ttbMin, this.ttbMax];

  constructor() {
    makeAutoObservable(this, {
      includeGotmRunnerUp: observable,
      includeGotmWinners: observable,
      includeRetrobits: observable,
      includeRpgRunnerUp: observable,
      includeRpgWinners: observable,
      ttbMax: observable,
      ttbMin: observable,
      ttbFilter: observable,

      setIncludeGotmRunnerUp: action,
      setIncludeGotmWinners: action,
      setIncludeRetrobits: action,
      setIncludeRpgRunnerUp: action,
      setIncludeRpgWinners: action,
      setTtbMax: action,
      setTtbMin: action,
      setTtbFilter: action,
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
}

export default SettingsStore;
