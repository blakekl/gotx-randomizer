import { observer } from 'mobx-react-lite';
import CurrentThemes from './CurrentThemes';
import ThemeBrowser from './ThemeBrowser';

const Themes = observer(() => {
  return (
    <>
      <h1 className="title is-1 has-text-centered">Theme Browser</h1>

      {/* Current Themes Dashboard */}
      <CurrentThemes />

      {/* Theme History Section */}
      <ThemeBrowser />
    </>
  );
});

export default Themes;
