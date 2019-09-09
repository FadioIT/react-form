import React from 'react';
import PropTypes from 'prop-types';
import { useFormField } from '@fadioit/react-form';

const TextInputField = ({ label, fieldName, validate, ...props }) => {
  const { onChange, fieldValue } = useFormField(fieldName, validate);

  return (
    <label htmlFor={fieldName} {...props}>
      {label} :{' '}
      <input
        type="text"
        id={fieldName}
        name={fieldName}
        value={fieldValue}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
};

export default TextInputField;

TextInputField.propTypes = {
  label: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  validate: PropTypes.func,
};
