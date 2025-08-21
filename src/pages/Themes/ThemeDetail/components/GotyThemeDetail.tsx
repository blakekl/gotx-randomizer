import React from 'react';
import { NominationWithGame } from '../../../../models/game';
import { WinnerCard } from '../shared/WinnerCard';

interface GotyThemeDetailProps {
  nominations: NominationWithGame[];
}

export const GotyThemeDetail: React.FC<GotyThemeDetailProps> = ({
  nominations,
}) => {
  // GotY themes have multiple winners with categories in nomination descriptions
  const winners = nominations.filter((nom) => nom.winner);

  // Debug: Log the winners to see what data we have
  console.log('GotY Winners:', winners);
  console.log(
    'All potential category fields:',
    winners.map((w) => ({
      game: w.game.title_world,
      themeDescription: w.themeDescription, // t.description
      nominationDescription: w.description, // n.description - THIS IS THE CATEGORY!
      themeId: w.theme_id,
      yearCategory: w.yearCategory,
    })),
  );

  // Group winners by nomination description (e.g., "2024 GotY Runner Up, Best Art Style/Art Direction")
  const winnersByCategory = winners.reduce<Record<string, typeof winners>>(
    (acc, winner) => {
      // Use nomination description as the category (e.g., "2024 GotY Runner Up, Best Art Style/Art Direction")
      const category = winner.description || 'Unknown Category';
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
              <i className="fas fa-crown"></i>
            </span>
            Winners
          </h2>

          {hasMultipleCategories ? (
            // Multiple categories - show grouped by nomination description
            Object.entries(winnersByCategory).map(
              ([category, categoryWinners]) => (
                <div key={category} className="mb-5">
                  <h3 className="title is-4 mb-3">{category}</h3>
                  <div className="columns is-multiline">
                    {categoryWinners.map((winner, index) => (
                      <div key={index} className="column is-one-third">
                        <WinnerCard
                          winner={winner}
                          showCategory={false}
                          categoryLabel={category}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )
          ) : (
            // Single category - show category in cards
            <div className="columns is-multiline">
              {winners.map((winner, index) => (
                <div key={index} className="column is-one-third">
                  <WinnerCard
                    winner={winner}
                    showCategory={true}
                    categoryLabel={winner.description}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No nominations table for GotY - not needed */}
    </>
  );
};
