import React from 'react';
import { NominationWithGame } from '../../../../models/game';
import { WinnerCard } from '../shared/WinnerCard';
import { NominationsTable } from '../shared/NominationsTable';

interface GotyThemeDetailProps {
  nominations: NominationWithGame[];
}

export const GotyThemeDetail: React.FC<GotyThemeDetailProps> = ({
  nominations,
}) => {
  // GotY themes have multiple winners with theme description categories
  const winners = nominations.filter((nom) => nom.winner);

  // Group winners by theme description (e.g., "Best Soundtrack", "Game of the Year")
  const winnersByThemeDescription = winners.reduce<
    Record<string, typeof winners>
  >((acc, winner) => {
    const category = winner.themeDescription || 'Unknown Category';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(winner);
    return acc;
  }, {});

  const hasMultipleCategories =
    Object.keys(winnersByThemeDescription).length > 1;

  return (
    <>
      {/* Winners Section */}
      {winners.length > 0 && (
        <div className="box">
          <h2 className="title is-3">
            <span className="icon mr-2">
              <i className="fas fa-crown"></i>
            </span>
            Winners
          </h2>

          {hasMultipleCategories ? (
            // Multiple theme description categories - show grouped by category
            Object.entries(winnersByThemeDescription).map(
              ([themeDescription, categoryWinners]) => (
                <div key={themeDescription} className="mb-5">
                  <h3 className="title is-4 mb-3">{themeDescription}</h3>
                  <div className="columns is-multiline">
                    {categoryWinners.map((winner, index) => (
                      <div key={index} className="column is-one-third">
                        <WinnerCard
                          winner={winner}
                          showCategory={false}
                          categoryLabel={themeDescription}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )
          ) : (
            // Single theme description category - show category in cards
            <div className="columns is-multiline">
              {winners.map((winner, index) => (
                <div key={index} className="column is-one-third">
                  <WinnerCard
                    winner={winner}
                    showCategory={true}
                    categoryLabel={winner.themeDescription}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Nominations Section - Grouped by Theme Description */}
      <NominationsTable
        nominations={nominations}
        showCategories={true}
        title="All Nominations"
      />
    </>
  );
};
