import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import Settings from './Settings';
import GameDisplay from './GameDisplay/GameDisplay';
import { useStores } from '../../stores/useStores';
import { useState } from 'react';

const Randomizer = observer(() => {
  const { randomizerStore } = useStores();
  const [imgLoaded, setImgLoaded] = useState(false);

  const rollButtonClick = () => {
    setImgLoaded(false);
    randomizerStore.nextGame();
  };

  const handleToggleClick = () => {
    randomizerStore.toggleGameHidden();
    rollButtonClick();
  };

  const noGame = (
    <>
      <Settings />
      <div className="notification mt-6 has-text-centered">
        There are no games left in the pool. They have either all been hidden, or
        you have removed all game types in settings. Please check settings and try again.
      </div>
    </>
  );
  
  const hasGame = (
    <>
      <Settings />
      <div className="mt-4 buttons has-addons is-centered">
        <button
          className={classNames({
            button: true,
            'is-primary': true,
            rollBtn: true,
          })}
          onClick={rollButtonClick}
          disabled={randomizerStore.filteredGamePool.length < 2}
        >
          <span>Reroll</span>
          {!imgLoaded && (
            <span className="icon is-small">
              <span className="loader"></span>
            </span>
          )}
        </button>
        <button className="button is-danger" onClick={handleToggleClick}>
          { randomizerStore.isGameHidden ? 'Unhide Game' : 'Hide Game' }
        </button>
      </div>
      <GameDisplay imgLoaded={imgLoaded} setImgLoaded={setImgLoaded} />
    </>
  );

  if (randomizerStore.currentGame.id > 0) {
    return hasGame;
  } else {
    return noGame;
  }
});

export default Randomizer;
