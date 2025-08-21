import { useMemo } from 'react';
import { useStores } from '../../stores/useStores';
import { observer } from 'mobx-react-lite';

const CurrentThemes = observer(() => {
  const { dbStore } = useStores();

  // Get current active themes with winners
  const currentThemes = useMemo(() => {
    return dbStore.getCurrentWinners();
  }, [dbStore]);

  const getThemeTypeDisplay = (type: string) => {
    switch (type) {
      case 'gotm':
        return 'Game of the Month';
      case 'goty':
        return 'Game of the Year';
      case 'retrobit':
        return 'Retrobit';
      case 'rpg':
        return 'RPG';
      case 'gotwoty':
        return 'Game of the Week of the Year';
      default:
        return type;
    }
  };

  const getThemeIcon = (type: string) => {
    switch (type) {
      case 'gotm':
        return 'fas fa-trophy';
      case 'goty':
        return 'fas fa-crown';
      case 'retrobit':
        return 'fas fa-gamepad';
      case 'rpg':
        return 'fas fa-dragon';
      case 'gotwoty':
        return 'fas fa-calendar-week';
      default:
        return 'fas fa-star';
    }
  };

  if (currentThemes.length === 0) {
    return (
      <div className="notification is-info">
        <p className="has-text-centered">
          <span className="icon is-large">
            <i className="fas fa-info-circle fa-2x"></i>
          </span>
        </p>
        <p className="has-text-centered">
          No active themes at the moment. Check back soon for new themes!
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="title is-3">Current Themes</h2>
      <div className="columns is-multiline">
        {currentThemes.map((currentTheme) => (
          <div key={currentTheme.theme.id} className="column is-one-third">
            <div className="card">
              <div className="card-header">
                <div className="card-header-title">
                  <span className="icon mr-2">
                    <i
                      className={getThemeIcon(currentTheme.nominationType)}
                    ></i>
                  </span>
                  {getThemeTypeDisplay(currentTheme.nominationType)}
                </div>
              </div>
              <div className="card-content">
                <div className="content">
                  <h4 className="title is-5 mb-2">
                    {currentTheme.theme.title || 'Current Theme'}
                  </h4>

                  {currentTheme.theme.description && (
                    <p className="mb-3">{currentTheme.theme.description}</p>
                  )}

                  <div className="field is-grouped is-grouped-multiline">
                    <div className="control">
                      <div className="tags has-addons">
                        <span className="tag is-dark">Date</span>
                        <span className="tag is-primary">
                          {currentTheme.theme.creation_date
                            ? new Date(
                                currentTheme.theme.creation_date,
                              ).toLocaleDateString()
                            : 'TBD'}
                        </span>
                      </div>
                    </div>
                    <div className="control">
                      <div className="tags has-addons">
                        <span className="tag is-dark">Nominations</span>
                        <span className="tag is-info">
                          {String(currentTheme.theme.nomination_count || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Winners Section */}
                  {currentTheme.winners && currentTheme.winners.length > 0 && (
                    <div className="mt-4">
                      <h5 className="title is-6 mb-2">
                        <span className="icon mr-1">
                          <i className="fas fa-medal"></i>
                        </span>
                        Winners
                        {currentTheme.isMultiWinner && (
                          <span className="tag is-small is-warning ml-2">
                            Multi-Winner
                          </span>
                        )}
                      </h5>
                      <div className="content">
                        {currentTheme.winners.map((winner, index) => (
                          <div key={index} className="mb-2">
                            <strong>{winner.title_usa}</strong>
                            {winner.year && (
                              <span className="tag is-small is-light ml-2">
                                {String(winner.year)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Winners Yet */}
                  {(!currentTheme.winners ||
                    currentTheme.winners.length === 0) && (
                    <div className="notification is-light is-small">
                      <span className="icon mr-2">
                        <i className="fas fa-clock"></i>
                      </span>
                      Winners not yet announced
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <a
                  href={`/themes/${String(currentTheme.theme.id)}`}
                  className="card-footer-item"
                >
                  <span className="icon mr-1">
                    <i className="fas fa-eye"></i>
                  </span>
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CurrentThemes;
