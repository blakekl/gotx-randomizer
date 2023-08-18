import { createContext } from 'react';
import RandomizerStore from './RandomizerStore';

// eslint-disable-next-line react-refresh/only-export-components
export default createContext({
  randomizerStore: new RandomizerStore(),
});
