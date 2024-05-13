import { createContext } from 'react';
import SettingsStore from './SettingsStore';
import DbStore from './DbStore';

// eslint-disable-next-line react-refresh/only-export-components
export default createContext({
  dbStore: new DbStore(),
  settingsStore: new SettingsStore(),
});
