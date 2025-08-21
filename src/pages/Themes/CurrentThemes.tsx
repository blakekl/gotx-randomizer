import { useMemo } from 'react';
import { useStores } from '../../stores/useStores';
import { observer } from 'mobx-react-lite';
import { getBestGameTitle } from '../../models/game';

const CurrentThemes = observer(() => {
  const { dbStore } = useStores();

  // Get current active themes with winners
  const currentThemes = useMemo(() => {
    const themes = dbStore.getCurrentWinners();

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
        {currentThemes.map((currentTheme, index) => (
          <div
            key={`${currentTheme.theme.id}-${index}`}
            className="column is-one-third"
          >
            <div
              className="card is-flex is-flex-direction-column"
              style={{ height: '100%' }}
            >
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
              <div className="card-content is-flex-grow-1">
                <div className="content">
                  <h4 className="title is-5 mb-3">
                    {currentTheme.theme.title || 'Current Theme'}
                  </h4>

                  <div className="field is-grouped is-grouped-multiline mb-4">
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
                          {String(currentTheme.theme.nominationCount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Winners Section */}
                  <div className="winners-section">
                    {currentTheme.winners && currentTheme.winners.length > 0 ? (
                      <div>
                        <h5 className="title is-6 mb-2">
                          <span className="icon mr-1">
                            <i className="fas fa-medal"></i>
                          </span>
                          Winner{currentTheme.winners.length > 1 ? 's' : ''}
                          {currentTheme.isMultiWinner && (
                            <span className="tag is-small is-warning ml-2">
                              Multi-Winner
                            </span>
                          )}
                        </h5>
                        <div className="content">
                          {currentTheme.winners.map((winner, winnerIndex) => (
                            <div key={winnerIndex} className="mb-2">
                              <strong>{getBestGameTitle(winner)}</strong>
                              {winner.year && (
                                <span className="tag is-small is-light ml-2">
                                  {String(winner.year)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="notification is-light is-small">
                        <span className="icon mr-2">
                          <i className="fas fa-clock"></i>
                        </span>
                        Winners not yet announced
                      </div>
                    )}
                  </div>
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
