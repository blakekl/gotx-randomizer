import { useMemo, useState } from 'react';
import { useStores } from '../../stores/useStores';
import { ThemeWithStatus } from '../../models/game';
import Pagination from '../../components/Pagination';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import CurrentThemes from './CurrentThemes';

const ThemeBrowser = observer(() => {
  const { dbStore } = useStores(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [themeList, setThemeList] = useState(new Array<ThemeWithStatus>());
  const [indexRange, setIndexRange] = useState([0, 0]);
  const [titleFilter, setTitleFilter] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeWithStatus | null>(
    null,
  );
  const [hovered, setHovered] = useState(0);

  // Get themes with status (excluding upcoming themes for privacy)
  const allThemes = useMemo(() => {
    // TODO: This will be populated from dbStore.getThemesWithStatus() once store is extended
    return [] as ThemeWithStatus[];
  }, []);

  // Filter themes based on search
  useMemo(() => {
    const filteredThemes = allThemes.filter((theme) =>
      theme.title?.toLowerCase().includes(titleFilter.toLowerCase()),
    );
    setThemeList(filteredThemes);
  }, [allThemes, titleFilter]);

  const handleRowClicked = (theme: ThemeWithStatus) => {
    setSelectedTheme(theme);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="tag is-success">Completed</span>;
      case 'active':
        return <span className="tag is-primary">Active</span>;
      case 'upcoming':
        return <span className="tag is-warning">Upcoming</span>;
      default:
        return <span className="tag is-light">Unknown</span>;
    }
  };

  const getThemeTypeDisplay = (type: string) => {
    switch (type) {
      case 'gotm':
        return 'Game of the Month';
      case 'goty':
        return 'Game of the Year';
      case 'retrobit':
        return 'Retrobit';
      case 'rpg':
        return 'RPG';
      case 'gotwoty':
        return 'Game of the Week of the Year';
      default:
        return type;
    }
  };

  return (
    <>
      <h1 className="title is-1 has-text-centered">Theme Browser</h1>

      {/* Current Themes Dashboard */}
      <CurrentThemes />

      {/* Theme History Section */}
      <div className="mt-6">
        <h2 className="title is-3">Theme History</h2>

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
              <th>Status</th>
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
                <td>{getThemeTypeDisplay(String(theme.type))}</td>
                <td>
                  {theme.creation_date
                    ? new Date(theme.creation_date).toLocaleDateString()
                    : 'TBD'}
                </td>
                <td>{getStatusBadge(theme.status)}</td>
                <td className="has-text-right">
                  {String(theme.nomination_count || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination count={themeList.length} onPageChange={setIndexRange} />
      </div>

      {/* Theme Detail Modal */}
      <div
        className={classNames({
          modal: true,
          'is-active': selectedTheme !== null,
        })}
      >
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
                  {getThemeTypeDisplay(String(selectedTheme.type))}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {selectedTheme.creation_date
                    ? new Date(selectedTheme.creation_date).toLocaleDateString()
                    : 'TBD'}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  {getStatusBadge(selectedTheme.status)}
                </p>
                {selectedTheme.description && (
                  <p>
                    <strong>Description:</strong> {selectedTheme.description}
                  </p>
                )}
                <p>
                  <strong>Nominations:</strong>{' '}
                  {String(selectedTheme.nomination_count || 0)}
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
    </>
  );
});

export default ThemeBrowser;
