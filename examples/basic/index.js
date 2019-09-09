/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { Form } from '@fadioit/react-form';
import TextInputField from './TextInputField';

const IdentityForm = () => (
  <Form
    onSubmit={({ firstName, lastName }) =>
      alert(`Your are ${firstName} ${lastName}`)
    }
  >
    <h1>Who are you ?</h1>
    <div style={{ marginBottom: 10 }}>
      <TextInputField
        label="First Name"
        fieldName="firstName"
        validate={required}
      />
    </div>
    <div style={{ marginBottom: 20 }}>
      <TextInputField
        label="Last Name"
        fieldName="lastName"
        validate={required}
      />
    </div>
    <button type="submit">Validate</button>
  </Form>
);

export default IdentityForm;

const required = (value, fieldName) => {
  const fieldValue = value[fieldName];
  if (!fieldValue) {
    return new Error(`field '${fieldName}' is required`, fieldName, 'required');
  }
  return [];
};
