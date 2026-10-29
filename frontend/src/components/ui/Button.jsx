const Button = ({ variant = 'primary', size, loading = false, children, className = '', type = 'button', ...props }) => (
  <button
    className={`ui-button ui-button--${variant}${size ? ` ui-button--${size}` : ''}${loading ? ' ui-button--loading' : ''} ${className}`.trim()}
    type={type}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && <span className="ui-button__spinner" aria-hidden="true" />}
    {children}
  </button>
);

export default Button;
