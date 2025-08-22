import React, { useState } from 'react';
import {
  NominationWithGame,
  getBestGameTitle,
  Game,
} from '../../../../models/game';
import classNames from 'classnames';

interface NominationsTableProps {
  nominations: NominationWithGame[];
  showCategories?: boolean; // For GotM themes that group by year categories
  title?: string; // Custom title for the section
  onGameClick?: (game: Game) => void; // Callback when a game row is clicked
}

export const NominationsTable: React.FC<NominationsTableProps> = ({
  nominations,
  showCategories = false,
  title = 'All Nominations',
  onGameClick,
}) => {
  const [hoveredGameId, setHoveredGameId] = useState<number | null>(null);

  const handleRowClick = (nomination: NominationWithGame) => {
    if (onGameClick) {
      onGameClick(nomination.game);
    }
  };
  if (nominations.length === 0) {
    return null;
  }

  if (showCategories) {
    // Group nominations by category (GotM-specific)
    const groupedNominations = nominations.reduce<
      Record<string, typeof nominations>
    >((acc, nomination) => {
      const category = nomination.yearCategory || 'Unknown';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(nomination);
      return acc;
    }, {});

    return (
      <div className="box">
        <h2 className="title is-3">
          <span className="icon mr-2">
            <i className="fas fa-list"></i>
          </span>
          {title}
          <span className="tag is-info ml-2">{nominations.length}</span>
        </h2>

        {Object.entries(groupedNominations).map(
          ([category, categoryNominations]) => (
            <div key={category} className="mb-5">
              <h3 className="title is-4 has-text-centered mb-3">
                {category}
                <span className="tag is-primary ml-2">
                  {categoryNominations.length}
                </span>
              </h3>

              <table className="table is-hoverable is-striped is-fullwidth">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Year</th>
                    <th>Nominated By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryNominations.map((nomination, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(nomination)}
                      onMouseEnter={() => setHoveredGameId(nomination.game.id)}
                      onMouseLeave={() => setHoveredGameId(null)}
                      className={classNames({
                        'is-selected': hoveredGameId === nomination.game.id,
                      })}
                      style={{ cursor: onGameClick ? 'pointer' : 'default' }}
                    >
                      <td>
                        <strong>{getBestGameTitle(nomination.game)}</strong>
                      </td>
                      <td>{nomination.game.year || 'Unknown'}</td>
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
          ),
        )}
      </div>
    );
  }

  // Simple flat table (for RPG and other themes)
  return (
    <div className="box">
      <h2 className="title is-3">
        <span className="icon mr-2">
          <i className="fas fa-list"></i>
        </span>
        {title}
        <span className="tag is-info ml-2">{nominations.length}</span>
      </h2>

      <table className="table is-hoverable is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Game</th>
            <th>Year</th>
            <th>Nominated By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {nominations.map((nomination, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(nomination)}
              onMouseEnter={() => setHoveredGameId(nomination.game.id)}
              onMouseLeave={() => setHoveredGameId(null)}
              className={classNames({
                'is-selected': hoveredGameId === nomination.game.id,
              })}
              style={{ cursor: onGameClick ? 'pointer' : 'default' }}
            >
              <td>
                <strong>{getBestGameTitle(nomination.game)}</strong>
              </td>
              <td>{nomination.game.year || 'Unknown'}</td>
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
  );
};
