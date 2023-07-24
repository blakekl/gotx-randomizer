import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useStores } from '../../stores/useStores';

interface GameDisplayProps {
  imgLoaded: boolean;
  setImgLoaded: Function;
}

const GameDisplay = observer(
  ({ imgLoaded, setImgLoaded }: GameDisplayProps) => {
    const { randomizerStore } = useStores();
    const imgElement = React.useRef<HTMLImageElement>(null);
    const [mainTitle, setMainTitle] = React.useState('');
    const [subtitles, setSubtitles] = React.useState([]);
    const onImageLoaded = () => setImgLoaded(imgElement.current.complete);
    React.useEffect(() => {
      if (imgElement.current) {
        imgElement.current?.addEventListener('load', onImageLoaded);
        return () => {
          imgElement?.current?.removeEventListener('load', onImageLoaded);
        };
      }
    }, [imgElement]);

    React.useEffect(() => {
      setImgLoaded(false);
    }, [
      randomizerStore.includeGotmRunnerUp,
      randomizerStore.includeGotmWinners,
      randomizerStore.includeRetrobits,
      randomizerStore.includeRpgRunnerUp,
      randomizerStore.includeRpgWinners,
    ]);

    React.useEffect(() => {
      if (randomizerStore.currentGame) {
        const titles = randomizerStore.currentGame.title;
        const flaggedTitles = [
          titles.usa !== null
            ? `🇺🇸 ${randomizerStore.currentGame.title.usa}`
            : null,
          titles.world !== null
            ? `🌎 ${randomizerStore.currentGame.title.world}`
            : null,
          titles.eu !== null
            ? `🇪🇺 ${randomizerStore.currentGame.title.eu}`
            : null,
          titles.jap !== null
            ? `🇯🇵 ${randomizerStore.currentGame.title.jap}`
            : null,
          titles.other !== null
            ? `🏳️ ${randomizerStore.currentGame.title.other}`
            : null,
        ];
        setMainTitle(flaggedTitles.filter((x) => x)[0]);
        setSubtitles(flaggedTitles.filter((x) => x).slice(1));
      }
    }, [randomizerStore.currentGame]);

    return (
      <>
        <div
          className="loader"
          style={{ display: imgLoaded ? 'none' : 'block' }}
        ></div>
        <img
          ref={imgElement}
          src={randomizerStore.currentGame.img}
          style={{
            display:
              !!randomizerStore.currentGame?.img && imgLoaded
                ? 'block'
                : 'none',
            margin: 'auto',
          }}
        />
        <section className="section">
          <h1 className="title has-text-centered"> {mainTitle}</h1>
          {subtitles.length > 0 && (
            <h2 className="subtitle has-text-centered">
              {subtitles.map((x, index) => (
                <div key={index}>{x}</div>
              ))}
            </h2>
          )}
          <div className="level">
            <div className="level-item has-text-centered">
              <div>
                <p className="subtitle is-hidden-mobile">🗓️</p>
                <p className="subtitle">
                  <span className="is-hidden-tablet">🗓️</span>
                  <span>{randomizerStore.currentGame.year}</span>
                </p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="subtitle is-hidden-mobile">🕹️</p>
                <p className="subtitle">
                  <span className="is-hidden-tablet">🕹️</span>
                  <span>{randomizerStore.currentGame.system}</span>
                </p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="subtitle is-hidden-mobile">🏢</p>
                <p className="subtitle">
                  <span className="is-hidden-tablet">🏢</span>
                  <span>{randomizerStore.currentGame.developer}</span>
                </p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="subtitle is-hidden-mobile">⏱️</p>
                <p className="subtitle">
                  <span className="is-hidden-tablet">⏱️</span>
                  <span>
                    {randomizerStore.currentGame.time_to_beat > 0
                      ? `${randomizerStore.currentGame.time_to_beat} hours`
                      : 'No data'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <blockquote className="is-size-4 has-text-justified">
            {randomizerStore.currentGame.description}
          </blockquote>
        </section>
      </>
    );
  }
);

export default GameDisplay;
