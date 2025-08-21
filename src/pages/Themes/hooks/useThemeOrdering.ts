import { useMemo } from 'react';
import { CurrentTheme } from '../../../models/game';

export const useThemeOrdering = (themes: CurrentTheme[]) => {
  return useMemo(() => {
    // Sort themes in desired order: gotm, retro, rpg, goty, gotwoty
    const typeOrder = ['gotm', 'retro', 'rpg', 'goty', 'gotwoty'];

    return themes.sort((a, b) => {
      const aIndex = typeOrder.indexOf(a.nominationType);
      const bIndex = typeOrder.indexOf(b.nominationType);

      // If type not found in order, put it at the end
      const aOrder = aIndex === -1 ? 999 : aIndex;
      const bOrder = bIndex === -1 ? 999 : bIndex;

      return aOrder - bOrder;
    });
  }, [themes]);
};
