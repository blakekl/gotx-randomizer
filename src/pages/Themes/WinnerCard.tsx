import React from 'react';
import { NominationWithGame, getBestGameTitle } from '../../models/game';

interface WinnerCardProps {
  winner: NominationWithGame;
  showCategory?: boolean; // For GotM themes that have year categories
  categoryLabel?: string; // Custom category label (for GotY themes)
}

export const WinnerCard: React.FC<WinnerCardProps> = ({
  winner,
  showCategory = false,
  categoryLabel,
}) => {
  const displayCategory = categoryLabel || winner.yearCategory;

  return (
    <div className="card">
      <div className="card-content">
        {showCategory && displayCategory && (
          <h4 className="title is-5 mb-6">{displayCategory}</h4>
        )}
        <p className={`subtitle is-6 mb-3 ${showCategory ? '' : 'title is-5'}`}>
          {getBestGameTitle(winner.game)}
        </p>
        {winner.game.img_url && (
          <figure
            className="image mb-3"
            style={{ height: '200px', overflow: 'hidden' }}
          >
            <img
              src={winner.game.img_url}
              alt={getBestGameTitle(winner.game)}
              style={{
                borderRadius: '6px',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </figure>
        )}
        {winner.game.year && (
          <span className="tag is-info mb-2">{winner.game.year}</span>
        )}
        {winner.user_name && (
          <p className="has-text-grey is-size-7">
            Nominated by: {winner.user_name}
          </p>
        )}
      </div>
    </div>
  );
};
