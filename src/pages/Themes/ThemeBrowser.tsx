import { useMemo, useState } from 'react';
import { useStores } from '../../stores/useStores';
import { ThemeWithStatus } from '../../models/game';
import Pagination from '../../components/Pagination';
import { observer } from 'mobx-react-lite';
import { useThemeFiltering } from './hooks/useThemeFiltering';
import ThemeFilterControls from './components/ThemeFilterControls';
import ThemeTable from './components/ThemeTable';
import ThemeDetailModal from './components/ThemeDetailModal';

const ThemeBrowser = observer(() => {
  const { dbStore } = useStores();
  const [indexRange, setIndexRange] = useState([0, 0]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeWithStatus | null>(
    null,
  );
  const [hovered, setHovered] = useState(0);

  // Get themes with status (excluding upcoming themes for privacy)
  const allThemes = useMemo(() => {
    return dbStore.getThemesWithStatus();
  }, [dbStore]);

  // Use shared filtering logic
  const {
    titleFilter,
    setTitleFilter,
    typeFilter,
    setTypeFilter,
    filteredThemes,
  } = useThemeFiltering(allThemes);

  const handleRowClicked = (theme: ThemeWithStatus) => {
    setSelectedTheme(theme);
  };

  const handleThemeHover = (themeId: number) => {
    setHovered(themeId);
  };

  const handleThemeLeave = () => {
    setHovered(0);
  };

  const handleCloseModal = () => {
    setSelectedTheme(null);
  };

  return (
    <div className="mt-6">
      <h2 className="title is-3">Theme History</h2>

      <ThemeFilterControls
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        titleFilter={titleFilter}
        onTitleFilterChange={setTitleFilter}
      />

      <ThemeTable
        themes={filteredThemes}
        indexRange={indexRange}
        selectedTheme={selectedTheme}
        hoveredTheme={hovered}
        onThemeClick={handleRowClicked}
        onThemeHover={handleThemeHover}
        onThemeLeave={handleThemeLeave}
      />

      <Pagination count={filteredThemes.length} onPageChange={setIndexRange} />

      <ThemeDetailModal theme={selectedTheme} onClose={handleCloseModal} />
    </div>
  );
});

export default ThemeBrowser;
