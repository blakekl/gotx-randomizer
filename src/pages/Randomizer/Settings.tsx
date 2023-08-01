import * as React from 'react';
import { useMediaQuery } from 'react-responsive';
import { observer } from 'mobx-react-lite';
import { toast } from 'bulma-toast';
import ReactSlider from 'react-slider';
import classNames = require('classnames');
import { useStores } from '../../stores/useStores';

const Settings = observer(() => {
  const { randomizerStore } = useStores();
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [showSettings, setShowSettings] = React.useState(false);

  const handleFilterChange = (item: number, value: boolean) => {
    const filters = [
      randomizerStore.includeGotmRunnerUp,
      randomizerStore.includeGotmWinners,
      randomizerStore.includeRetrobits,
      randomizerStore.includeRpgRunnerUp,
      randomizerStore.includeRpgWinners,
    ];
    filters[item] = value;
    if (filters.some((x) => x)) {
      switch (item) {
        case 0:
          randomizerStore.setIncludeGotmRunnerUp(value);
          break;
        case 1:
          randomizerStore.setIncludeGotmWinners(value);
          break;
        case 2:
          randomizerStore.setIncludeRetrobits(value);
          break;
        case 3:
          randomizerStore.setIncludeRpgRunnerUp(value);
          break;
        case 4:
          randomizerStore.setIncludeRpgWinners(value);
          break;
      }
    } else {
      toast({
        message: 'You must include a list. Please include something.',
        type: 'is-danger',
        dismissible: true,
        pauseOnHover: true,
        animate: { in: 'fadeIn', out: 'fadeOut' },
      });
    }
  };

  const handleTtbFilterChange = (newValue, thumbIndex) => {
    randomizerStore.setTtbFilter(newValue);
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
            'is-large': !isMobile,
          })}
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setShowSettings(!showSettings)}
        >
          <span>Settings</span>
          <span className="icon is-small">
            <span
              className={classNames({
                fas: true,
                'fa-angle-down': !showSettings,
                'fa-angle-up': showSettings,
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
                  checked={randomizerStore.includeGotmWinners}
                  onChange={() =>
                    handleFilterChange(1, !randomizerStore.includeGotmWinners)
                  }
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
                  checked={randomizerStore.includeGotmRunnerUp}
                  onChange={() =>
                    handleFilterChange(0, !randomizerStore.includeGotmRunnerUp)
                  }
                ></input>
                GotM Runner Ups
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={randomizerStore.includeRetrobits}
                  onChange={() =>
                    handleFilterChange(2, !randomizerStore.includeRetrobits)
                  }
                ></input>
                Retrobits
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={randomizerStore.includeRpgWinners}
                  onChange={() =>
                    handleFilterChange(4, !randomizerStore.includeRpgWinners)
                  }
                ></input>
                RPGotQ Winners
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={randomizerStore.includeRpgRunnerUp}
                  onChange={() =>
                    handleFilterChange(3, !randomizerStore.includeRpgRunnerUp)
                  }
                ></input>
                RPGotQ Runner Ups
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
                onAfterChange={(newValues, thumbIndex) =>
                  handleTtbFilterChange(newValues, thumbIndex)
                }
                defaultValue={[0, Number.MAX_SAFE_INTEGER]}
                min={randomizerStore.ttbMin}
                max={randomizerStore.ttbMax}
                value={randomizerStore.ttbFilter}
                ariaLabel={['Minimum time to beat', 'Maximum time to beat']}
                ariaValuetext={(state) => `Filter value ${state.valueNow}`}
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
