import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import useFormField from './useFormField';
import FormContext from './FormContext';
import { Validator } from './types';

describe('useFormField', () => {
  const contextMock = {
    value: { firstName: 'François', lastName: 'de Campredon' },
    errors: { firstName: 'Field is invalid.' },
    isValid: false,
    isDirty: false,
    registerField: jest.fn(),
    unregisterField: jest.fn(),
    startFieldValidation: jest.fn(),
    stopFieldValidation: jest.fn(),
    onFieldChange: jest.fn(),
    onSubmit: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderUseFormField = (fieldName: string, validate?: Validator) =>
    renderHook(() => useFormField(fieldName, validate), {
      wrapper: props => <FormContext.Provider {...props} value={contextMock} />,
    });

  it('should return field state and form management functions', () => {
    const { result } = renderUseFormField('firstName');

    expect(result.current).toMatchObject({
      fieldValue: 'François',
      fieldError: 'Field is invalid.',
      onChange: expect.any(Function),
      startValidation: expect.any(Function),
      stopValidation: expect.any(Function),
    });
  });

  it('should registerField/unregisterField on mounting dismounting', () => {
    const validate = () => {};
    const { rerender, unmount } = renderUseFormField('firstName', validate);

    expect(contextMock.registerField).toHaveBeenCalledWith(
      'firstName',
      validate,
    );

    act(() => {
      rerender('firstName');
    });
    expect(contextMock.registerField).toHaveBeenCalledTimes(1);
    expect(contextMock.unregisterField).not.toHaveBeenCalled();

    act(() => {
      unmount();
    });
    expect(contextMock.unregisterField).toHaveBeenCalledWith('firstName');
  });

  it(
    'onChange, startValidation and stopValidation ' +
      'should call the corresponding form function for the given field',
    () => {
      const validate = () => {};
      const { result } = renderUseFormField('firstName', validate);

      result.current.startValidation();
      result.current.stopValidation();
      result.current.onChange('New Values');

      expect(contextMock.startFieldValidation).toHaveBeenCalledWith(
        'firstName',
      );
      expect(contextMock.stopFieldValidation).toHaveBeenCalledWith('firstName');
      expect(contextMock.onFieldChange).toHaveBeenCalledWith(
        'firstName',
        'New Values',
      );
    },
  );
});
