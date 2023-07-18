import { toast } from 'bulma-toast';
import classNames = require('classnames');
import * as React from 'react';
import { useMediaQuery } from 'react-responsive';
import './style.css';
import { useData } from './hooks/useData';
import { Game } from './models/game';
import ReactSlider from 'react-slider';

export default function App() {
  const {
    isDbReady,
    gotmWinners,
    gotmRunnerUp,
    retrobits,
    rpgWinners,
    rpgRunnerUp,
  } = useData();
  const imgElement = React.useRef<HTMLImageElement>(null);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [showSettings, setShowSettings] = React.useState(true);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [includeGotmWinners, setIncludeGotmWinners] = React.useState(true);
  const [includeGotmRunnerUp, setIncludeGotmRunnerUp] = React.useState(true);
  const [includeRetrobits, setIncludeRetrobits] = React.useState(true);
  const [includeRpgWinners, setIncludeRpgWinners] = React.useState(true);
  const [includeRpgRunnerUp, setIncludeRpgRunnerUp] = React.useState(true);
  const [gamePool, setGamePool] = React.useState([]);
  const [filteredGamePool, setFilteredGamePool] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [ttbMin, setTtbMin] = React.useState(0);
  const [ttbMax, setTtbMax] = React.useState(0);
  const [ttbFilter, setTtbFilter] = React.useState([
    0,
    Number.MAX_SAFE_INTEGER,
  ]);
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

  const getCurrentGame = () =>
    gamePool && filteredGamePool.length > 0
      ? filteredGamePool[currentIndex]
      : emptyGame;

  const getNextGame = () => {
    setCurrentIndex((currentIndex + 1) % filteredGamePool.length);
    setImgLoaded(false);
  };
  const handleButtonClick = () => {
    getNextGame();
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
    if (!isDbReady) {
      return;
    }
    let newPool: Game[] = [];
    if (includeGotmRunnerUp) {
      newPool = newPool.concat(gotmRunnerUp);
    }
    if (includeGotmWinners) {
      newPool = newPool.concat(gotmWinners);
    }
    if (includeRetrobits) {
      newPool = newPool.concat(retrobits);
    }
    if (includeRpgRunnerUp) {
      newPool = newPool.concat(rpgRunnerUp);
    }
    if (includeRpgWinners) {
      newPool = newPool.concat(rpgWinners);
    }
    const minTime = Math.floor(
      newPool
        .map((x) => x.time_to_beat)
        .filter((x) => x > 0)
        .reduce(
          (accumulator, current) => Math.min(accumulator, current),
          Number.MAX_SAFE_INTEGER
        )
    );
    setTtbMin(minTime);
    const maxTime = Math.ceil(
      newPool
        .map((x) => x.time_to_beat)
        .filter((x) => x > 0)
        .reduce((accumulator, current) => Math.max(accumulator, current), 0)
    );
    setTtbMax(maxTime);
    setGamePool(shuffle(newPool));
    if (ttbFilter[0] < minTime || ttbFilter[1] > maxTime) {
      setTtbFilter([minTime, maxTime]);
    } else {
      setTtbFilter([...ttbFilter]);
    }
    setCurrentIndex(0);
    setImgLoaded(false);
  }, [
    isDbReady,
    includeGotmRunnerUp,
    includeGotmWinners,
    includeRetrobits,
    includeRpgRunnerUp,
    includeRpgWinners,
  ]);

  const handleFilterChange = (item: number, value: boolean) => {
    const updaters = [
      setIncludeGotmRunnerUp,
      setIncludeGotmWinners,
      setIncludeRetrobits,
      setIncludeRpgRunnerUp,
      setIncludeRpgWinners,
    ];
    const filters = [
      includeGotmRunnerUp,
      includeGotmWinners,
      includeRetrobits,
      includeRpgRunnerUp,
      includeRpgWinners,
    ];
    filters[item] = value;
    if (filters.some((x) => x)) {
      updaters[item](value);
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
    let filtered;
    if (ttbFilter[0] === ttbMin && ttbFilter[1] === ttbMax) {
      filtered = gamePool.filter(
        (x) =>
          x.time_to_beat < 0 ||
          (x.time_to_beat >= ttbFilter[0] && x.time_to_beat <= ttbFilter[1])
      );
    } else {
      filtered = gamePool.filter(
        (x) => x.time_to_beat >= ttbFilter[0] && x.time_to_beat <= ttbFilter[1]
      );
    }
    console.log(
      'filtered: ',
      filtered.map((x) => x.time_to_beat)
    );
    setFilteredGamePool(filtered);
  }, [ttbFilter]);

  const handleTtbFilterChange = (newValue, thumbIndex) => {
    setTtbFilter(newValue);
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
                    checked={includeGotmWinners}
                    onChange={() => handleFilterChange(1, !includeGotmWinners)}
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
                    checked={includeGotmRunnerUp}
                    onChange={() => handleFilterChange(0, !includeGotmRunnerUp)}
                  ></input>
                  GotM Runner Ups
                </label>
              </div>
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={includeRetrobits}
                    onChange={() => handleFilterChange(2, !includeRetrobits)}
                  ></input>
                  Retrobits
                </label>
              </div>
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={includeRpgWinners}
                    onChange={() => handleFilterChange(4, !includeRpgWinners)}
                  ></input>
                  RPGotQ Winners
                </label>
              </div>
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={includeRpgRunnerUp}
                    onChange={() => handleFilterChange(3, !includeRpgRunnerUp)}
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
                  defaultValue={[ttbMin, ttbMax]}
                  onAfterChange={(newValues, thumbIndex) =>
                    handleTtbFilterChange(newValues, thumbIndex)
                  }
                  min={ttbMin}
                  max={ttbMax}
                  value={ttbFilter}
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
            .map((title) => (
              <div>{title}</div>
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
}
