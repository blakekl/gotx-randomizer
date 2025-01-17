import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
          <h1 className="title is-1 has-text-centered">GotX Dashboard</h1>
    <div className="fixed-grid has-1-cols-mobile has-2-cols">
      <div className="grid is-size-3 has-text-centered">
        <div className="cell is-col-min-2">
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
  )
}

export default Home;