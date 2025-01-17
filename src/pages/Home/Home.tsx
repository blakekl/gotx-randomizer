import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <h1 className="title is-1 has-text-centered">GotX Dashboard</h1>
      <p>
        Welcome to the GotX Dashboard. Your place for all the details on the
        Retro Handhelds GotX program. Select a tool from the list below. Use
        Randomizer to find a random game featured in GotX, one way or another.
        Use stats to see what&apos;s being nominated, played, and other data facts.
        Use games to search for a particular game. And finally, use users to see
        your own personal (or anyone else&apos;s) completed games and nomination
        lists.
      </p>
      <div className="fixed-grid mt-6 has-1-cols-mobile has-2-cols-tablet has-4-cols-desktop">
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
    </>
  );
};

export default Home;
