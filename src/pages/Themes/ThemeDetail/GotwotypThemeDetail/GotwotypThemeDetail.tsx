import React, { useState } from 'react';
import { NominationWithGame, Game } from '../../../../models/game';
import { WinnerCard } from '../WinnerCard/WinnerCard';
import GameDisplay from '../../../Randomizer/GameDisplay/GameDisplay';
import classNames from 'classnames';

interface GotwotypThemeDetailProps {
  nominations: NominationWithGame[];
}

export const GotwotypThemeDetail: React.FC<GotwotypThemeDetailProps> = ({
  nominations,
}) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

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
              <WinnerCard
                winner={winners[0]}
                showCategory={false}
                onGameClick={setSelectedGame}
              />
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

      {/* Game Detail Modal */}
      <div className={classNames('modal', { 'is-active': selectedGame })}>
        <div
          className="modal-background"
          onClick={() => setSelectedGame(null)}
        ></div>
        <div className="modal-content">
          {selectedGame && <GameDisplay game={selectedGame} />}
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setSelectedGame(null)}
        ></button>
      </div>
    </>
  );
};
