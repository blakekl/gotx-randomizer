import { useMemo, useState } from 'react';
import { useStores } from '../../stores/useStores';
import { Game } from '../../models/game';
import Pagination from '../../components/Pagination';
import classNames from 'classnames';
import GameDisplay from '../Randomizer/GameDisplay/GameDisplay';
import Settings from '../Randomizer/Settings/Settings';
import { observer } from 'mobx-react-lite';

const Games = observer(() => {
  const { dbStore, settingsStore } = useStores();
  const { allGames } = dbStore;
  const [gameList, setGameList] = useState(new Array<Game>());
  const [indexRange, setIndexRange] = useState([0, 0]);
  const [titleFilter, setTitleFilter] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [hovered, setHovered] = useState(0);

  const gamePool = useMemo(() => {
    let newPool: Game[] = [];
    if (settingsStore.includeGotmRunnerUp) {
      newPool = newPool.concat(allGames.gotmRunnerUp);
    }
    if (settingsStore.includeGotmWinners) {
      newPool = newPool.concat(allGames.gotmWinners);
    }
    if (settingsStore.includeRetrobits) {
      newPool = newPool.concat(allGames.retrobits);
    }
    if (settingsStore.includeRpgRunnerUp) {
      newPool = newPool.concat(allGames.rpgRunnerUp);
    }
    if (settingsStore.includeRpgWinners) {
      newPool = newPool.concat(allGames.rpgWinners);
    }

    // Remove duplicates, since there is overlap between the different programs.
    newPool = newPool.filter(
      (game, index, list) => index === list.findIndex((x) => x.id === game.id),
    );

    const newMax =
      newPool
        .map((x) => x.time_to_beat)
        .reduce(
          (aggregate: number, current) => Math.max(aggregate, current || 0),
          0,
        ) || Number.MAX_SAFE_INTEGER;
    const newMin =
      newPool
        .map((x) => x.time_to_beat)
        .filter((x) => x || x === 0)
        .filter((x) => x && x > -1)
        .reduce(
          (aggregate: number, current) =>
            Math.min(aggregate, Math.round(current || 0)),
          Number.MAX_SAFE_INTEGER,
        ) || 0;

    if (newMax !== newMin) {
      settingsStore.setHltbMax(newMax);
      settingsStore.setHltbMin(newMin);
    }

    newPool = newPool
      .filter(
        (x) =>
          settingsStore.includeHiddenGames ||
          settingsStore.hiddenGames.includes(x.id) === false,
      )
      .filter(
        (x) =>
          (x.time_to_beat || 0) >= settingsStore.hltbFilter[0] &&
          (x.time_to_beat || 0) <= settingsStore.hltbFilter[1],
      );
    return newPool;
  }, [
    allGames,
    settingsStore.includeGotmRunnerUp,
    settingsStore.includeGotmWinners,
    settingsStore.includeRetrobits,
    settingsStore.includeRpgRunnerUp,
    settingsStore.includeRpgWinners,
    settingsStore.includeHiddenGames,
    settingsStore.hiddenGames,
    settingsStore.hltbFilter,
  ]);

  useMemo(() => {
    const escapeRegex = /[.*+?^${}()|[\]\\]/g;
    const escapedFilter = titleFilter
      .trim()
      .toLocaleLowerCase()
      .replace(escapeRegex, '\\$&');
    const filteredPool = gamePool.filter((x) =>
      [x.title_eu, x.title_jap, x.title_other, x.title_usa, x.title_world]
        .map((x) => x?.toLocaleLowerCase())
        .join()
        .match(`.*${escapedFilter}.*`),
    );
    setGameList(filteredPool);
  }, [gamePool, titleFilter]);

  const handleRowClicked = (e: React.MouseEvent, game: Game) => {
    let element: HTMLElement | null = e.target as HTMLElement;
    let isButton = false;
    while (!isButton && element?.tagName !== 'TD') {
      isButton = (element as HTMLElement).tagName === 'BUTTON';
      if (isButton) {
        if ((e.target as HTMLElement).textContent?.trim() === 'Copy') {
          void navigator.clipboard.writeText(`${game.screenscraper_id}`);
        } else {
          settingsStore.toggleHiddenGame(game.id);
        }
      }
      element = element?.parentElement || null;
    }
    if (!isButton) {
      setSelectedGame(game);
    }
  };

  return (
    <>
      <h1 className="title is-1 has-text-centered">Games</h1>
      <Settings />
      <div className="field mt-4">
        <p className="control has-icons-left">
          <input
            className="input"
            type="text"
            placeholder="game title"
            value={titleFilter}
            onChange={(e) =>
              setTitleFilter(e.currentTarget.value.toLocaleLowerCase())
            }
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search" />
          </span>
        </p>
      </div>
      <table className="table is-hoverable is-striped is-fullwidth is-narrow">
        <thead>
          <tr className="title is-3 is-primary">
            <th className="">Title</th>
            <th className="has-text-right">ID</th>
            <th className="has-text-right">Hide</th>
          </tr>
        </thead>
        <tbody>
          {gameList.slice(indexRange[0], indexRange[1]).map((x) => (
            <tr
              key={x.id}
              // onClick={() => setSelectedGame(x)}
              onClick={(e) => handleRowClicked(e, x)}
              className={classNames({
                'is-selected':
                  (selectedGame && x.id === selectedGame.id) ||
                  hovered === x.id,
              })}
              onMouseEnter={() => setHovered(x.id)}
              onMouseLeave={() => setHovered(0)}
            >
              <td>
                {[
                  x.title_other,
                  x.title_jap,
                  x.title_eu,
                  x.title_usa,
                  x.title_world,
                ]
                  .filter((x) => x && x?.length > 0)
                  .pop()}
              </td>
              <td className="has-text-right">
                <button
                  title="copy screenscraper id "
                  className="button is-secondary has-tooltip-active"
                >
                  <span className="icon is-small">
                    <i className="fa-solid fa-copy"></i>
                  </span>
                  <span>Copy</span>
                </button>
              </td>
              <td className="has-text-right">
                <button
                  title="Hides game in randomizer"
                  className={classNames({
                    button: true,
                    'is-small': true,
                    'is-danger':
                      !settingsStore.hiddenGames.includes(x.id) || false,
                    'is-success':
                      settingsStore.hiddenGames.includes(x.id) || true,
                  })}
                  // onClick={(e) => {e.preventDefault(); settingsStore.toggleHiddenGame(x.id);}}
                >
                  {settingsStore.hiddenGames.includes(x.id) ? 'Unhide' : 'Hide'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        count={gameList.length}
        onPageChange={setIndexRange}
      ></Pagination>

      <div
        className={classNames({
          modal: true,
          'is-active': selectedGame !== null,
        })}
      >
        <div
          className="modal-background"
          onClick={() => setSelectedGame(null)}
        ></div>
        <div className="modal-content">
          {selectedGame && <GameDisplay game={selectedGame}></GameDisplay>}
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setSelectedGame(null)}
        ></button>
      </div>
    </>
  );
});

export default Games;
