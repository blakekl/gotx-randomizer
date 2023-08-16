import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useStores } from '../../stores/useStores';

interface GameDisplayProps {
  imgLoaded: boolean;
  setImgLoaded: (loaded: boolean) => void;
}

const GameDisplay = observer(
  ({ imgLoaded, setImgLoaded }: GameDisplayProps) => {
    const { randomizerStore } = useStores();
    const imgElement = React.useRef<HTMLImageElement>(null);
    const [mainTitle, setMainTitle] = React.useState('');
    const [subtitles, setSubtitles] = React.useState(new Array<string>());
    React.useEffect(() => {
      const onImageLoaded = () =>
        setImgLoaded(imgElement.current?.complete || false);
      const element = imgElement.current;
      if (element) {
        imgElement.current?.addEventListener('load', onImageLoaded);
        return () => {
          element.removeEventListener('load', onImageLoaded);
        };
      }
    }, [imgElement, setImgLoaded]);

    React.useEffect(() => {
      setImgLoaded(false);
    }, [
      randomizerStore.includeGotmRunnerUp,
      randomizerStore.includeGotmWinners,
      randomizerStore.includeRetrobits,
      randomizerStore.includeRpgRunnerUp,
      randomizerStore.includeRpgWinners,
      setImgLoaded,
    ]);

    React.useEffect(() => {
      const titles = randomizerStore.currentGame.title;
      const flaggedTitles: string[] = [];
      if (titles.usa !== '') {
        flaggedTitles.push(`🇺🇸 ${randomizerStore.currentGame.title.usa}`);
      }
      if (titles.world !== '') {
        flaggedTitles.push(`🌎 ${randomizerStore.currentGame.title.world}`);
      }
      if (titles.eu !== '') {
        flaggedTitles.push(`🇪🇺 ${randomizerStore.currentGame.title.eu}`);
      }
      if (titles.jap !== '') {
        flaggedTitles.push(`🇯🇵 ${randomizerStore.currentGame.title.jap}`);
      }
      if (titles.other !== '') {
        flaggedTitles.push(`🏳️ ${randomizerStore.currentGame.title.other}`);
      }

      setMainTitle(flaggedTitles[0] || '');
      setSubtitles(flaggedTitles.slice(1));
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
  },
);

export default GameDisplay;
