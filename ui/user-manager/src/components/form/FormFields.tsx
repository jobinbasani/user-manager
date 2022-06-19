import { TextField } from 'formik-mui';
import { Field } from 'formik';
import React from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/lab';

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
