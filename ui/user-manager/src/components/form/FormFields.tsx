import { TextField } from 'formik-mui';
import { Field } from 'formik';
import React from 'react';

type TextFieldProps = {
  label: string;
  name:string
};

type TextAreaProps = {
  minRows:number
} & TextFieldProps

export function FormTextField({ label, name }: TextFieldProps) {
  return (
    <Field
      component={TextField}
      label={label}
      name={name}
      margin="dense"
      variant="standard"
      sx={{ minWidth: 200 }}
    />
  );
}

export function FormTextArea({ label, name, minRows }: TextAreaProps) {
  return (
    <Field
      component={TextField}
      multiline
      minRows={minRows}
      label={label}
      name={name}
      margin="dense"
      variant="standard"
      sx={{ minWidth: 200 }}
    />
  );
}
