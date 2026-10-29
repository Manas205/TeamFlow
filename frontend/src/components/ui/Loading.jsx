const Loading = ({ label = 'Loading', className = '' }) => (
  <div className={`ui-loading ${className}`.trim()} role="status" aria-live="polite">
    <span className="ui-loading__spinner" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export const Skeleton = ({ width = '100%', className = '' }) => (
  <span className={`ui-skeleton ${className}`.trim()} style={{ width }} aria-hidden="true" />
);

export default Loading;
