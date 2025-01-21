import { createContext } from 'react';
import DbStore from './DbStore';
import SettingsStore from './SettingsStore';

export class RootStore {
  dbStore: DbStore = new DbStore(this);
  settingsStore = new SettingsStore(this);
}

const rootStore = new RootStore();
export default createContext(rootStore);
