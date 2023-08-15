import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import Settings from "./Settings";
import GameDisplay from "./GameDisplay";
import { useStores } from "../../stores/useStores";

const Randomizer = observer(() => {
  const { randomizerStore } = useStores();
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const handleButtonClick = () => {
    setImgLoaded(false);
    randomizerStore.nextGame();
  };

  return (
    <>
      <Settings />
      <div className="has-text-centered">
        <button
          className={classNames({
            button: true,
            "is-primary": true,
            rollBtn: true,
            "is-fullwidth": isMobile,
            "is-large": !isMobile,
          })}
          onClick={() => { handleButtonClick(); }}
        >
          {imgLoaded && <span>Reroll</span>}
          {!imgLoaded && (
            <span className="icon is-small">
              <span className="loader"></span>
            </span>
          )}
        </button>
      </div>
      <GameDisplay imgLoaded={imgLoaded} setImgLoaded={setImgLoaded} />
    </>
  );
});

export default Randomizer;
