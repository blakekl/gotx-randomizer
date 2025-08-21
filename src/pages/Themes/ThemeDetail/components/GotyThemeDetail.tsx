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
  // GotY themes have multiple winners
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

          {/* All winners in horizontal layout */}
          <div className="columns is-multiline">
            {winners.map((winner, index) => (
              <div key={index} className="column is-one-third">
                <WinnerCard winner={winner} showCategory={false} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Nominations Section - Flat table for GotY */}
      <NominationsTable
        nominations={nominations}
        showCategories={false}
        title="All Nominations"
      />
    </>
  );
};
