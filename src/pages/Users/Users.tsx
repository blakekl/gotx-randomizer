import classNames from 'classnames';
import Pagination from '../../components/Pagination';
import { UserListItem } from '../../models/game';
import { useEffect, useState } from 'react';
import { useStores } from '../../stores/useStores';
import UserDisplay from './UserDisplay/UserDisplay';

const Users = () => {
  const { dbStore, settingsStore } = useStores();
  const [allUsers, setAllUsers] = useState(new Array<UserListItem>());
  const [userList, setUserList] = useState(new Array<UserListItem>());
  const [indexRange, setIndexRange] = useState([0, 0]);
  const [usernameFilter, setUsernameFilter] = useState(
    settingsStore.myUserName ?? '',
  );
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    setAllUsers(dbStore.getNominationSuccessPercentByUser());
  }, [dbStore]);

  useEffect(() => {
    let newPoolArray = [...allUsers];
    newPoolArray = newPoolArray.filter((x) =>
      x.name.toLocaleLowerCase().includes(usernameFilter),
    );
    setUserList(newPoolArray);
  }, [allUsers, usernameFilter]);

  return (
    <>
      <h1 className="title is-1 has-text-centered">Users</h1>
      <div className="field">
        <p className="control has-icons-left">
          <input
            className="input"
            type="text"
            placeholder="user name"
            value={usernameFilter}
            onChange={(e) =>
              setUsernameFilter(e.currentTarget.value.toLocaleLowerCase())
            }
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search" />
          </span>
        </p>
      </div>
      <table className="table is-hoverable is-striped is-fullwidth is-narrow">
        <thead>
          <tr className="title is-3 is-primary">
            <th>Rank</th>
            <th>Name</th>
            <th className="has-text-centered">Earned Points</th>
            <th className="has-text-centered">Nominations</th>
            <th className="has-text-centered">Nomination Wins</th>
            <th className="has-text-right">Nomination Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {userList.slice(indexRange[0], indexRange[1]).map((x) => (
            <tr
              key={x.id}
              onClick={() => setSelectedUser(x)}
              className={classNames({
                'is-selected':
                  (selectedUser && x.id === selectedUser.id) ||
                  hovered === x.id,
              })}
              onMouseEnter={() => setHovered(x.id)}
              onMouseLeave={() => setHovered(0)}
            >
              <td>{x.rank}</td>
              <td>{x.name}</td>
              <td className="has-text-centered">{x.earned_points}</td>
              <td className="has-text-centered">{x.nominations}</td>
              <td className="has-text-centered">{x.wins}</td>
              <td className="has-text-right">{x.success_rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        count={userList.length}
        onPageChange={setIndexRange}
      ></Pagination>

      <div
        className={classNames({
          modal: true,
          'is-active': selectedUser !== null,
        })}
      >
        <div
          className="modal-background"
          onClick={() => setSelectedUser(null)}
        ></div>
        <div className="modal-content">
          {selectedUser && <UserDisplay user={selectedUser}></UserDisplay>}
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setSelectedUser(null)}
        ></button>
      </div>
    </>
  );
};

export default Users;
