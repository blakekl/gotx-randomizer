import { observer } from 'mobx-react-lite';
import { useParams, Navigate } from 'react-router-dom';
import { useStores } from '../../../hooks/useStores';
import { ThemeHeader } from './shared/ThemeHeader';
import { GotmThemeDetail } from './components/GotmThemeDetail';

const ThemeDetail = observer(() => {
  const { themeId } = useParams<{ themeId: string }>();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { dbStore } = useStores();

  if (!themeId) {
    return <Navigate to="/404" replace />;
  }

  const themeIdNum = parseInt(themeId, 10);
  if (isNaN(themeIdNum)) {
    return <Navigate to="/404" replace />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const result = dbStore.getThemeDetailWithCategories(themeIdNum);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { theme, nominations } = result;

  if (!theme) {
    return <Navigate to="/404" replace />;
  }

  // Determine theme type and render appropriate component
  const renderThemeContent = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const themeType = String(theme.nomination_type).toLowerCase();

    switch (themeType) {
      case 'gotm':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return <GotmThemeDetail nominations={nominations} />;

      case 'retrobits':
        // TODO: Implement RetrobitsThemeDetail
        return (
          <div className="box">
            <div className="notification is-info">
              <p>
                <strong>Retrobits theme display coming soon!</strong>
              </p>
              <p>
                This theme type will have a specialized single-game showcase
                format.
              </p>
            </div>
          </div>
        );

      case 'rpg':
        // TODO: Implement RpgThemeDetail
        return (
          <div className="box">
            <div className="notification is-info">
              <p>
                <strong>RPG theme display coming soon!</strong>
              </p>
              <p>
                This theme type will have a single winner with nominations table
                format.
              </p>
            </div>
          </div>
        );

      case 'goty':
        // TODO: Implement GotyThemeDetail
        return (
          <div className="box">
            <div className="notification is-info">
              <p>
                <strong>GotY theme display coming soon!</strong>
              </p>
              <p>
                This theme type will have multiple winners with theme
                description categories.
              </p>
            </div>
          </div>
        );

      default:
        // Fallback to GotM format for unknown types
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return <GotmThemeDetail nominations={nominations} />;
    }
  };

  return (
    <div className="container">
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <ThemeHeader theme={theme} />
      {renderThemeContent()}
    </div>
  );
});

export default ThemeDetail;
