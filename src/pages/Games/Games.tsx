import { useEffect, useState } from 'react';
import { useStores } from '../../stores/useStores';
import { Game } from '../../models/game';
import Pagination from '../../components/Pagination';

const Games = () => {
  const { dbStore } = useStores();
  const { allGames } = dbStore;
  const [gameList, setGameList] = useState(new Array<Game>());
  const [indexRange, setIndexRange] = useState([0, 0]);

  useEffect(() => {
    let newPoolArray: Game[] = [];
    newPoolArray = [
      ...newPoolArray,
      ...allGames.gotmRunnerUp,
      ...allGames.gotmWinners,
      ...allGames.retrobits,
      ...allGames.rpgRunnerUp,
      ...allGames.rpgWinners,
    ];
    newPoolArray = newPoolArray.filter(
      (game, index, list) => index === list.findIndex((x) => x.id === game.id),
    );
    setGameList(newPoolArray);
  }, [allGames]);

  return (
    <>
      <h1 className="title has-text-centered">Games</h1>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {gameList.slice(indexRange[0], indexRange[1]).map((x) => (
            <tr key={x.id}>
              <td>
                {[
                  x.title_world,
                  x.title_usa,
                  x.title_eu,
                  x.title_jap,
                  x.title_other,
                ].filter((x) => x !== '')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        count={gameList.length}
        onPageChange={setIndexRange}
      ></Pagination>
    </>
  );
};

export default Games;
