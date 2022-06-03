import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { LinearProgress } from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

interface Values {
  firstName: string
  lastName: string
  middleName:string
  baptismalName:string
  houseName:string
  familyUnit:string
  birthday: string
  baptism:string
}

export default function AddFamilyMember() {
  const initialValues:Values = {
    firstName: '',
    lastName: '',
    middleName: '',
    baptismalName: '',
    houseName: '',
    familyUnit: '',
    birthday: '',
    baptism: '',
  };

  const textField = (label:string, name:string) => (
    <Field
      component={TextField}
      label={label}
      name={name}
      margin="dense"
      variant="standard"
    />
  );
    // eslint-disable-next-line max-len
  const dateField = (label:string, name:string, value:string, setFieldValue:((field: string, val: any, shouldValidate?: boolean) => void)) => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        onChange={(v) => setFieldValue(name, v, true)}
        value={value}
        renderInput={(params) => (
          <Field
            component={TextField}
            margin="dense"
            name={name}
            variant="standard"
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );
  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors: Partial<Values> = {};
        if (!values.firstName) {
          errors.firstName = 'Required';
        }
        if (!values.lastName) {
          errors.lastName = 'Required';
        }
        if (!values.birthday) {
          errors.birthday = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
          console.log(values);
        }, 500);
      }}
    >
      {({
        submitForm, isSubmitting, values, setFieldValue,
      }) => (
        <Form>
          {textField('First Name', 'firstName')}
          <br />
          {textField('Middle Name', 'middleName')}
          <br />
          {textField('Last Name', 'lastName')}
          <br />
          {textField('Baptismal Name', 'baptismalName')}
          <br />
          {textField('House Name', 'houseName')}
          <br />
          {textField('Family Unit', 'familyUnit')}
          <br />
          {dateField('Date of Birth', 'birthday', values.birthday, setFieldValue)}
          <br />
          {dateField('Date of Baptism', 'baptism', values.baptism, setFieldValue)}
          {isSubmitting && <LinearProgress />}
          <br />
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={submitForm}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}
