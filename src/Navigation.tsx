import classnames from 'classnames';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const Navigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const isDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' });

  return (
    <nav
      className="main-nav navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
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
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div
        id="navbarBasicExample"
        className={classnames({
          'navbar-menu': true,
          'is-active': true,
        })}
      >
        <div className="navbar-end">
          {/* future links to go here. Just <a className="navbar-item"> */}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
