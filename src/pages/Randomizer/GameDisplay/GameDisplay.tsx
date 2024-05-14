import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores/useStores';
import { useEffect, useRef, useState } from 'react';
import NominationList from './NominationList';
import { Game } from '../../../models/game';

interface GameDisplayProps {
  game: Game;
}

const GameDisplay = observer(({ game }: GameDisplayProps) => {
  const { settingsStore, dbStore } = useStores();
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgElement = useRef<HTMLImageElement>(null);
  const [mainTitle, setMainTitle] = useState('');
  const [subtitles, setSubtitles] = useState(new Array<string>());

  useEffect(() => {
    setImgLoaded(false);
  }, [game]);

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
    settingsStore.includeGotmRunnerUp,
    settingsStore.includeGotmWinners,
    settingsStore.includeRetrobits,
    settingsStore.includeRpgRunnerUp,
    settingsStore.includeRpgWinners,
    setImgLoaded,
  ]);

  useEffect(() => {
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
  }, [game]);

  return (
    <>
      <div
        className="loader"
        style={{ display: imgLoaded ? 'none' : 'block' }}
      ></div>
      <img
        ref={imgElement}
        src={game.img_url}
        style={{
          display: !!game?.img_url && imgLoaded ? 'block' : 'none',
          margin: 'auto',
        }}
      />
      <section className="section">
        <h1 className="title has-text-centered">{mainTitle}</h1>
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
              <p className="subtitle is-hidden-mobile" title="release year">
                🗓️
              </p>
              <p className="subtitle">
                <span className="is-hidden-tablet" title="release year">
                  🗓️
                </span>
                <span>{game.year}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile" title="developer">
                🕹️
              </p>
              <p className="subtitle">
                <span className="is-hidden-tablet" title="developer">
                  🕹️
                </span>
                <span>{game.system}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile" title="publisher">
                🏢
              </p>
              <p className="subtitle">
                <span className="is-hidden-tablet" title="publisher">
                  🏢
                </span>
                <span>{game.developer}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile" title="time to beat">
                ⏱️
              </p>
              <p className="subtitle">
                <span className="is-hidden-tablet" title="time to beat">
                  ⏱️
                </span>
                <span>
                  {game.time_to_beat || 0 > 0
                    ? `${game.time_to_beat} hours`
                    : 'No data'}
                </span>
              </p>
            </div>
          </div>
          {game.screenscraper_id && (
            <div className="level-item has-text-centered">
              <div>
                <p
                  className="subtitle is-hidden-mobile"
                  title="screenscraper id"
                >
                  🆔
                </p>
                <p className="subtitle" title="screenscraper id">
                  <span className="is-hidden-tablet">🆔</span>
                  <span>{game.screenscraper_id}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <NominationList
        nominations={dbStore.getNominationsByGame(game.id)}
      ></NominationList>
    </>
  );
});

export default GameDisplay;
