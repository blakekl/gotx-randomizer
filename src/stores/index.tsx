import { createContext } from 'react';
import DatabaseStore from './DatabaseStore';

export default createContext({
  databaseStore: new DatabaseStore(),
});
