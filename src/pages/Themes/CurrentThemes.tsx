import { useMemo } from 'react';
import { useStores } from '../../stores/useStores';
import { observer } from 'mobx-react-lite';
import { useThemeOrdering } from './hooks/useThemeOrdering';
import CurrentThemeCard from './CurrentThemeCard/CurrentThemeCard';

const CurrentThemes = observer(() => {
  const { dbStore } = useStores();

  // Get current active themes with winners
  const rawThemes = useMemo(() => {
    return dbStore.getCurrentWinners();
  }, [dbStore]);

  // Use shared ordering logic
  const currentThemes = useThemeOrdering(rawThemes);

  if (currentThemes.length === 0) {
    return (
      <div className="notification is-info">
        <div className="content has-text-centered">
          <p className="title is-4">
            <span className="icon mr-2">
              <i className="fas fa-info-circle"></i>
            </span>
            No Active Themes
          </p>
          <p>No active themes at the moment. Check back soon for new themes!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="title is-3">Current GotX Games</h2>
      <div className="columns is-multiline">
        {currentThemes.map((currentTheme, index) => (
          <CurrentThemeCard key={index} currentTheme={currentTheme} />
        ))}
      </div>
    </div>
  );
});

export default CurrentThemes;
