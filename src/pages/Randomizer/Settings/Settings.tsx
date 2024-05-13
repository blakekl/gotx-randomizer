import { observer } from 'mobx-react-lite';
import ReactSlider from 'react-slider';
import classNames from 'classnames';
import { useStores } from '../../../stores/useStores';
import { useState } from 'react';

const Settings = observer(() => {
  const [ showSettings, setShowSettings ] = useState(false);
  const { settingsStore } = useStores();

  const handleTtbFilterChange = (newValue: number[]) => {
    settingsStore.setHltbFilter(newValue);
  };

  return (
    <div
      className={classNames({
        dropdown: true,
        'is-active': showSettings,
      })}
    >
      <div className="dropdown-trigger">
        <button
          className={classNames({
            button: true,
          })}
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => {
            setShowSettings(!showSettings);
          }}
        >
          <span>Settings</span>
          <span className="icon is-small">
            <span
              className={classNames({
                fas: true,
                'fa-sliders': true,
              })}
              aria-hidden="true"
            ></span>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={settingsStore.includeGotmWinners}
                  onChange={settingsStore.toggleGotmWinners}
                ></input>
                GotM Winners
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  name="GotM Runner Ups"
                  checked={settingsStore.includeGotmRunnerUp}
                  onChange={settingsStore.toggleGotmRunnerUp}
                ></input>
                GotM Runner Ups
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={settingsStore.includeRetrobits}
                  onChange={settingsStore.toggleRetrobits}
                ></input>
                Retrobits
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={settingsStore.includeRpgWinners}
                  onChange={settingsStore.toggleRpgWinners}
                ></input>
                RPGotQ Winners
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={settingsStore.includeRpgRunnerUp}
                  onChange={settingsStore.toggleRpgRunnerUp}
                ></input>
                RPGotQ Runner Ups
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={settingsStore.includeHiddenGames}
                  onChange={settingsStore.toggleHiddenGames}
                ></input>
                Include hidden games
              </label>
            </div>
          </div>
          <div className="field">
            <label className="label has-text-centered">Time to Beat</label>
            <div className="control">
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                onAfterChange={(newValues: number[]) => {
                  handleTtbFilterChange(newValues);
                }}
                defaultValue={[0, Number.MAX_SAFE_INTEGER]}
                min={settingsStore.hltbMin}
                max={settingsStore.hltbMax}
                value={settingsStore.hltbFilter}
                ariaLabel={['Minimum time to beat', 'Maximum time to beat']}
                ariaValuetext={(state: { valueNow: number }) =>
                  `Filter value ${state.valueNow}`
                }
                renderThumb={(props, state) => (
                  <div {...props}>{state.valueNow}</div>
                )}
                pearling
                minDistance={1}
              ></ReactSlider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Settings;
