import { createContext } from 'react';
import DatabaseStore from './DatabaseStore';
import RandomizerStore from './RandomizerStore';

export default createContext({
  databaseStore: new DatabaseStore(),
  randomizerStore: new RandomizerStore(),
});
