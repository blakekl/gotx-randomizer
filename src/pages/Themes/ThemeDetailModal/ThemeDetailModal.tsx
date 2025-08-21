import classNames from 'classnames';
import { ThemeWithStatus, getThemeTypeDisplay } from '../../../models/game';

interface ThemeDetailModalProps {
  theme: ThemeWithStatus | null;
  onClose: () => void;
}

const ThemeDetailModal = ({ theme, onClose }: ThemeDetailModalProps) => {
  return (
    <div className={classNames('modal', { 'is-active': theme })}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        {theme && (
          <div className="box">
            <h3 className="title is-4">{theme.title || 'Upcoming Theme'}</h3>
            <div className="content">
              <p>
                <strong>Type:</strong>{' '}
                {getThemeTypeDisplay(String(theme.nomination_type))}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {theme.creation_date
                  ? new Date(theme.creation_date).toLocaleDateString()
                  : 'TBD'}
              </p>
              {theme.description && (
                <p>
                  <strong>Description:</strong> {theme.description}
                </p>
              )}
              <p>
                <strong>Nominations:</strong>{' '}
                {String(theme.nominationCount || 0)}
              </p>
            </div>
          </div>
        )}
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default ThemeDetailModal;
