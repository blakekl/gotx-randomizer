import React, { useState } from 'react';
import {
  NominationWithGame,
  getBestGameTitle,
  Game,
} from '../../../../models/game';
import classNames from 'classnames';

interface WinnerCardProps {
  winner: NominationWithGame;
  showCategory?: boolean; // For GotM themes that have year categories
  categoryLabel?: string; // Custom category label (for GotY themes)
  onGameClick?: (game: Game) => void; // Callback when the card is clicked
}

export const WinnerCard: React.FC<WinnerCardProps> = ({
  winner,
  showCategory = false,
  categoryLabel,
  onGameClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const displayCategory = categoryLabel || winner.yearCategory;

  const handleCardClick = () => {
    if (onGameClick) {
      onGameClick(winner.game);
    }
  };

  return (
    <div
      className={classNames('card', {
        'has-background-primary': isHovered && onGameClick,
      })}
      onClick={handleCardClick}
      onMouseEnter={() => {
        if (onGameClick) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (onGameClick) {
          setIsHovered(false);
        }
      }}
      style={{
        cursor: onGameClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
    >
      <div className="card-content">
        {showCategory && displayCategory && (
          <h4
            className={classNames('title is-5 mb-6', {
              'has-text-white': isHovered && onGameClick,
            })}
          >
            {displayCategory}
          </h4>
        )}
        <p
          className={classNames(
            `subtitle is-6 mb-3 ${showCategory ? '' : 'title is-5'}`,
            {
              'has-text-white': isHovered && onGameClick,
            },
          )}
        >
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
          <span
            className={classNames('tag mb-2', {
              'is-info': !isHovered || !onGameClick,
              'is-light': isHovered && onGameClick,
            })}
          >
            {winner.game.year}
          </span>
        )}
        {winner.user_name && (
          <p
            className={classNames('is-size-7', {
              'has-text-grey': !isHovered || !onGameClick,
              'has-text-white-ter': isHovered && onGameClick,
            })}
          >
            Nominated by: {winner.user_name}
          </p>
        )}
      </div>
    </div>
  );
};
