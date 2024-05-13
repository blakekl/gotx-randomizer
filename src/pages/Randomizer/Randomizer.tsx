import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Settings from './Settings/Settings';
import GameDisplay from './GameDisplay/GameDisplay';
import { useStores } from '../../stores/useStores';
import { Game } from '../../models/game';

const Randomizer = observer(() => {
  const { dbStore, settingsStore } = useStores();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [gamePool, setGamePool] = useState(new Array<Game>());
  const games = dbStore.allGames;

  useEffect(() => {
    let newPoolArray: Game[] = [];
    if (settingsStore.includeGotmRunnerUp) {
      newPoolArray = [...newPoolArray, ...games.gotmRunnerUp];
    }
    if (settingsStore.includeGotmWinners) {
      newPoolArray = [...newPoolArray, ...games.gotmWinners];
    }
    if (settingsStore.includeRetrobits) {
      newPoolArray = [...newPoolArray, ...games.retrobits];
    }
    if (settingsStore.includeRpgRunnerUp) {
      newPoolArray = [...newPoolArray, ...games.rpgRunnerUp];
    }
    if (settingsStore.includeRpgWinners) {
      newPoolArray = [...newPoolArray, ...games.rpgWinners];
    }
    newPoolArray = newPoolArray.filter((game, index, list) => index === list.findIndex(x => x.id === game.id));

    const newMax = newPoolArray
      .map((x) => x.time_to_beat)
      .reduce((aggregate: number, current) => Math.max(aggregate, current || 0), 0,) || Number.MAX_SAFE_INTEGER;
    const newMin = newPoolArray
      .map((x) => x.time_to_beat)
      .filter((x) => x || x === 0)
      .filter((x) => x && x > -1)
      .reduce((aggregate: number, current) => Math.min(aggregate, Math.round(current || 0)), Number.MAX_SAFE_INTEGER) || 0;

    if (newMax !== newMin) {
      settingsStore.setHltbMax(newMax);
      settingsStore.setHltbMin(newMin);
    }

    const newPoolFiltered = newPoolArray
      .filter(x => settingsStore.includeHiddenGames || settingsStore.hiddenGames.includes(x.id) === false)
      .filter(x => (x.time_to_beat || 0) >= settingsStore.hltbFilter[0] && (x.time_to_beat || 0) <= settingsStore.hltbFilter[1])
      .map(value => ({value, sort: Math.random() }))
      .sort((a,b) => a.sort - b.sort)
      .map(({value}) => value);

    setGamePool(newPoolFiltered);
    setCurrentGameIndex(0);
  }, [
    settingsStore.includeGotmRunnerUp,
    settingsStore.includeGotmWinners,
    settingsStore.includeRetrobits,
    settingsStore.includeRpgRunnerUp,
    settingsStore.includeRpgWinners,
    settingsStore.includeHiddenGames,
    settingsStore.hltbFilter,
    games.gotmRunnerUp,
    games.gotmWinners,
    games.retrobits,
    games.rpgRunnerUp,
    games.rpgWinners,
  ]);

  const nextGame = () => {
    setImgLoaded(false);
    let newIndex = currentGameIndex;
    newIndex++;
    if (newIndex >= gamePool.length) {
      newIndex = 0;
    }
    setCurrentGameIndex(newIndex);
  };

  const noGame = (
    <>
      <Settings />
      <div className="notification mt-6 has-text-centered">
        There are no games left in the pool. They have either all been hidden,
        or you have removed all game types in settings. Please check settings
        and try again.
      </div>
    </>
  );

  const hasGame = (
    <>
      <h1 className="title has-text-centered">Randomizer</h1>
      <Settings />
      <div className="mt-4 buttons has-addons is-centered">
        <button
          className={classNames({
            button: true,
            'is-primary': true,
            rollBtn: true,
          })}
          onClick={nextGame}
          disabled={gamePool.length < 2}
        >
          <span>Reroll</span>
          {!imgLoaded && (
            <span className="icon is-small">
              <span className="loader"></span>
            </span>
          )}
        </button>
        <button
          className={classNames({
            button: true,
            'is-danger': !settingsStore.hiddenGames.includes(gamePool[currentGameIndex]?.id) || false,
            'is-success': settingsStore.hiddenGames.includes(gamePool[currentGameIndex]?.id) || true,
          })}
          onClick={() => settingsStore.toggleHiddenGame(gamePool[currentGameIndex].id)}
        >
          {settingsStore.hiddenGames.includes(gamePool[currentGameIndex]?.id) || false ? 'Unhide Game' : 'Hide Game'}
        </button>
      </div>
      <GameDisplay imgLoaded={imgLoaded} setImgLoaded={setImgLoaded} game={gamePool[currentGameIndex]} />
    </>
  );

  if (gamePool.length > 0) {
    return hasGame;
  } else {
    return noGame;
  }
});

export default Randomizer;
