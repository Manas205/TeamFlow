const Field = ({ as = 'input', label, id, error, hint, required = false, className = '', ...props }) => {
  const Control = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="ui-field">
      {label && <label className="ui-field__label" htmlFor={id}>{label}{required && <span className="ui-field__required">*</span>}</label>}
      <Control id={id} className={`ui-field__control${error ? ' ui-field__control--error' : ''} ${className}`.trim()} aria-invalid={Boolean(error)} {...props} />
      {(error || hint) && <span className={`ui-field__message ui-field__message--${error ? 'error' : 'hint'}`}>{error || hint}</span>}
    </div>
  );
};

export default Field;
