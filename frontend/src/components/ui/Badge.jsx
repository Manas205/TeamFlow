const Badge = ({ children, tone = 'neutral', className = '' }) => (
  <span className={`ui-badge ui-badge--${tone} ${className}`.trim()}>{children}</span>
);

export default Badge;
