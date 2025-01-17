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
  const [mainTitle, setMainTitle] = useState<JSX.Element | null>(null);
  const [subtitles, setSubtitles] = useState(new Array<JSX.Element>());

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
    const flaggedTitles: JSX.Element[] = [];
    titles.usa && flaggedTitles.push((<><span className="fi fi-us"></span> <span>{titles.usa}</span></>));
    titles.world && flaggedTitles.push(<><span className="fi fi-un"></span> <span>{titles.world}</span></>);
    titles.eu && flaggedTitles.push(<><span className="fi fi-eu"></span> <span>{titles.eu}</span></>);
    titles.jap && flaggedTitles.push((<><span className="fi fi-jp"></span> <span>{titles.jap}</span></>));
    titles.other && flaggedTitles.push(<><span className="fi fi-world"></span> <span>{titles.other}</span></>);

    setMainTitle(flaggedTitles[0] || null);
    setSubtitles(flaggedTitles.slice(1));
  }, [game]);

  return (
    <div data-gameid={game.id}>
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
        <h1 className="title is-1 has-text-centered mb-6">{mainTitle}</h1>
        {subtitles.length > 0 && (
          <h2 className="subtitle is-2 has-text-centered">
            {subtitles.map((x, index) => (
              <div key={index}>{x}</div>
            ))}
          </h2>
        )}
        <div className="level">
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile" title="release year">
                <span className="fa-solid fa-calendar" />
              </p>
              <p className="subtitle">
                <span className="is-hidden-tablet" title="release year">
                  <span className="fa-solid fa-calendar" />
                </span>
                <span>{game.year}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile" title="developer">
                <span className="fa-solid fa-gamepad" />
              </p>
              <p className="subtitle">
                <span className="is-hidden-tablet" title="developer">
                  <span className="fa-solid fa-gamepad" />
                </span>
                <span>{game.system}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile" title="publisher">
                <span className="fa-solid fa-building" />
              </p>
              <p className="subtitle">
                <span className="is-hidden-tablet" title="publisher">
                  <span className="fa-solid fa-building" />
                </span>
                <span>{game.developer}</span>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="subtitle is-hidden-mobile" title="time to beat">
                <span className="fa-solid fa-clock" />
              </p>
              <p className="subtitle">
                <span className="is-hidden-tablet" title="time to beat">
                  <span className="fa-solid fa-clock" />
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
                  <span className="fa-solid fa-hashtag" />
                </p>
                <p className="subtitle" title="screenscraper id">
                  <span className="is-hidden-tablet"><span className="fa-solid fa-hashtag" /></span>
                  <span>{game.screenscraper_id}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <NominationList
        showTitle={false}
        nominations={dbStore.getNominationsByGame(game.id)}
      ></NominationList>
    </div>
  );
});

export default GameDisplay;
