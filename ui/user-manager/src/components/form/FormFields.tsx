import { Select, TextField } from 'formik-mui';
import { Field } from 'formik';
import React from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/lab';
import { MenuItem } from '@mui/material';

type TextFieldProps = {
  label: string;
  name:string
};

type TextAreaProps = {
  minRows:number
} & TextFieldProps

type DateFieldProps = {
  value:string|null
  setFieldValue:((field: string, val: any, shouldValidate?: boolean) => void)
} & TextFieldProps

type SelectFieldProps = {
  label:string;
  name:string;
  value:Record<string, string>;
}

export type OptionalDate = string|null

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

export function FormDateField({
  label, name, value, setFieldValue,
}: DateFieldProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        onChange={(v) => setFieldValue(name, v, true)}
        value={value}
        disableFuture
        renderInput={(params) => (
          <Field
            component={TextField}
            margin="dense"
            name={name}
            sx={{ '& .MuiFormHelperText-root': { color: '#d32f2f' } }}
            variant="standard"
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );
}

export function FormDateTimeField({
  label, name, value, setFieldValue,
}: DateFieldProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        onChange={(v) => setFieldValue(name, v, true)}
        value={value}
        disablePast
        renderInput={(params) => (
          <Field
            component={TextField}
            margin="dense"
            name={name}
            sx={{ '& .MuiFormHelperText-root': { color: '#d32f2f' } }}
            variant="standard"
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );
}

export function FormSelectField({ label, name, value }:SelectFieldProps) {
  return (
    <Field
      label={label}
      name={name}
      variant="standard"
      margin="dense"
      sx={{ minWidth: 200 }}
      component={Select}
    >
      {Object.keys(value)
        .map((k) => (
          <MenuItem key={k} value={value[Object.keys(value)[Object.keys(value).indexOf(k)]]}>
            {k.length === 2 ? k.toUpperCase() : k.replace(/([a-z])([A-Z])/g, '$1 $2')}
          </MenuItem>
        ))}
    </Field>
  );
}
