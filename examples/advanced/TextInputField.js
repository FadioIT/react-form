/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormField } from '@fadioit/react-form';

const TextInputField = ({ fieldName, validate, label, required }) => {
  const [focused, setFocused] = useState(false);
  const [hadErrorWhenBlurOccured, setHadErrorWhenBlurOccured] = useState(false);

  const { fieldValue, fieldError, onChange, startValidation } = useFormField(
    fieldName,
    validate,
  );

  const onFocus = useCallback(() => {
    startValidation();
    setFocused({ focused: true });
  }, []);

  const onBlur = useCallback(() => {
    setFocused(false);
    if (fieldError) {
      setHadErrorWhenBlurOccured(true);
    }
  }, [fieldError]);

  const showValid = fieldValue && !fieldError && focused;
  const showError = fieldError && hadErrorWhenBlurOccured;

  return (
    <label htmlFor={fieldName} style={styles.label}>
      <span
        style={{
          alignItems: 'baseline',
          display: 'block',
          marginBottom: 5,
        }}
      >
        {label}:{''}
      </span>
      <input
        id={fieldName}
        name={fieldName}
        type="text"
        required={required}
        value={fieldValue || ''}
        style={{
          ...styles.input,
          ...(showError && styles.inputErrors),
          ...(showValid && styles.inputValid),
        }}
        onChange={e => onChange(e.target.value || null)}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <div
        style={{
          ...styles.errorLabel,
          visibility: showError ? 'visible' : 'hidden',
        }}
      >
        {fieldError}
      </div>
    </label>
  );
};

TextInputField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  validate: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
};

export default TextInputField;

const styles = {
  label: { display: 'block', marginBottom: 10 },
  input: {
    fontFamily: "'Open sans', sans-serif",
    fontSize: 14,
    border: '1px solid #CCC',
    borderRadius: 3,
    padding: `5px 10px`,
    width: 200,
  },
  inputErrors: {
    border: '1px solid transparent',
    boxShadow: `0 0 1px 1px red`,
    outline: 0,
    ':focus': {
      boxShadow: `0 0 2px 2px red`,
    },
  },
  inputValid: {
    border: '1px solid transparent',
    boxShadow: `0 0 1px 1px green`,
    outline: 0,
    ':focus': {
      boxShadow: `0 0 2px 2px $green`,
    },
  },
  errorLabel: {
    marginTop: 5,
    height: 14,
    fontSize: 12,
    color: 'red',
    alignSelf: 'stretch',
    whiteSpace: 'nowrap',
  },
};
