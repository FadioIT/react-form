import { useEffect, useContext, useCallback } from 'react';
import FormContext from './FormContext';
import { Validator } from './types';

const useFormField = (fieldName: string, validate?: Validator) => {
  const {
    value,
    errors,
    registerField,
    unregisterField,
    startFieldValidation,
    stopFieldValidation,
    onFieldChange,
  } = useContext(FormContext);

  useEffect(() => {
    registerField(fieldName, validate);
    return () => {
      unregisterField(fieldName);
    };
  }, []);

  const onChange = useCallback(value => onFieldChange(fieldName, value), [
    onFieldChange,
  ]);

  const startValidation = useCallback(() => startFieldValidation(fieldName), [
    startFieldValidation,
  ]);

  const stopValidation = useCallback(() => stopFieldValidation(fieldName), [
    stopFieldValidation,
  ]);

  return {
    fieldValue: value[fieldName],
    fieldError: errors[fieldName],
    onChange,
    startValidation,
    stopValidation,
  };
};

export default useFormField;
