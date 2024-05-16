import { useEffect, useState } from 'react';
import {
  CompletionListItem,
  NominationListItem,
  UserListItem,
  nominationTypeToPoints,
} from '../../../models/game';
import { useStores } from '../../../stores/useStores';
import NominationList from '../../Randomizer/GameDisplay/NominationList';
import classNames from 'classnames';

interface UserDisplayProps {
  user: UserListItem;
}

enum Tabs {
  NOMINATIONS,
  COMPLETIONS,
}

const UserDisplay = ({ user }: UserDisplayProps) => {
  const { dbStore } = useStores();
  const [nominations, setNominations] = useState(
    new Array<NominationListItem>(),
  );
  const [completions, setCompletions] = useState(
    new Array<CompletionListItem>(),
  );
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.NOMINATIONS);

  useEffect(() => {
    setNominations(dbStore.getNominationsByUser(user.id));
    setCompletions(dbStore.getCompletionsByUserId(user.id));
  }, [dbStore, user]);

  return (
    <>
      <h2 className="title is-2 has-text-centered">{user.name}</h2>
      <div className="tabs">
        <ul>
          <li
            className={classNames({
              'is-active': activeTab === Tabs.NOMINATIONS,
            })}
          >
            <a onClick={() => setActiveTab(Tabs.NOMINATIONS)}>
              Nominations<span className="tag">{nominations.length}</span>
            </a>
          </li>
          <li
            className={classNames({
              'is-active': activeTab === Tabs.COMPLETIONS,
            })}
          >
            <a onClick={() => setActiveTab(Tabs.COMPLETIONS)}>
              Completions <span className="tag">{completions.length}</span>
            </a>
          </li>
        </ul>
      </div>
      {activeTab === Tabs.NOMINATIONS && (
        <NominationList
          showTitle={true}
          nominations={nominations}
        ></NominationList>
      )}
      {activeTab === Tabs.COMPLETIONS && (
        <table className="table is-fullwidth is-striped is-narrow">
          <thead>
            <tr className="title is-3 is-primary">
              <th className="">Earned Points</th>
              <th className="has-text-centered"></th>
              <th className="has-text-right">
                {completions
                  .map((x) => nominationTypeToPoints(x.nomination_type))
                  .reduce((current, sum) => (sum += current), 0)}
              </th>
            </tr>
            <tr className="title is-3 is-primary">
              <th className="">Name</th>
              <th className="has-text-centered">type</th>
              <th className="has-text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {completions
              .map((x) => ({
                ...x,
                points: nominationTypeToPoints(x.nomination_type),
              }))
              .map((x) => (
                <tr key={x.id}>
                  <td>
                    {[
                      x.title_other,
                      x.title_jap,
                      x.title_eu,
                      x.title_usa,
                      x.title_world,
                    ]
                      .filter((y) => y && y.length > 0)
                      .pop()}
                  </td>
                  <td className="has-text-centered">{x.nomination_type}</td>
                  <td className="has-text-right is-size-4">
                    {x.points < 1 ? '½' : x.points}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
};
export default UserDisplay;
