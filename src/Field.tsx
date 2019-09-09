import { Validator } from './types';
import useFormField from './useFormField';

type Props = {
  fieldName: string;
  validate?: Validator;
  children: (t: ReturnType<typeof useFormField>) => any;
};

function Field({ fieldName, validate, children }: Props) {
  const fieldProps = useFormField(fieldName, validate);
  return children(fieldProps);
}

export default Field;
