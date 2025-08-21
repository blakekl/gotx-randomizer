import React from 'react';
import { NominationWithGame } from '../../../../models/game';
import { WinnerCard } from '../shared/WinnerCard';
import { NominationsTable } from '../shared/NominationsTable';

interface GotmThemeDetailProps {
  nominations: NominationWithGame[];
}

export const GotmThemeDetail: React.FC<GotmThemeDetailProps> = ({
  nominations,
}) => {
  // Group nominations by winner status and year category
  const winners = nominations.filter((nom) => nom.winner);

  // Group winners by year category for GotM themes
  const winnersByCategory = winners.reduce<Record<string, typeof winners>>(
    (acc, winner) => {
      const category = String(winner.yearCategory || 'Unknown');
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(winner);
      return acc;
    },
    {},
  );

  const hasMultipleCategories = Object.keys(winnersByCategory).length > 1;

  return (
    <>
      {/* Winners Section */}
      {winners.length > 0 && (
        <div className="box">
          <h2 className="title is-3">
            <span className="icon mr-2">
              <i className="fas fa-trophy"></i>
            </span>
            Winners
          </h2>

          {hasMultipleCategories ? (
            // Multiple categories - show grouped by category
            Object.entries(winnersByCategory).map(
              ([category, categoryWinners]) => (
                <div key={category} className="mb-5">
                  <h3 className="title is-4 mb-3">{category}</h3>
                  <div className="columns is-multiline">
                    {categoryWinners.map((winner, index) => (
                      <div key={index} className="column is-one-third">
                        <WinnerCard winner={winner} showCategory={false} />
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
                  <WinnerCard winner={winner} showCategory={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Nominations Section - Grouped by Category */}
      <NominationsTable
        nominations={nominations}
        showCategories={true}
        title="All Nominations"
      />
    </>
  );
};
