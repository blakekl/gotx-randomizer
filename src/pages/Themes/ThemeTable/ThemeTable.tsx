import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { ThemeWithStatus, getThemeTypeDisplay } from '../../../models/game';

interface ThemeTableProps {
  themes: ThemeWithStatus[];
  indexRange: number[];
  selectedTheme: ThemeWithStatus | null;
  hoveredTheme: number;
  onThemeClick: (theme: ThemeWithStatus) => void;
  onThemeHover: (themeId: number) => void;
  onThemeLeave: () => void;
}

const ThemeTable = ({
  themes,
  indexRange,
  selectedTheme,
  hoveredTheme,
  onThemeClick,
  onThemeHover,
  onThemeLeave,
}: ThemeTableProps) => {
  return (
    <table className="table is-hoverable is-striped is-fullwidth">
      <thead>
        <tr className="title is-5">
          <th>Theme</th>
          <th>Type</th>
          <th>Date</th>
          <th className="has-text-right">Nominations</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {themes.slice(indexRange[0], indexRange[1]).map((theme) => (
          <tr
            key={theme.id}
            className={classNames({
              'is-selected':
                (selectedTheme && theme.id === selectedTheme.id) ||
                hoveredTheme === theme.id,
            })}
            onMouseEnter={() => onThemeHover(theme.id)}
            onMouseLeave={onThemeLeave}
          >
            <td
              onClick={() => onThemeClick(theme)}
              className="is-clickable"
              style={{ cursor: 'pointer' }}
            >
              <strong>{theme.title || 'Upcoming Theme'}</strong>
              {theme.description && (
                <div className="is-size-7 has-text-grey">
                  {theme.description}
                </div>
              )}
            </td>
            <td
              onClick={() => onThemeClick(theme)}
              className="is-clickable"
              style={{ cursor: 'pointer' }}
            >
              {getThemeTypeDisplay(String(theme.nomination_type))}
            </td>
            <td
              onClick={() => onThemeClick(theme)}
              className="is-clickable"
              style={{ cursor: 'pointer' }}
            >
              {theme.creation_date
                ? new Date(theme.creation_date).toLocaleDateString()
                : 'TBD'}
            </td>
            <td
              onClick={() => onThemeClick(theme)}
              className="has-text-right is-clickable"
              style={{ cursor: 'pointer' }}
            >
              {String(theme.nominationCount || 0)}
            </td>
            <td>
              <Link
                to={`/themes/${theme.id}`}
                className="button is-small is-primary"
              >
                <span className="icon is-small">
                  <i className="fas fa-eye"></i>
                </span>
                <span>View Details</span>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ThemeTable;
