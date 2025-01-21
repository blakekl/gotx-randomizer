import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <h1 className="title is-1 has-text-centered">GotX Dashboard</h1>
      <div className="fixed-grid has-1-cols-mobile has-2-cols-tablet has-4-cols-desktop">
        <div className="grid is-size-3 has-text-centered">
          <div className="cell">
            <Link to="/randomizer">
              <div className="box">
                <div className="fa-solid fa-shuffle" />
                <p>Randomizer</p>
              </div>
            </Link>
          </div>
          <div className="cell">
            <Link to="/stats?tab=nominations">
              <div className="box">
                <div className="fa-solid fa-chart-simple" />
                <p>Stats</p>
              </div>
            </Link>
          </div>
          <div className="cell">
            <Link to="/games">
              <div className="box">
                <div className="fa-solid fa-gamepad" />
                <p>Games</p>
              </div>
            </Link>
          </div>
          <div className="cell">
            <Link to="/users">
              <div className="box">
                <div className="fa-solid fa-users" />
                <p>Users</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-6">
        Welcome to the GotX Dashboard. Your place for all the details on the
        Retro Handhelds GotX program. Select a tool from the list above.
      </p>
      <ul>
        <li>
          • Use Randomizer to find a random game featured in GotX, one way or
          another.
        </li>
        <li>
          • Use stats to see what&apos;s being nominated, played, and other data
          points.
        </li>
        <li>• Use games to search for a particular game.</li>
        <li>
          • Use users to see your own personal (or anyone else&apos;s) completed
          games and nomination lists.
        </li>
      </ul>
    </>
  );
};

export default Home;
