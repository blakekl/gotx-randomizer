import * as React from 'react';
import { useMediaQuery } from 'react-responsive';
import { observer } from 'mobx-react-lite';
import { toast } from 'bulma-toast';
import ReactSlider from 'react-slider';
import classNames = require('classnames');
import './style.css';
import { Game } from './models/game';
import { useStores } from './stores/useStores';
import RandomizerStore from './stores/RandomizerStore';

const App = observer(() => {
  const { databaseStore, randomizerStore } = useStores();
  const imgElement = React.useRef<HTMLImageElement>(null);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [showSettings, setShowSettings] = React.useState(true);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const handleButtonClick = () => {
    randomizerStore.nextGame();
    setImgLoaded(false);
  };

  const onImageLoaded = () => setImgLoaded(imgElement.current.complete);
  React.useEffect(() => {
    if (imgElement.current) {
      imgElement.current.addEventListener('load', onImageLoaded);
      return () => {
        imgElement.current.removeEventListener('load', onImageLoaded);
      };
    }
  }, [imgElement]);

  React.useEffect(() => {
    setImgLoaded(false);
  }, [
    randomizerStore.includeGotmRunnerUp,
    randomizerStore.includeGotmWinners,
    randomizerStore.includeRetrobits,
    randomizerStore.includeRpgRunnerUp,
    randomizerStore.includeRpgWinners,
  ]);

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
    <div>
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
                      handleFilterChange(
                        0,
                        !randomizerStore.includeGotmRunnerUp
                      )
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

      <div className="has-text-centered">
        <button
          className={classNames({
            button: true,
            'is-primary': true,
            rollBtn: true,
            'is-fullwidth': isMobile,
            'is-large': !isMobile,
          })}
          disabled={!imgLoaded}
          onClick={() => handleButtonClick()}
        >
          {imgLoaded && <span>Reroll</span>}
          {!imgLoaded && (
            <span className="icon is-small">
              <span className="loader"></span>
            </span>
          )}
        </button>
      </div>
      <div
        className="loader"
        style={{ display: imgLoaded ? 'none' : 'block' }}
      ></div>
      <img
        ref={imgElement}
        src={randomizerStore.currentGame.img}
        style={{
          display:
            !!randomizerStore.currentGame?.img && imgLoaded ? 'block' : 'none',
          margin: 'auto',
        }}
      />
      <section className="section">
        <h1 className="title has-text-centered">
          {
            [
              `🇺🇸 ${randomizerStore.currentGame.title.usa}`,
              `🌎 ${randomizerStore.currentGame.title.world}`,
              `🇪🇺 ${randomizerStore.currentGame.title.eu}`,
              `🇯🇵 ${randomizerStore.currentGame.title.jap}`,
              `🏳️ ${randomizerStore.currentGame.title.other}`,
            ].filter((x) => x.length > 5)[0]
          }
        </h1>
        <h2 className="subtitle has-text-centered">
          {[
            `🇺🇸 ${randomizerStore.currentGame.title.usa}`,
            `🌎 ${randomizerStore.currentGame.title.world}`,
            `🇪🇺 ${randomizerStore.currentGame.title.eu}`,
            `🇯🇵 ${randomizerStore.currentGame.title.jap}`,
            `🏳️ ${randomizerStore.currentGame.title.other}`,
          ]
            .filter((x) => x.length > 5)
            .slice(1)
            .map((title, index) => (
              <div key={index}>{title}</div>
            ))}
        </h2>
        <div className="level">
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile">🗓️</p>
              <p className="subtitle">
                <span className="is-hidden-tablet">🗓️</span>
                <span>{randomizerStore.currentGame.year}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile">🕹️</p>
              <p className="subtitle">
                <span className="is-hidden-tablet">🕹️</span>
                <span>{randomizerStore.currentGame.system}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile">🏢</p>
              <p className="subtitle">
                <span className="is-hidden-tablet">🏢</span>
                <span>{randomizerStore.currentGame.developer}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile">⏱️</p>
              <p className="subtitle">
                <span className="is-hidden-tablet">⏱️</span>
                <span>
                  {randomizerStore.currentGame.time_to_beat > 0
                    ? `${randomizerStore.currentGame.time_to_beat} hours`
                    : 'No data'}
                </span>
              </p>
            </div>
          </div>
        </div>
        <blockquote className="is-size-4 has-text-justified">
          {randomizerStore.currentGame.description}
        </blockquote>
      </section>
    </div>
  );
});

export default App;
