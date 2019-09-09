import React, { useCallback } from 'react';
import omit from 'lodash/omit';
import { FormProps } from './types';
import useForm from './useForm';
import FormContext from './FormContext';

type Props<T extends object> = FormProps<T> & {
  component?: string | Function;
  children: any;
};

function Form<T extends object>({
  component = 'form',
  children,
  ...props
}: Props<T>) {
  const contextValue = useForm(props);
  const Component = component as any;

  const onSubmit = useCallback(
    e => {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      contextValue.onSubmit();
    },
    [contextValue.onSubmit],
  );

  const passedProps = omit(props, 'value', 'onSubmit', 'children', 'component');
  if (component === 'form') {
    passedProps.onSubmit = onSubmit;
  }

  return (
    <Component {...passedProps}>
      <FormContext.Provider value={contextValue}>
        {typeof children === 'function' ? children(props) : children}
      </FormContext.Provider>
    </Component>
  );
}

export default Form;
