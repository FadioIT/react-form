export type StrMap<T> = { [field: string]: T };

export type Validator = (value: object, field: string) => any;

export type FormProps<T extends object> = {
  value: T;
  onSubmit: (value: T) => void;
  onChange?: (args: {
    value: T;
    errors: StrMap<any>;
    isDirty: boolean;
    isValid: boolean;
  }) => void;
};

export type FormContextValue = {
  value: object;
  errors: StrMap<any>;
  isValid: boolean;
  isDirty: boolean;
  registerField: (fieldName: string, validate?: Validator) => void;
  unregisterField: (fieldName: string) => void;
  startFieldValidation: (fieldName: string) => void;
  stopFieldValidation: (fieldName: string) => void;
  onFieldChange: (fieldName: string, fieldValue: any) => void;
  onSubmit: () => void;
};
