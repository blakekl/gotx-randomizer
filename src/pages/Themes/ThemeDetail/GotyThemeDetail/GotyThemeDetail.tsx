import React, { useState } from 'react';
import { NominationWithGame, Game } from '../../../../models/game';
import { WinnerCard } from '../WinnerCard/WinnerCard';
import GameDisplay from '../../../Randomizer/GameDisplay/GameDisplay';
import classNames from 'classnames';

interface GotyThemeDetailProps {
  nominations: NominationWithGame[];
}

export const GotyThemeDetail: React.FC<GotyThemeDetailProps> = ({
  nominations,
}) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

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
                  onGameClick={setSelectedGame}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No nominations table for GotY - not needed */}

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
