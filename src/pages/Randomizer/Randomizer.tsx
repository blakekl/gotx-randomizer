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

  const handleHideClick = () => {
    randomizerStore.hideCurrentGame();
    rollButtonClick();
  }

  return (
    <>
      <Settings />
      <div className="mt-4 buttons is-centered has-addons is-fullwidth">
        <button
          className={classNames({
            button: true,
            'is-primary': true,
            rollBtn: true,
          })}
          onClick={rollButtonClick}
        >
          <span>Reroll</span>
          {!imgLoaded && (
            <span className="icon is-small">
              <span className="loader"></span>
            </span>
          )}
        </button>
        <button className="button is-danger" onClick={handleHideClick}>Hide Game</button>
      </div>
      <GameDisplay imgLoaded={imgLoaded} setImgLoaded={setImgLoaded} />
    </>
  );
});

export default Randomizer;
