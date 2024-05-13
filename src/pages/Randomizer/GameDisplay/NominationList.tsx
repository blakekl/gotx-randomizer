import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { NominationListItem, NominationType } from '../../../models/game';

interface NominationListParams {
  nominations: NominationListItem[];
}

const NominationList = observer(({ nominations }: NominationListParams) => {
  return (
    <>
      {nominations.map((nomination, index) => (
        <article className="media" key={index}>
          <div className="media-content">
            <div className="content">
              <blockquote
                className={classNames({
                  'has-background-primary': nomination.winner,
                  'has-text-white': nomination.winner,
                })}
              >
                <div className="level">
                  {nomination.nomination_type === NominationType.GOTM && (
                    <div className="level-item">
                      <span
                        className={classNames({
                          subtitle: true,
                          'has-text-white': nomination.winner,
                        })}
                      >
                        Nominator: {nomination.user_name}{' '}
                        {nomination.winner && '👑'}
                      </span>
                    </div>
                  )}

                  <div className="level-item">
                    <span
                      className={classNames({
                        subtitle: true,
                        'has-text-white': nomination.winner,
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
                          'has-text-white': nomination.winner,
                        })}
                      >
                        Theme: {nomination.theme_title}
                      </span>
                    )}
                    {nomination.nomination_type === NominationType.RETROBIT && (
                      <span
                        className={classNames({
                          subtitle: true,
                          'has-text-white': nomination.winner,
                        })}
                      >
                        Theme: Retrobits
                      </span>
                    )}
                    {nomination.nomination_type === NominationType.RPG && (
                      <span
                        className={classNames({
                          subtitle: true,
                          'has-text-white': nomination.winner,
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
