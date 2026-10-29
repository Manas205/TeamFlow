const Toast = ({ message, tone = 'neutral', onDismiss }) => (
  <div className={`ui-toast ui-toast--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
    <span>{message}</span>
    {onDismiss && <button className="ui-toast__close" type="button" aria-label="Dismiss notification" onClick={onDismiss}>×</button>}
  </div>
);

export const ToastRegion = ({ children }) => <div className="ui-toast-region" aria-live="polite">{children}</div>;

export default Toast;
