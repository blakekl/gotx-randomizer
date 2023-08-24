import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/useStores';
import { useEffect, useRef, useState } from 'react';

interface GameDisplayProps {
  imgLoaded: boolean;
  setImgLoaded: (loaded: boolean) => void;
}

const GameDisplay = observer(
  ({ imgLoaded, setImgLoaded }: GameDisplayProps) => {
    const { randomizerStore } = useStores();
    const imgElement = useRef<HTMLImageElement>(null);
    const [mainTitle, setMainTitle] = useState('');
    const [subtitles, setSubtitles] = useState(new Array<string>());
    useEffect(() => {
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

    useEffect(() => {
      setImgLoaded(false);
    }, [
      randomizerStore.includeGotmRunnerUp,
      randomizerStore.includeGotmWinners,
      randomizerStore.includeRetrobits,
      randomizerStore.includeRpgRunnerUp,
      randomizerStore.includeRpgWinners,
      setImgLoaded,
    ]);

    useEffect(() => {
      const game = randomizerStore.currentGame;
      const titles = {
        usa: game.title_usa,
        world: game.title_world,
        eu: game.title_eu,
        jap: game.title_jap,
        other: game.title_other,
      };
      const flaggedTitles: string[] = [];
      titles.usa && flaggedTitles.push(`🇺🇸 ${titles.usa}`);
      titles.world && flaggedTitles.push(`🌎 ${titles.world}`);
      titles.eu && flaggedTitles.push(`🇪🇺 ${titles.eu}`);
      titles.jap && flaggedTitles.push(`🇯🇵 ${titles.jap}`);
      titles.other && flaggedTitles.push(`🏳️ ${titles.other}`);

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
                    {randomizerStore.currentGame.time_to_beat || 0 > 0
                      ? `${randomizerStore.currentGame.time_to_beat} hours`
                      : 'No data'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {randomizerStore.nominations.map((nomination, index) => (
          <article className="media" key={index}>
            <div className="media-content">
              <div className="content">
                <blockquote>
                  <div className="level">
                    {nomination.user_name && (
                      <div className="level-item">
                        <strong>Nominator: {nomination.user_name}</strong>
                      </div>
                    )}

                    <div className="level-item">
                      <strong>{nomination.date}</strong>
                    </div>

                    {nomination.theme_title && (
                      <div className="level-item">
                        <strong>Theme: {nomination.theme_title}</strong>
                      </div>
                    )}
                  </div>
                  <p>{nomination.game_description}</p>
                </blockquote>
              </div>
            </div>
          </article>
        ))}
      </>
    );
  },
);

export default GameDisplay;
