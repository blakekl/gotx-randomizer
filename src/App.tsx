import * as React from 'react';
import { GameData } from './models/gameData.model';
import { gotmRunnerUp } from './resources/gotmRunnerUp';
import { gotmWinners } from './resources/gotmWinners';
import { retrobits } from './resources/retrobits';
import { rpgRunnerUp } from './resources/rpgRunnerUp';
import { rpgWinner } from './resources/rpgWinners';
import './style.css';

export default function App() {
  const imgEl = React.useRef<HTMLImageElement>(null);
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
    setGamePool(shuffle(newPool));
    setLoaded(false);
    setCurrentIndex(0);
  }, [
    includeGotmRunnerUp,
    includeGotmWinners,
    includeRetrobits,
    includeRpgRunnerUp,
    includeRpgWinners,
  ]);

  return (
    <div>
      <section className="section">
        <p>Select which game lists to include</p>
        <div>
          <label className="checkbox">
            <input
              type="checkbox"
              className="checkbox"
              checked={includeGotmWinners}
              onChange={() => setIncludeGotmWinners(!includeGotmWinners)}
            ></input>
            GotM Winners
          </label>{' '}
        </div>
        <div>
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
        </div>
        <div>
          <label className="checkbox">
            <input
              type="checkbox"
              className="checkbox"
              checked={includeRetrobits}
              onChange={() => setIncludeRetrobits(!includeRetrobits)}
            ></input>
            Retrobits
          </label>
        </div>
        <div>
          <label className="checkbox">
            <input
              type="checkbox"
              className="checkbox"
              checked={includeRpgWinners}
              onChange={() => setIncludeRpgWinners(!includeRpgWinners)}
            ></input>
            RPG of the Quarter Winners
          </label>
        </div>
        <div>
          <label className="checkbox">
            <input
              type="checkbox"
              className="checkbox"
              checked={includeRpgRunnerUp}
              onChange={() => setIncludeRpgRunnerUp(!includeRpgRunnerUp)}
            ></input>
            RPG of the Quarter Runner Ups
          </label>
        </div>
      </section>
      <button className="button" onClick={() => handleButtonClick()}>
        Reroll {!loaded && <span className="loader"></span>}
      </button>
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
      <section className="section">
        <h1 className="title has-text-centered">🎮 {game.title}</h1>
        <h2 className="subtitle has-text-centered">
          🗓️ {game.year} &bull; 🕹️ {game.system} &bull; 🏢 {game.developer}
        </h2>
        <p>{game.description}</p>
      </section>
    </div>
  );
}
