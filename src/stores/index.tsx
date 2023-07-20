import { createContext } from 'react';
import DatabaseStore from './DatabaseStore';
import RandomizerStore from './RandomizerStore';

const databaseStore = new DatabaseStore();
export default createContext({
  databaseStore,
  settingsStore: new RandomizerStore(databaseStore),
});
