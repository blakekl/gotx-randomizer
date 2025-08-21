import { observer } from 'mobx-react-lite';
import { useParams, Navigate } from 'react-router-dom';
import { useStores } from '../../../stores/useStores';
import { NominationType } from '../../../models/game';
import { ThemeHeader } from './ThemeHeader/ThemeHeader';
import { GotmThemeDetail } from './GotmThemeDetail/GotmThemeDetail';
import { RetrobitsThemeDetail } from './RetrobitsThemeDetail/RetrobitsThemeDetail';
import { RpgThemeDetail } from './RpgThemeDetail/RpgThemeDetail';
import { GotyThemeDetail } from './GotyThemeDetail/GotyThemeDetail';
import { GotwotypThemeDetail } from './GotwotypThemeDetail/GotwotypThemeDetail';

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
    const themeType = theme.nomination_type;

    switch (themeType) {
      case NominationType.GOTM:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return <GotmThemeDetail nominations={nominations} />;

      case NominationType.RETROBIT:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return <RetrobitsThemeDetail nominations={nominations} />;

      case NominationType.RPG:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return <RpgThemeDetail nominations={nominations} />;

      case NominationType.GOTY:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return <GotyThemeDetail nominations={nominations} />;

      case NominationType.GOTWOTY:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return <GotwotypThemeDetail nominations={nominations} />;

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
