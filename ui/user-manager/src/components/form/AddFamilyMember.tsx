import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import TextFieldMUI from '@mui/material/TextField';
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
  birthday: number
}

export default function AddFamilyMember() {
  const initialValues:Values = {
    firstName: '',
    lastName: '',
    middleName: '',
    baptismalName: '',
    houseName: '',
    familyUnit: '',
    birthday: Date.now(),
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
        errors, submitForm, isSubmitting, touched, values, setFieldValue,
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              onChange={(value) => setFieldValue('birthday', value, true)}
              value={values.birthday}
              renderInput={(params) => (
                <TextFieldMUI
                  error={Boolean(touched.birthday && errors.birthday)}
                  helperText={touched.birthday && errors.birthday}
                  label="Birthday"
                  margin="dense"
                  name="birthday"
                  variant="standard"
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
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
