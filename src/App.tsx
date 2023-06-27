import classNames = require('classnames');
import * as React from 'react';
import useMediaQuery from 'react-responsive';
import { GameData } from './models/gameData.model';
import { gotmRunnerUp } from './resources/gotmRunnerUp';
import { gotmWinners } from './resources/gotmWinners';
import { retrobits } from './resources/retrobits';
import { rpgRunnerUp } from './resources/rpgRunnerUp';
import { rpgWinner } from './resources/rpgWinners';
import './style.css';

export default function App() {
  const imgEl = React.useRef<HTMLImageElement>(null);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [showSettings, setShowSettings] = React.useState(true);
  const [loaded, setLoaded] = React.useState(false);
  const [includeGotmWinners, setIncludeGotmWinners] = React.useState(true);
  const [includeGotmRunnerUp, setIncludeGotmRunnerUp] = React.useState(false);
  const [includeRetrobits, setIncludeRetrobits] = React.useState(false);
  const [includeRpgWinners, setIncludeRpgWinners] = React.useState(false);
  const [includeRpgRunnerUp, setIncludeRpgRunnerUp] = React.useState(false);
  const [gamePool, setGamePool] = React.useState(
    gotmWinners.filter((x) => x.img)
  );
  const [currentIndex, setCurrentIndex] = React.useState(
    Math.floor(Math.random() * gamePool.length)
  );

  const getNextGame = () =>
    setCurrentIndex((currentIndex + 1) % gamePool.length);
  const [game, setGame] = React.useState(gamePool[currentIndex]);
  const handleButtonClick = () => {
    setLoaded(false);
    getNextGame();
  };

  React.useEffect(() => {
    const newGame = gamePool[currentIndex];
    setGame(newGame);
  }, [currentIndex]);

  const onImageLoaded = () => setLoaded(imgEl.current.complete);
  React.useEffect(() => {
    const imgElCurrent = imgEl.current;

    if (imgElCurrent) {
      imgElCurrent.addEventListener('load', onImageLoaded);
      return () => {
        imgElCurrent.removeEventListener('load', onImageLoaded);
      };
    }
  }, [imgEl]);

  const shuffle = (inputArray) => {
    const outputArray = [...inputArray];
    for (let i = outputArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [outputArray[i], outputArray[j]] = [outputArray[j], outputArray[i]];
    }
    return outputArray;
  };

  React.useEffect(() => {
    let newPool: GameData[] = [];
    if (includeGotmRunnerUp) {
      newPool = newPool.concat(gotmRunnerUp.filter((x) => x.img));
    }
    if (includeGotmWinners) {
      newPool = newPool.concat(gotmWinners.filter((x) => x.img));
    }
    if (includeRetrobits) {
      newPool = newPool.concat(retrobits.filter((x) => x.img));
    }
    if (includeRpgRunnerUp) {
      newPool = newPool.concat(rpgRunnerUp.filter((x) => x.img));
    }
    if (includeRpgWinners) {
      newPool = newPool.concat(rpgWinner.filter((x) => x.img));
    }
    const shuffledPool = shuffle(newPool);
    setGamePool(shuffledPool);
    setLoaded(false);
    setCurrentIndex(0);
    setGame(shuffledPool[0]);
  }, [
    includeGotmRunnerUp,
    includeGotmWinners,
    includeRetrobits,
    includeRpgRunnerUp,
    includeRpgWinners,
  ]);

  console.log('isMobile: ', isMobile);

  return (
    <div>
      <section className="section">
        <div
          className={classNames({
            dropdown: true,
            'is-active': showSettings,
          })}
        >
          <div className="dropdown-trigger">
            <button
              className="button"
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
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={includeGotmWinners}
                  onChange={() => setIncludeGotmWinners(!includeGotmWinners)}
                ></input>
                GotM Winners
              </label>{' '}
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  name="GotM Runner Ups"
                  checked={includeGotmRunnerUp}
                  onChange={() => setIncludeGotmRunnerUp(!includeGotmRunnerUp)}
                ></input>
                GotM Runner Ups
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={includeRetrobits}
                  onChange={() => setIncludeRetrobits(!includeRetrobits)}
                ></input>
                Retrobits
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={includeRpgWinners}
                  onChange={() => setIncludeRpgWinners(!includeRpgWinners)}
                ></input>
                RPGotQ Winners
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={includeRpgRunnerUp}
                  onChange={() => setIncludeRpgRunnerUp(!includeRpgRunnerUp)}
                ></input>
                RPGotQ Runner Ups
              </label>
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
            })}
            onClick={() => handleButtonClick()}
          >
            Reroll {!loaded && <span className="loader"></span>}
          </button>
        </div>
        <div
          className="loader"
          style={{ display: loaded ? 'none' : 'block' }}
        ></div>
        <img
          ref={imgEl}
          src={game.img}
          style={{
            display: !!game.img && loaded ? 'block' : 'none',
            margin: 'auto',
          }}
        />
      </section>
      <section className="section">
        <h1 className="title has-text-centered">🎮 {game.title}</h1>
        <h2 className="subtitle has-text-centered">
          🗓️ {game.year} &bull; 🕹️ {game.system} &bull; 🏢 {game.developer}{' '}
          &bull; ⏱️{' '}
          {game.timeToBeat < Number.MAX_SAFE_INTEGER
            ? `~${game.timeToBeat} hours`
            : 'No data'}
        </h2>
        <blockquote>{game.description}</blockquote>
      </section>
    </div>
  );
}
