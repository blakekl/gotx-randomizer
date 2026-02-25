import { User, UserListItem } from '../../models/game';
import { useEffect, useState } from 'react';
import { useStores } from '../../stores/useStores';
import UserDisplay from '../Users/UserDisplay/UserDisplay';
import Pagination from '../../components/Pagination';

type LeaderBoardUser = Pick<User, 'id' | 'name' | 'earned_points'>;

const outranksAllSuccessors = (
  user: LeaderBoardUser,
  allUsers: LeaderBoardUser[],
): boolean => {
  if (user.earned_points <= 0) return false;
  return !allUsers.some(
    (other) => other.id > user.id && other.earned_points > user.earned_points,
  );
};

const LeaderBoard = () => {
  const { dbStore } = useStores();
  const [rankedUsers, setRankedUsers] = useState(new Array<LeaderBoardUser>());
  const [selectedUser, setSelectedUser] = useState<LeaderBoardUser | null>(
    null,
  );
  const [indexRange, setIndexRange] = useState([0, 0]);

  useEffect(() => {
    const users = [...dbStore.getUsersWithPoints()].sort(
      (a, b) => b.earned_points - a.earned_points,
    );
    setRankedUsers(users);
  }, [dbStore]);

  return (
    <>
      <h1 className="title is-1 has-text-centered">Leaderboard</h1>
      <table className="table is-hoverable is-striped is-fullwidth is-narrow">
        <thead>
          <tr className="title is-3 is-primary">
            <th className="has-text-centered">Rank</th>
            <th>Name</th>
            <th className="has-text-right">Earned Points</th>
            <th className="has-text-centered"></th>
          </tr>
        </thead>
        <tbody>
          {rankedUsers
            .slice(indexRange[0], indexRange[1])
            .map((user, index) => {
              const isOutranker = outranksAllSuccessors(user, rankedUsers);
              return (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="has-text-centered has-text-weight-bold">
                    {indexRange[0] + index + 1}
                  </td>
                  <td>{user.name}</td>
                  <td className="has-text-right">{user.earned_points}</td>
                  <td className="has-text-centered">
                    {isOutranker && (
                      <span
                        className="tag is-warning is-light"
                        title="No user with a higher ID has more earned points"
                      >
                        ⭐ outranks all successors
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          {rankedUsers.length === 0 && (
            <tr>
              <td colSpan={4} className="has-text-centered has-text-grey">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        count={rankedUsers.length}
        onPageChange={setIndexRange}
      ></Pagination>

      <div className={`modal${selectedUser ? ' is-active' : ''}`}>
        <div
          className="modal-background"
          onClick={() => setSelectedUser(null)}
        ></div>
        <div className="modal-content">
          {selectedUser && (
            <UserDisplay user={selectedUser as unknown as UserListItem} />
          )}
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

export default LeaderBoard;
