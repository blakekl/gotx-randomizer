import classnames from 'classnames';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const isDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' });

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="https://retrohandhelds.gg">
          <img
            src={`https://retrohandhelds.gg/wp-content/uploads/2023/08/rh_logo_${
              isDark ? 'white' : 'black'
            }.svg`}
            alt="retro handhelds logo"
            height="28"
          />
        </a>

        <a
          role="button"
          className={classnames({
            'navbar-burger': true,
            'is-active': showMenu,
          })}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={() => setShowMenu(!showMenu)}
          onBlur={() => setTimeout(() => setShowMenu(false), 100)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div
        className={classnames({
          'navbar-menu': true,
          'is-active': showMenu,
        })}
      >
        <div className="navbar-end">
          <Link className="navbar-item" to="/">
            Dashboard Home
          </Link>
          <Link className="navbar-item" to="/randomizer">
            Randomizer
          </Link>
          <Link className="navbar-item" to="/stats">
            Statistics
          </Link>
          <Link className="navbar-item" to="/games">
            Games
          </Link>
          <Link className="navbar-item" to="/users">
            Users
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
