import { useMemo, useState } from 'react';
import { ThemeWithStatus } from '../../../models/game';

type ThemeTypeFilter = 'All' | 'GotM' | 'Retrobit' | 'RPG' | 'GotY';

export const useThemeFiltering = (allThemes: ThemeWithStatus[]) => {
  const [titleFilter, setTitleFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<ThemeTypeFilter>('All');

  const filteredThemes = useMemo(() => {
    let filtered = allThemes.filter((theme) =>
      theme.title?.toLowerCase().includes(titleFilter.toLowerCase()),
    );

    // Apply type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter((theme) => {
        switch (typeFilter) {
          case 'GotM':
            return String(theme.nomination_type) === 'gotm';
          case 'Retrobit':
            return String(theme.nomination_type) === 'retro';
          case 'RPG':
            return String(theme.nomination_type) === 'rpg';
          case 'GotY':
            return (
              String(theme.nomination_type) === 'goty' ||
              String(theme.nomination_type) === 'gotwoty'
            );
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [allThemes, titleFilter, typeFilter]);

  return {
    titleFilter,
    setTitleFilter,
    typeFilter,
    setTypeFilter,
    filteredThemes,
  };
};
