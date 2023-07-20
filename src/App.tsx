import * as React from 'react';
import { useMediaQuery } from 'react-responsive';
import { observer } from 'mobx-react-lite';
import { toast } from 'bulma-toast';
import ReactSlider from 'react-slider';
import classNames = require('classnames');
import './style.css';
import { Game } from './models/game';
import { useStores } from './stores/useStores';

const App = observer(() => {
  const { databaseStore, settingsStore } = useStores();
  const imgElement = React.useRef<HTMLImageElement>(null);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [showSettings, setShowSettings] = React.useState(true);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [gamePool, setGamePool] = React.useState([]);
  const [filteredGamePool, setFilteredGamePool] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  databaseStore.loadData();
  const emptyGame = {
    id: 0,
    title: {
      usa: '',
      eu: '',
      jap: '',
      world: '',
      other: '',
    },
    screenscraper_id: 0,
    img: '',
    year: 0,
    system: '',
    developer: '',
    genre: '',
    time_to_beat: 0,
  } as Game;

  const getCurrentGame = () => {
    return filteredGamePool?.length > 0
      ? filteredGamePool[currentIndex]
      : emptyGame;
  };

  const handleButtonClick = () => {
    setCurrentIndex((currentIndex + 1) % filteredGamePool.length);
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

  const shuffle = (inputArray) => {
    const outputArray = [...inputArray];
    for (let i = outputArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [outputArray[i], outputArray[j]] = [outputArray[j], outputArray[i]];
    }
    return outputArray;
  };

  React.useEffect(() => {
    let newPool: Game[] = [];
    if (settingsStore.includeGotmRunnerUp) {
      newPool = newPool.concat(databaseStore.gotmRunnerUp);
    }
    if (settingsStore.includeGotmWinners) {
      newPool = newPool.concat(databaseStore.gotmWinners);
    }
    if (settingsStore.includeRetrobits) {
      newPool = newPool.concat(databaseStore.retrobits);
    }
    if (settingsStore.includeRpgRunnerUp) {
      newPool = newPool.concat(databaseStore.rpgRunnerUp);
    }
    if (settingsStore.includeRpgWinners) {
      newPool = newPool.concat(databaseStore.rpgWinners);
    }

    // update time filter values.
    if (newPool.length > 0) {
      const minTime = Math.floor(
        newPool
          .map((x) => x.time_to_beat)
          .filter((x) => x > 0)
          .reduce(
            (accumulator, current) => Math.min(accumulator, current),
            Number.MAX_SAFE_INTEGER
          )
      );
      settingsStore.setTtbMin(minTime);

      const maxTime = Math.ceil(
        newPool
          .map((x) => x.time_to_beat)
          .filter((x) => x > 0)
          .reduce((accumulator, current) => Math.max(accumulator, current), 0)
      );
      settingsStore.setTtbMax(maxTime);
    }
    setGamePool(shuffle(newPool));
    setCurrentIndex(0);
    setImgLoaded(false);
  }, [
    settingsStore.includeGotmRunnerUp,
    settingsStore.includeGotmWinners,
    settingsStore.includeRetrobits,
    settingsStore.includeRpgRunnerUp,
    settingsStore.includeRpgWinners,
    databaseStore.gotmRunnerUp,
    databaseStore.gotmWinners,
    databaseStore.retrobits,
    databaseStore.rpgRunnerUp,
    databaseStore.rpgWinners,
  ]);

  const handleFilterChange = (item: number, value: boolean) => {
    const filters = [
      settingsStore.includeGotmRunnerUp,
      settingsStore.includeGotmWinners,
      settingsStore.includeRetrobits,
      settingsStore.includeRpgRunnerUp,
      settingsStore.includeRpgWinners,
    ];
    filters[item] = value;
    if (filters.some((x) => x)) {
      switch (item) {
        case 0:
          settingsStore.setIncludeGotmRunnerUp(value);
          break;
        case 1:
          settingsStore.setIncludeGotmWinners(value);
          break;
        case 2:
          settingsStore.setIncludeRetrobits(value);
          break;
        case 3:
          settingsStore.setIncludeRpgRunnerUp(value);
          break;
        case 4:
          settingsStore.setIncludeRpgWinners(value);
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

  React.useEffect(() => {
    let filtered: Game[];
    if (
      settingsStore.ttbFilter[0] === settingsStore.ttbMin &&
      settingsStore.ttbFilter[1] === settingsStore.ttbMax
    ) {
      filtered = gamePool;
    } else {
      filtered = gamePool.filter(
        (x) =>
          x.time_to_beat >= settingsStore.ttbFilter[0] &&
          x.time_to_beat <= settingsStore.ttbFilter[1]
      );
    }
    setFilteredGamePool(filtered);
  }, [gamePool, settingsStore.ttbFilter]);

  const handleTtbFilterChange = (newValue, thumbIndex) => {
    settingsStore.setTtbFilter(newValue);
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
                    checked={settingsStore.includeGotmWinners}
                    onChange={() =>
                      handleFilterChange(1, !settingsStore.includeGotmWinners)
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
                    checked={settingsStore.includeGotmRunnerUp}
                    onChange={() =>
                      handleFilterChange(0, !settingsStore.includeGotmRunnerUp)
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
                    checked={settingsStore.includeRetrobits}
                    onChange={() =>
                      handleFilterChange(2, !settingsStore.includeRetrobits)
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
                    checked={settingsStore.includeRpgWinners}
                    onChange={() =>
                      handleFilterChange(4, !settingsStore.includeRpgWinners)
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
                    checked={settingsStore.includeRpgRunnerUp}
                    onChange={() =>
                      handleFilterChange(3, !settingsStore.includeRpgRunnerUp)
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
                  min={settingsStore.ttbMin}
                  max={settingsStore.ttbMax}
                  value={settingsStore.ttbFilter}
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
        src={getCurrentGame().img}
        style={{
          display: !!getCurrentGame()?.img && imgLoaded ? 'block' : 'none',
          margin: 'auto',
        }}
      />
      <section className="section">
        <h1 className="title has-text-centered">
          {
            [
              `🇺🇸 ${getCurrentGame().title.usa}`,
              `🌎 ${getCurrentGame().title.world}`,
              `🇪🇺 ${getCurrentGame().title.eu}`,
              `🇯🇵 ${getCurrentGame().title.jap}`,
              `🏳️ ${getCurrentGame().title.other}`,
            ].filter((x) => x.length > 5)[0]
          }
        </h1>
        <h2 className="subtitle has-text-centered">
          {[
            `🇺🇸 ${getCurrentGame().title.usa}`,
            `🌎 ${getCurrentGame().title.world}`,
            `🇪🇺 ${getCurrentGame().title.eu}`,
            `🇯🇵 ${getCurrentGame().title.jap}`,
            `🏳️ ${getCurrentGame().title.other}`,
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
                <span>{getCurrentGame().year}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile">🕹️</p>
              <p className="subtitle">
                <span className="is-hidden-tablet">🕹️</span>
                <span>{getCurrentGame().system}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile">🏢</p>
              <p className="subtitle">
                <span className="is-hidden-tablet">🏢</span>
                <span>{getCurrentGame().developer}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile">⏱️</p>
              <p className="subtitle">
                <span className="is-hidden-tablet">⏱️</span>
                <span>
                  {getCurrentGame().time_to_beat > 0
                    ? `${getCurrentGame().time_to_beat} hours`
                    : 'No data'}
                </span>
              </p>
            </div>
          </div>
        </div>
        <blockquote className="is-size-4 has-text-justified">
          {getCurrentGame().description}
        </blockquote>
      </section>
    </div>
  );
});

export default App;
