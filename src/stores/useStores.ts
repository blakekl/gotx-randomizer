import { useContext } from 'react';

import rootStoreContext from './RootStore';

export const useStores = () => useContext(rootStoreContext);
