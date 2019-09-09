/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import { Form } from '@fadioit/react-form';
import { Prompt } from 'react-router-dom';
import TextInputField from './TextInputField';

const ContactForm = ({ value, onSubmit: propsOnSubmit }) => {
  const [formKey, setFormKey] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isSubmiting = useRef(false);

  const onCancel = () => {
    setFormKey(formKey => formKey + 1);
    setIsDirty(false);
  };

  const onSubmit = value => {
    isSubmiting.current = true;
    propsOnSubmit(value);
    onCancel();
  };

  return (
    <Form
      key={formKey}
      value={value}
      onSubmit={onSubmit}
      onChange={({ isValid, isDirty }) => {
        setIsValid(isValid);
        setIsDirty(isDirty);
      }}
      style={{ padding: 20 }}
    >
      <Prompt
        when={isDirty}
        message={() => {
          if (!isSubmiting.current) {
            return 'If you leave this page your changes will be lost, are you sure ?';
          }
          return null;
        }}
      />
      <TextInputField
        label="First Name"
        fieldName="firstName"
        validate={validateName}
        required
      />
      <TextInputField
        label="Last Name"
        fieldName="lastName"
        validate={validateName}
        required
      />
      <TextInputField
        label="Job"
        fieldName="job"
        validate={validateJob}
        required
      />
      <button type="button" disabled={!isDirty} onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" disabled={!isDirty || !isValid}>
        Validate
      </button>
    </Form>
  );
};

export default ContactForm;

const validateName = (value, fieldName) => {
  const fieldValue = value[fieldName];
  if (!fieldValue) {
    return 'This field is required.';
  }
  if (fieldValue.length < 2) {
    return 'This field should contains at least 2 characters.';
  }
  return null;
};

const validateJob = (value, fieldName) => {
  const fieldValue = value[fieldName];
  if (fieldValue && fieldValue.length < 3) {
    return 'This field should contains at least 3 characters.';
  }
  return null;
};
