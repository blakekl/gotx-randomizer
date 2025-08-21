import { useMemo, useState } from 'react';
import { useStores } from '../../stores/useStores';
import { ThemeWithStatus, getThemeTypeDisplay } from '../../models/game';
import Pagination from '../../components/Pagination';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

type ThemeTypeFilter = 'All' | 'GotM' | 'Retrobit' | 'RPG' | 'GotY';

const ThemeBrowser = observer(() => {
  const { dbStore } = useStores();
  const [themeList, setThemeList] = useState(new Array<ThemeWithStatus>());
  const [indexRange, setIndexRange] = useState([0, 0]);
  const [titleFilter, setTitleFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<ThemeTypeFilter>('All');
  const [selectedTheme, setSelectedTheme] = useState<ThemeWithStatus | null>(
    null,
  );
  const [hovered, setHovered] = useState(0);

  // Get themes with status (excluding upcoming themes for privacy)
  const allThemes = useMemo(() => {
    return dbStore.getThemesWithStatus();
  }, [dbStore]);

  // Filter themes based on search and type
  useMemo(() => {
    let filteredThemes = allThemes.filter((theme) =>
      theme.title?.toLowerCase().includes(titleFilter.toLowerCase()),
    );

    // Apply type filter
    if (typeFilter !== 'All') {
      filteredThemes = filteredThemes.filter((theme) => {
        switch (typeFilter) {
          case 'GotM':
            return String(theme.nomination_type) === 'gotm';
          case 'Retrobit':
            return String(theme.nomination_type) === 'retro';
          case 'RPG':
            return String(theme.nomination_type) === 'rpg';
          case 'GotY':
            return (
              String(theme.nomination_type) === 'goty' ||
              String(theme.nomination_type) === 'gotwoty'
            );
          default:
            return true;
        }
      });
    }

    setThemeList(filteredThemes);
  }, [allThemes, titleFilter, typeFilter]);

  const handleRowClicked = (theme: ThemeWithStatus) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="mt-6">
      <h2 className="title is-3">Theme History</h2>

      {/* Type Filter Buttons */}
      <div className="field mt-4">
        <div className="field has-addons">
          {(
            ['All', 'GotM', 'Retrobit', 'RPG', 'GotY'] as ThemeTypeFilter[]
          ).map((filterType) => (
            <p key={filterType} className="control">
              <button
                className={classNames('button', {
                  'is-primary': typeFilter === filterType,
                })}
                onClick={() => setTypeFilter(filterType)}
              >
                {filterType}
              </button>
            </p>
          ))}
        </div>
      </div>

      {/* Search Filter */}
      <div className="field mt-4">
        <p className="control has-icons-left">
          <input
            className="input"
            type="text"
            placeholder="Search themes..."
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.currentTarget.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search" />
          </span>
        </p>
      </div>

      {/* Themes Table */}
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
          {themeList.slice(indexRange[0], indexRange[1]).map((theme) => (
            <tr
              key={theme.id}
              onClick={() => handleRowClicked(theme)}
              className={classNames({
                'is-selected':
                  (selectedTheme && theme.id === selectedTheme.id) ||
                  hovered === theme.id,
                'is-clickable': true,
              })}
              onMouseEnter={() => setHovered(theme.id)}
              onMouseLeave={() => setHovered(0)}
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

      <Pagination count={themeList.length} onPageChange={setIndexRange} />

      {/* Theme Detail Modal */}
      <div className={classNames('modal', { 'is-active': selectedTheme })}>
        <div
          className="modal-background"
          onClick={() => setSelectedTheme(null)}
        ></div>
        <div className="modal-content">
          {selectedTheme && (
            <div className="box">
              <h3 className="title is-4">
                {selectedTheme.title || 'Upcoming Theme'}
              </h3>
              <div className="content">
                <p>
                  <strong>Type:</strong>{' '}
                  {getThemeTypeDisplay(String(selectedTheme.nomination_type))}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {selectedTheme.creation_date
                    ? new Date(selectedTheme.creation_date).toLocaleDateString()
                    : 'TBD'}
                </p>
                {selectedTheme.description && (
                  <p>
                    <strong>Description:</strong> {selectedTheme.description}
                  </p>
                )}
                <p>
                  <strong>Nominations:</strong>{' '}
                  {String(selectedTheme.nominationCount || 0)}
                </p>
              </div>
            </div>
          )}
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setSelectedTheme(null)}
        ></button>
      </div>
    </div>
  );
});

export default ThemeBrowser;
