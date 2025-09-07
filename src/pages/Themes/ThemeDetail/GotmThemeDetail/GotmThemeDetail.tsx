import React, { useState } from 'react';
import { NominationWithGame, Game } from '../../../../models/game';
import { WinnerCard } from '../WinnerCard/WinnerCard';
import { NominationsTable } from '../NominationsTable/NominationsTable';
import GameDisplay from '../../../Randomizer/GameDisplay/GameDisplay';
import classNames from 'classnames';

interface GotmThemeDetailProps {
  nominations: NominationWithGame[];
}

export const GotmThemeDetail: React.FC<GotmThemeDetailProps> = ({
  nominations,
}) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

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
                <WinnerCard
                  winner={winner}
                  showCategory={true}
                  onGameClick={setSelectedGame}
                />
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
        onGameClick={setSelectedGame}
      />

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
