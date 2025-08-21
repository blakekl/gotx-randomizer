import { Navigate, useParams } from 'react-router-dom';
import { useStores } from '../../../stores/useStores';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import {
  getThemeTypeDisplay,
  getThemeIcon,
  getBestGameTitle,
} from '../../../models/game';

const ThemeDetail = observer(() => {
  const { themeId } = useParams();
  const { dbStore } = useStores();

  const themeData = useMemo(() => {
    if (!themeId) return null;
    return dbStore.getThemeDetailWithCategories(Number(themeId));
  }, [dbStore, themeId]);

  if (!themeId || !themeData || !themeData.theme) {
    return <Navigate to={'/404'} />;
  }

  const { theme, nominations } = themeData;

  // Group nominations by winner status and year category
  const winners = nominations.filter((nom) => nom.winner);
  const nonWinners = nominations.filter((nom) => !nom.winner);

  // Group winners by year category for GotM themes
  const winnersByCategory = winners.reduce<Record<string, typeof winners>>(
    (acc, winner) => {
      const category = String(winner.year_category || 'Unknown');
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(winner);
      return acc;
    },
    {},
  );

  return (
    <div className="container">
      <div className="section">
        {/* Theme Header */}
        <div className="box">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <div>
                  <h1 className="title is-2 mb-2">
                    <span className="icon mr-3">
                      <i className={getThemeIcon(theme.nomination_type)}></i>
                    </span>
                    {theme.title || 'Upcoming Theme'}
                  </h1>
                  <p className="subtitle is-4 mt-2">
                    {getThemeTypeDisplay(String(theme.nomination_type))}
                  </p>
                </div>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <div className="tags">
                  <span className="tag is-primary is-large">
                    <span className="icon mr-1">
                      <i className="fas fa-calendar"></i>
                    </span>
                    {theme.creation_date
                      ? new Date(theme.creation_date).toLocaleDateString()
                      : 'TBD'}
                  </span>
                  <span className="tag is-info is-large">
                    <span className="icon mr-1">
                      <i className="fas fa-list"></i>
                    </span>
                    {nominations.length} Nominations
                  </span>
                </div>
              </div>
            </div>
          </div>

          {theme.description && (
            <div className="content">
              <p className="is-size-5">{theme.description}</p>
            </div>
          )}
        </div>

        {/* Winners Section */}
        {winners.length > 0 && (
          <div className="box">
            <h2 className="title is-3">
              <span className="icon mr-2">
                <i className="fas fa-trophy"></i>
              </span>
              Winner{winners.length > 1 ? 's' : ''}
            </h2>

            {Object.keys(winnersByCategory).length > 1 ? (
              // Multiple categories (GotM with year brackets)
              Object.entries(winnersByCategory).map(
                ([category, categoryWinners]) => (
                  <div key={category} className="mb-5">
                    <h3 className="title is-4">{category}</h3>
                    <div className="columns is-multiline">
                      {categoryWinners.map((winner, index) => (
                        <div key={index} className="column is-one-third">
                          <div className="card">
                            <div className="card-content">
                              <h4 className="title is-5 mb-2">
                                {getBestGameTitle(winner.game)}
                              </h4>
                              <div className="tags mb-3">
                                <span className="tag is-primary">
                                  {winner.yearCategory}
                                </span>
                                {winner.game.year && (
                                  <span className="tag is-info">
                                    {winner.game.year}
                                  </span>
                                )}
                              </div>
                              {winner.user_name && (
                                <p className="has-text-grey is-size-7">
                                  Nominated by: {winner.user_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )
            ) : (
              // Single category or single winner
              <div className="columns is-multiline">
                {winners.map((winner, index) => (
                  <div key={index} className="column is-one-third">
                    <div className="card">
                      <div className="card-content">
                        <h4 className="title is-5 mb-2">
                          {getBestGameTitle(winner.game)}
                        </h4>
                        <div className="tags mb-3">
                          <span className="tag is-primary">
                            {winner.yearCategory}
                          </span>
                          {winner.game.year && (
                            <span className="tag is-info">
                              {winner.game.year}
                            </span>
                          )}
                        </div>
                        {winner.user_name && (
                          <p className="has-text-grey is-size-7">
                            Nominated by: {winner.user_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Nominations Section */}
        {nonWinners.length > 0 && (
          <div className="box">
            <h2 className="title is-3">
              <span className="icon mr-2">
                <i className="fas fa-list"></i>
              </span>
              All Nominations ({nominations.length})
            </h2>

            <table className="table is-hoverable is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Year</th>
                  <th>Category</th>
                  <th>Nominated By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {nominations.map((nomination, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{getBestGameTitle(nomination.game)}</strong>
                    </td>
                    <td>{nomination.game.year || 'Unknown'}</td>
                    <td>{nomination.yearCategory || 'Unknown'}</td>
                    <td>{nomination.user_name || 'Unknown'}</td>
                    <td>
                      {nomination.winner ? (
                        <span className="tag is-success">
                          <span className="icon mr-1">
                            <i className="fas fa-trophy"></i>
                          </span>
                          Winner
                        </span>
                      ) : (
                        <span className="tag">Nominated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {nominations.length === 0 && (
          <div className="box has-text-centered">
            <span className="icon is-large has-text-grey-light">
              <i className="fas fa-inbox fa-3x"></i>
            </span>
            <p className="title is-4 has-text-grey">No nominations yet</p>
            <p className="has-text-grey">
              This theme doesn&apos;t have any nominations yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ThemeDetail;
