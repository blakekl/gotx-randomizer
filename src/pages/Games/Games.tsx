import { useEffect, useState } from 'react';
import { useStores } from '../../stores/useStores';
import { Game } from '../../models/game';
import Pagination from '../../components/Pagination';

const Games = () => {
  const { dbStore } = useStores();
  const { allGames } = dbStore;
  const [gameList, setGameList] = useState(new Array<Game>());
  const [indexRange, setIndexRange] = useState([0, 0]);
  const [titleFilter, setTitleFilter] = useState('');

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
    if (titleFilter.length > 3) {
      newPoolArray = newPoolArray.filter(x => [x.title_eu, x.title_jap, x.title_other, x.title_usa, x.title_world].map(x => x?.toLocaleLowerCase()).join().match(`.*${titleFilter}.*`));
    }
    setGameList(newPoolArray);
  }, [allGames, titleFilter]);

  return (
    <>
      <h1 className="title has-text-centered">Games</h1>
      <div className="field">
        <p className='control has-icons-left'>
          <input className='input' type='text' placeholder='game title' value={titleFilter} onChange={(e) => setTitleFilter(e.currentTarget.value.toLocaleLowerCase())} />
          <span className='icon is-small is-left'>
            <i className='fas fa-search' />
          </span> 
        </p>
      </div>
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
