import React, { useState } from 'react';
import { NominationWithGame, Game } from '../../../../models/game';
import { WinnerCard } from '../WinnerCard/WinnerCard';
import GameDisplay from '../../../Randomizer/GameDisplay/GameDisplay';
import classNames from 'classnames';

interface RetrobitsThemeDetailProps {
  nominations: NominationWithGame[];
}

export const RetrobitsThemeDetail: React.FC<RetrobitsThemeDetailProps> = ({
  nominations,
}) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Retrobits themes have only one winner and no other nominations
  const winners = nominations.filter((nom) => nom.winner);

  return (
    <>
      {/* Single Winner Showcase */}
      {winners.length > 0 && (
        <div className="box">
          <h2 className="title is-3">
            <span className="icon mr-2">
              <i className="fas fa-trophy"></i>
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

      {/* No nominations table for Retrobits - they don't have other nominations */}
      {winners.length === 0 && (
        <div className="box">
          <div className="notification is-info">
            <p>
              <strong>No winner announced yet.</strong>
            </p>
            <p>This Retrobits theme is still in progress.</p>
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
