import React from 'react';
import { ThemeWithStatus } from '../../../../models/game';
import { getThemeTypeDisplay, getThemeIcon } from '../../../../models/game';

interface ThemeHeaderProps {
  theme: ThemeWithStatus;
}

export const ThemeHeader: React.FC<ThemeHeaderProps> = ({ theme }) => {
  return (
    <div className="box">
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <div>
              <h1 className="title is-2 mb-2">
                <span className="icon mr-3">
                  <i className={getThemeIcon(theme.nomination_type)}></i>
                </span>
                {theme.title || 'Upcoming Theme'}
              </h1>
              <p className="subtitle is-4 mt-2">
                {getThemeTypeDisplay(String(theme.nomination_type))}
              </p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <span className="tag is-info is-large mr-2">
              <span className="icon mr-1">
                <i className="fas fa-calendar"></i>
              </span>
              {theme.creation_date}
            </span>
            <span className="tag is-primary is-large">
              <span className="icon mr-1">
                <i className="fas fa-list"></i>
              </span>
              {theme.nominationCount} Nominations
            </span>
          </div>
        </div>
      </div>
      {theme.description && (
        <div className="content mt-4">
          <p>{theme.description}</p>
        </div>
      )}
    </div>
  );
};
