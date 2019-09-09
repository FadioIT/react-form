import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import shallowEqual from './utils/shallowEqual';
import hasOwnProperty from './utils/hasOwnProperty';
import { StrMap, Validator, FormContextValue, FormProps } from './types';

type FieldDefinition = { validate?: Validator; validationStarted: boolean };

type FormState<T> = {
  value: T;
  errors: StrMap<any>;
  isValid: boolean;
};

const useForm = <T extends object>(props: FormProps<T>): FormContextValue => {
  const originalValue = useRef(props.value || {});
  const fields = useRef<StrMap<FieldDefinition>>({});
  const initialValidationDone = useRef(false);
  const shouldCallOnChange = useRef(false);

  const [state, setState] = useState<FormState<T>>({
    value: originalValue.current,
    errors: {},
    isValid: false,
  });

  const updateFormState = useCallback((updates?: object) => {
    setState(({ value }) => {
      if (updates) {
        value = { ...value, ...updates };
      }
      let isValid = true;
      const errors = {};
      Object.entries(fields.current).forEach(
        ([field, { validate, validationStarted }]) => {
          const fieldErrors = validate ? validate(value, field) : null;
          if (
            fieldErrors &&
            (!Array.isArray(fieldErrors) || fieldErrors.length)
          ) {
            isValid = false;
            if (validationStarted) {
              errors[field] = fieldErrors;
            }
          }
        },
      );
      return { value, isValid, errors };
    });
  }, []);

  const updateErrorsForField = useCallback(field => {
    const { validate, validationStarted } = fields.current[field];
    setState(state => {
      if (validationStarted) {
        const fieldErrors = validate ? validate(state.value, field) : null;
        if (hasErrors(fieldErrors)) {
          state = {
            ...state,
            errors: {
              ...state.errors,
              [field]: fieldErrors,
            },
          };
        }
      }
      return state;
    });
  }, []);

  const registerField = useCallback((fieldName, validate) => {
    if (hasOwnProperty(fields.current, fieldName)) {
      throw new Error(`Field ${fieldName} has been registered twice`);
    }
    fields.current[fieldName] = {
      validate,
      validationStarted: false,
    };
    if (initialValidationDone.current) {
      updateFormState();
    }
  }, []);

  const unregisterField = useCallback((fieldName: string) => {
    if (!hasOwnProperty(fields.current, fieldName)) {
      return;
    }
    delete fields.current[fieldName];
    if (initialValidationDone.current) {
      updateFormState();
    }
  }, []);

  const startFieldValidation = useCallback(fieldName => {
    if (!hasOwnProperty(fields.current, fieldName)) {
      throw new Error(`Unknown field ${fieldName}`);
    }
    fields.current[fieldName].validationStarted = true;
    updateErrorsForField(fieldName);
  }, []);

  const stopFieldValidation = useCallback(fieldName => {
    if (!hasOwnProperty(fields.current, fieldName)) {
      throw new Error(`Unknown field ${fieldName}`);
    }
    fields.current[fieldName].validationStarted = false;
    updateErrorsForField(fieldName);
  }, []);

  const onFieldChange = useCallback((fieldName, fieldValue) => {
    updateFormState({ [fieldName]: fieldValue });
  }, []);

  const onSubmit = useCallback(() => {
    if (!state.isValid) {
      Object.values(fields.current).forEach(field => {
        field.validationStarted = true;
      });
      shouldCallOnChange.current = true;
      updateFormState();
      return;
    }
    props.onSubmit(state.value);
  }, [state.isValid, state.value, props.onSubmit]);

  // prettier-ignore
  const isDirty = useMemo(
    () => !shallowEqual(state.value, originalValue.current), 
    [state.value],
  );

  useEffect(() => {
    updateFormState();
    initialValidationDone.current = true;
  }, []);

  useEffect(() => {
    if (
      props.onChange &&
      (state.value !== originalValue.current || shouldCallOnChange.current)
    ) {
      props.onChange({ ...state, isDirty });
    }
    shouldCallOnChange.current = false;
  }, [state.value, shouldCallOnChange.current]);

  return useMemo(
    () => ({
      ...state,
      isDirty,
      registerField,
      unregisterField,
      startFieldValidation,
      stopFieldValidation,
      onFieldChange,
      onSubmit,
    }),
    [state],
  );
};

export default useForm;

const hasErrors = (fieldErrors: any) =>
  !!fieldErrors && (!Array.isArray(fieldErrors) || fieldErrors.length);
