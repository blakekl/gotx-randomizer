import React, { useState } from 'react';
import { NominationWithGame, Game } from '../../../../models/game';
import { WinnerCard } from '../WinnerCard/WinnerCard';
import { NominationsTable } from '../NominationsTable/NominationsTable';
import GameDisplay from '../../../Randomizer/GameDisplay/GameDisplay';
import classNames from 'classnames';

interface RpgThemeDetailProps {
  nominations: NominationWithGame[];
}

export const RpgThemeDetail: React.FC<RpgThemeDetailProps> = ({
  nominations,
}) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // RPG themes have one winner and multiple nominations
  const winners = nominations.filter((nom) => nom.winner);

  return (
    <>
      {/* Single Winner Section */}
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

      {/* All Nominations Section - Flat table (no categories for RPG) */}
      <NominationsTable
        nominations={nominations}
        showCategories={false}
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
