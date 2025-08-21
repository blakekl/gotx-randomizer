import classNames from 'classnames';
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
        </tr>
      </thead>
      <tbody>
        {themes.slice(indexRange[0], indexRange[1]).map((theme) => (
          <tr
            key={theme.id}
            onClick={() => onThemeClick(theme)}
            className={classNames({
              'is-selected':
                (selectedTheme && theme.id === selectedTheme.id) ||
                hoveredTheme === theme.id,
              'is-clickable': true,
            })}
            onMouseEnter={() => onThemeHover(theme.id)}
            onMouseLeave={onThemeLeave}
          >
            <td>
              <strong>{theme.title || 'Upcoming Theme'}</strong>
              {theme.description && (
                <div className="is-size-7 has-text-grey">
                  {theme.description}
                </div>
              )}
            </td>
            <td>{getThemeTypeDisplay(String(theme.nomination_type))}</td>
            <td>
              {theme.creation_date
                ? new Date(theme.creation_date).toLocaleDateString()
                : 'TBD'}
            </td>
            <td className="has-text-right">
              {String(theme.nominationCount || 0)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ThemeTable;
