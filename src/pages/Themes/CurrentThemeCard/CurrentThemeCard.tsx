import {
  CurrentTheme,
  getBestGameTitle,
  getThemeTypeDisplay,
  getThemeIcon,
} from '../../../models/game';

interface CurrentThemeCardProps {
  currentTheme: CurrentTheme;
}

const CurrentThemeCard = ({ currentTheme }: CurrentThemeCardProps) => {
  return (
    <div className="column is-one-third">
      <div
        className="card is-flex is-flex-direction-column"
        style={{ height: '100%' }}
      >
        <div className="card-header">
          <div className="card-header-title">
            <span className="icon mr-2">
              <i className={getThemeIcon(currentTheme.nominationType)}></i>
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
                <span className="tag is-primary">
                  Date:{' '}
                  {currentTheme.theme.creation_date
                    ? new Date(
                        currentTheme.theme.creation_date,
                      ).toLocaleDateString()
                    : 'TBD'}
                </span>
              </div>
              <div className="control">
                <span className="tag is-primary">
                  Nominations: {String(currentTheme.theme.nominationCount || 0)}
                </span>
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
                  </h5>
                  <div className="content">
                    {currentTheme.winners
                      .sort((a, b) => (a.year || 0) - (b.year || 0)) // Sort by year, oldest to newest
                      .map((winner, winnerIndex) => (
                        <div key={winnerIndex} className="mb-2">
                          <strong>{getBestGameTitle(winner)}</strong>
                          {winner.year && (
                            <span className="tag is-small is-primary ml-2">
                              {String(winner.year)}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="has-text-grey">
                  <span className="icon mr-2">
                    <i className="fas fa-clock"></i>
                  </span>
                  Winners not yet announced
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentThemeCard;
