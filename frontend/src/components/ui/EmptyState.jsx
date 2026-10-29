const EmptyState = ({ title, description, action }) => (
  <div className="ui-empty">
    <h3 className="ui-empty__title">{title}</h3>
    {description && <p className="ui-empty__description">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
