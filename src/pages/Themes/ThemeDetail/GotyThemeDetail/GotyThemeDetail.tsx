import React from 'react';
import { NominationWithGame } from '../../../../models/game';
import { WinnerCard } from '../WinnerCard/WinnerCard';

interface GotyThemeDetailProps {
  nominations: NominationWithGame[];
}

export const GotyThemeDetail: React.FC<GotyThemeDetailProps> = ({
  nominations,
}) => {
  // GotY themes have multiple winners with categories in nomination descriptions
  const winners = nominations.filter((nom) => nom.winner);

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

          {/* All winners in horizontal layout with category information in cards */}
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
        </div>
      )}

      {/* No nominations table for GotY - not needed */}
    </>
  );
};
