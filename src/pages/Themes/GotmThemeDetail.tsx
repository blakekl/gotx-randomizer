import React from 'react';
import { NominationWithGame } from '../../models/game';
import { WinnerCard } from './WinnerCard';
import { NominationsTable } from './NominationsTable';

interface GotmThemeDetailProps {
  nominations: NominationWithGame[];
}

export const GotmThemeDetail: React.FC<GotmThemeDetailProps> = ({
  nominations,
}) => {
  // Group nominations by winner status
  const winners = nominations.filter((nom) => nom.winner);

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

          {/* Single horizontal row for all winners */}
          <div className="columns is-multiline">
            {winners.map((winner, index) => (
              <div key={index} className="column is-one-third">
                <WinnerCard winner={winner} showCategory={true} />
              </div>
            ))}
          </div>
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
