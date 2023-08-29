import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores/useStores';
import { NominationType } from '../../../models/game';

const NominationList = observer(() => {
  const { randomizerStore } = useStores();
  return (
    <>
      {randomizerStore.nominations.map((nomination, index) => (
        <article className="media" key={index}>
          <div className="media-content">
            <div className="content">
              <blockquote
                className={classNames({
                  'has-background-primary': nomination.is_winner,
                  'has-text-white': nomination.is_winner,
                })}
              >
                <div className="level">
                  {nomination.user_name && (
                    <div className="level-item">
                      <span
                        className={classNames({
                          subtitle: true,
                          'has-text-white': nomination.is_winner,
                        })}
                      >
                        Nominator: {nomination.user_name}{' '}
                        {nomination.is_winner && '👑'}
                      </span>
                    </div>
                  )}

                  <div className="level-item">
                    <span
                      className={classNames({
                        subtitle: true,
                        'has-text-white': nomination.is_winner,
                      })}
                    >
                      {nomination.date}
                    </span>
                  </div>

                  <div className="level-item">
                    {nomination.theme_title && (
                      <span
                        className={classNames({
                          subtitle: true,
                          'has-text-white': nomination.is_winner,
                        })}
                      >
                        Theme: {nomination.theme_title}
                      </span>
                    )}
                    {nomination.nomination_type === NominationType.retrobit && (
                      <span
                        className={classNames({
                          subtitle: true,
                          'has-text-white': nomination.is_winner,
                        })}
                      >
                        Theme: Retrobits
                      </span>
                    )}
                    {nomination.nomination_type === NominationType.rpg && (
                      <span
                        className={classNames({
                          subtitle: true,
                          'has-text-white': nomination.is_winner,
                        })}
                      >
                        Theme: RPG of the Quarter
                      </span>
                    )}
                  </div>
                </div>
                <p>{nomination.game_description}</p>
              </blockquote>
            </div>
          </div>
        </article>
      ))}
    </>
  );
});

export default NominationList;
