import { createContext } from 'react';
import DatabaseStore from './DatabaseStore';
import SettingsStore from './SettingsStore';

export default createContext({
  databaseStore: new DatabaseStore(),
  settingsStore: new SettingsStore(),
});
