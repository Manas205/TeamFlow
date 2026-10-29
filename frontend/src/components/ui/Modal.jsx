import { useEffect } from 'react';

const Modal = ({ open, title, onClose, children }) => {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ui-modal__backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="ui-modal" role="dialog" aria-modal="true" aria-labelledby="ui-modal-title">
        <div className="ui-modal__header">
          <h2 id="ui-modal-title">{title}</h2>
          <button className="ui-modal__close" type="button" aria-label="Close dialog" onClick={onClose}>×</button>
        </div>
        <div className="ui-modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
