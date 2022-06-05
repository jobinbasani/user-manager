import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { LinearProgress } from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import * as Yup from 'yup';

type OptionalDate = string|null

interface Values {
  firstName: string
  lastName: string
  middleName:string
  email:string
  baptismalName:string
  houseName:string
  familyUnit:string
  birthday: OptionalDate
  baptismDate:OptionalDate
  confirmationDate:OptionalDate
}

export default function AddFamilyMember() {
  const userInfoSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    middleName: Yup.string()
      .max(50, 'Too Long!'),
    email: Yup.string()
      .email('Invalid email').required('Required'),
    baptismalName: Yup.string()
      .max(50, 'Too Long!'),
    houseName: Yup.string()
      .max(50, 'Too Long!'),
    familyUnit: Yup.string()
      .max(50, 'Too Long!'),
    birthday: Yup.date()
      .required('Required'),
    baptismDate: Yup.date(),
    confirmationDate: Yup.date(),
  });

  const initialValues:Values = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    baptismalName: '',
    houseName: '',
    familyUnit: '',
    birthday: null,
    baptismDate: null,
    confirmationDate: null,
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
  const dateField = (label:string, name:string, value:string|null, setFieldValue:((field: string, val: any, shouldValidate?: boolean) => void)) => (
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
      validationSchema={userInfoSchema}
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
          {textField('Email', 'email')}
          <br />
          {textField('Baptismal Name', 'baptismalName')}
          <br />
          {textField('House Name', 'houseName')}
          <br />
          {textField('Family Unit', 'familyUnit')}
          <br />
          {dateField('Date of Birth', 'birthday', values.birthday, setFieldValue)}
          <br />
          {dateField('Date of Baptism', 'baptismDate', values.baptismDate, setFieldValue)}
          <br />
          {dateField('Date of Confirmation', 'confirmationDate', values.confirmationDate, setFieldValue)}
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
