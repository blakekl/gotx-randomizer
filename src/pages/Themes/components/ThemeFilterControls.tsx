import classNames from 'classnames';

type ThemeTypeFilter = 'All' | 'GotM' | 'Retrobit' | 'RPG' | 'GotY';

interface ThemeFilterControlsProps {
  typeFilter: ThemeTypeFilter;
  onTypeFilterChange: (filter: ThemeTypeFilter) => void;
  titleFilter: string;
  onTitleFilterChange: (filter: string) => void;
}

const ThemeFilterControls = ({
  typeFilter,
  onTypeFilterChange,
  titleFilter,
  onTitleFilterChange,
}: ThemeFilterControlsProps) => {
  return (
    <>
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
                onClick={() => onTypeFilterChange(filterType)}
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
            onChange={(e) => onTitleFilterChange(e.currentTarget.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search" />
          </span>
        </p>
      </div>
    </>
  );
};

export default ThemeFilterControls;
