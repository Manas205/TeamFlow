const Panel = ({ children, padded = false, className = '', ...props }) => (
  <section className={`ui-panel${padded ? ' ui-panel--padded' : ''} ${className}`.trim()} {...props}>
    {children}
  </section>
);

export default Panel;
