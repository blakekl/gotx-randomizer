import React from 'react';
import { NominationWithGame } from '../../models/game';
import { WinnerCard } from './WinnerCard';

interface GotwotypThemeDetailProps {
  nominations: NominationWithGame[];
}

export const GotwotypThemeDetail: React.FC<GotwotypThemeDetailProps> = ({
  nominations,
}) => {
  // GOTWOTY themes have only one winner and no other nominations
  const winners = nominations.filter((nom) => nom.winner);

  return (
    <>
      {/* Single Winner Showcase */}
      {winners.length > 0 && (
        <div className="box">
          <h2 className="title is-3">
            <span className="icon mr-2">
              <i className="fas fa-calendar-week"></i>
            </span>
            Winner
          </h2>

          {/* Single winner card - centered and prominent */}
          <div className="columns is-centered is-vcentered">
            <div className="column is-one-third">
              <WinnerCard winner={winners[0]} showCategory={false} />
            </div>
          </div>
        </div>
      )}

      {/* No nominations table for GOTWOTY - they don't have other nominations */}
      {winners.length === 0 && (
        <div className="box">
          <div className="notification is-info">
            <p>
              <strong>No winner announced yet.</strong>
            </p>
            <p>This GOTWOTY theme is still in progress.</p>
          </div>
        </div>
      )}
    </>
  );
};
