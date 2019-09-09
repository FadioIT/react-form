import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import useForm from './useForm';

describe('useForm', () => {
  it('should return form state and form management functions', () => {
    const { result } = renderHook(() =>
      useForm({
        value: { firstName: 'François', lastName: 'de Campredon' },
        onSubmit: () => {},
      }),
    );

    expect(result.current).toMatchObject({
      value: { firstName: 'François', lastName: 'de Campredon' },
      errors: {},
      isDirty: false,
      isValid: true,
      registerField: expect.any(Function),
      unregisterField: expect.any(Function),
      startFieldValidation: expect.any(Function),
      stopFieldValidation: expect.any(Function),
      onFieldChange: expect.any(Function),
      onSubmit: expect.any(Function),
    });
  });

  it('should update the `isValid` property when field is registered/unregistred', () => {
    const { result } = renderHook(() =>
      useForm({
        value: { firstName: 'François', lastName: 'de Campredon' },
        onSubmit: () => {},
      }),
    );
    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.registerField('firstName', () => 'invalid');
    });
    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.unregisterField('firstName');
    });
    expect(result.current.isValid).toBe(true);
  });

  it('should update form state when value changes', () => {
    const { result } = renderHook(() =>
      useForm({
        value: { firstName: '', lastName: 'de Campredon' },
        onSubmit: () => {},
      }),
    );
    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.registerField('firstName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
    });
    expect(result.current.isValid).toBe(false);
    expect(result.current.isDirty).toBe(false);

    act(() => {
      result.current.onFieldChange('firstName', 'François');
    });
    expect(result.current.isValid).toBe(true);
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.onFieldChange('firstName', '');
    });
    expect(result.current.isValid).toBe(false);
    expect(result.current.isDirty).toBe(false);
  });

  it('should display fields errors only when the validation started for this field', () => {
    const { result } = renderHook(() =>
      useForm({
        value: { firstName: '', lastName: '' },
        onSubmit: () => {},
      }),
    );
    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.registerField('firstName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
      result.current.registerField('lastName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
    });
    expect(result.current.errors).toEqual({});

    act(() => {
      result.current.startFieldValidation('firstName');
    });
    expect(result.current.errors).toEqual({ firstName: 'Field is required.' });

    act(() => {
      result.current.onFieldChange('firstName', 'François');
    });
    expect(result.current.errors).toEqual({});

    act(() => {
      result.current.onFieldChange('firstName', '');
      result.current.stopFieldValidation('firstName');
      result.current.startFieldValidation('lastName');
    });
    expect(result.current.errors).toEqual({ lastName: 'Field is required.' });
  });

  it('should display all the errors when we try to submit an invalid form', () => {
    const { result } = renderHook(() =>
      useForm({
        value: { firstName: '', lastName: '' },
        onSubmit: () => {},
      }),
    );
    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.registerField('firstName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
      result.current.registerField('lastName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
    });
    expect(result.current.errors).toEqual({});

    act(() => {
      result.current.onSubmit();
    });

    expect(result.current.errors).toEqual({
      firstName: 'Field is required.',
      lastName: 'Field is required.',
    });
  });

  it('should call the `onChange` callback with form state when value changes', async () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        value: { firstName: '', lastName: 'de Campredon' },
        onSubmit: () => {},
        onChange,
      }),
    );
    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.registerField('firstName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
      result.current.startFieldValidation('firstName');
      result.current.onFieldChange('firstName', 'François');
    });

    expect(onChange).toHaveBeenLastCalledWith({
      value: { firstName: 'François', lastName: 'de Campredon' },
      errors: {},
      isValid: true,
      isDirty: true,
    });

    act(() => {
      result.current.onFieldChange('firstName', '');
    });

    expect(onChange).toHaveBeenLastCalledWith({
      value: { firstName: '', lastName: 'de Campredon' },
      errors: { firstName: 'Field is required.' },
      isValid: false,
      isDirty: false,
    });

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('should not call the `onSubmit` callback if the form is invalid, but the `onChange` one', () => {
    const onChange = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        value: { firstName: '', lastName: '' },
        onChange,
        onSubmit,
      }),
    );
    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.registerField('firstName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
      result.current.registerField('lastName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
    });
    act(() => {
      result.current.onSubmit();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith({
      value: { firstName: '', lastName: '' },
      errors: {
        lastName: 'Field is required.',
        firstName: 'Field is required.',
      },
      isValid: false,
      isDirty: false,
    });
  });

  it('should  call the `onSubmit` callback if the form is valid', () => {
    const onChange = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        value: { firstName: 'François', lastName: 'de Campredon' },
        onChange,
        onSubmit,
      }),
    );
    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.registerField('firstName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
      result.current.registerField('lastName', (value, field) =>
        value[field] ? null : 'Field is required.',
      );
    });
    act(() => {
      result.current.onSubmit();
    });

    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'François',
      lastName: 'de Campredon',
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
