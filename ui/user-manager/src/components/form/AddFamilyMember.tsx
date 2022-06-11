import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import {
  LinearProgress, MenuItem,
} from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import * as Yup from 'yup';
import {
  UserData,
  UserDataCanadianStatusEnum,
  UserDataGenderEnum,
  UserDataMaritalStatusEnum, UserDataProvinceEnum,
} from '../../generated-sources/openapi';

type OptionalDate = string|null

type UserRecord = Omit<UserData, 'gender'|'dateOfBirth'|'inCanadaSince'|'dateOfConfirmation'|'dateOfBaptism'|'canadianStatus'|'maritalStatus'> &{
  dateOfBirth:OptionalDate
  dateOfConfirmation:OptionalDate
  dateOfBaptism:OptionalDate
  inCanadaSince:OptionalDate
  canadianStatus:string
  maritalStatus:string
  gender:string
};

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
    gender: Yup.string()
      .required('Required'),
    baptismalName: Yup.string()
      .max(50, 'Too Long!'),
    houseName: Yup.string()
      .max(50, 'Too Long!'),
    familyUnit: Yup.string()
      .max(50, 'Too Long!'),
    dateOfBirth: Yup.date()
      .typeError('Please provide a valid date')
      .required('Required'),
    canadianStatus: Yup.string()
      .required('Required'),
    street: Yup.string()
      .min(4).required('Required'),
    city: Yup.string()
      .min(4).required('Required'),
    province: Yup.string()
      .required('Required'),
    postalCode: Yup.string()
      .min(6).max(7).required('Required'),
  });

  const initialValues:UserRecord = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    gender: '',
    baptismalName: '',
    houseName: '',
    familyUnit: '',
    dateOfBirth: null,
    dateOfBaptism: null,
    dateOfConfirmation: null,
    maritalStatus: '',
    canadianStatus: '',
    inCanadaSince: null,
    homeParish: '',
    dioceseInIndia: '',
    previousParishInCanada: '',
    apartment: '',
    street: '',
    city: '',
    province: UserDataProvinceEnum.Ns,
    postalCode: '',
    mobile: '',
  };

  const textField = (label:string, name:string) => (
    <Field
      component={TextField}
      label={label}
      name={name}
      margin="dense"
      variant="standard"
      sx={{ minWidth: 200 }}
    />
  );

  // eslint-disable-next-line max-len
  const dateField = (label:string, name:string, value:string|null, setFieldValue:((field: string, val: any, shouldValidate?: boolean) => void)) => (
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

  const selectField = (label:string, name:string, value:Record<string, string>) => (
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
          {selectField('Gender', 'gender', UserDataGenderEnum)}
          <br />
          {textField('Email', 'email')}
          <br />
          {selectField('Marital Status', 'maritalStatus', UserDataMaritalStatusEnum)}
          <br />
          {textField('Baptismal Name', 'baptismalName')}
          <br />
          {textField('House Name', 'houseName')}
          <br />
          {textField('Family Unit', 'familyUnit')}
          <br />
          {dateField('Date of Birth', 'dateOfBirth', values.dateOfBirth, setFieldValue)}
          <br />
          {dateField('Date of Baptism', 'dateOfBaptism', values.dateOfBaptism, setFieldValue)}
          <br />
          {dateField('Date of Confirmation', 'dateOfConfirmation', values.dateOfConfirmation, setFieldValue)}
          <br />
          {selectField('Status in Canada', 'canadianStatus', UserDataCanadianStatusEnum)}
          <br />
          {dateField('In Canada since', 'inCanadaSince', values.inCanadaSince, setFieldValue)}
          <br />
          {textField('Home Parish', 'homeParish')}
          <br />
          {textField('Diocese in India', 'dioceseInIndia')}
          <br />
          {textField('Previous Parish in Canada', 'previousParish')}
          <br />
          {textField('Apt #', 'apartment')}
          <br />
          {textField('Street # and name', 'street')}
          <br />
          {textField('City', 'city')}
          <br />
          {selectField('Province', 'province', UserDataProvinceEnum)}
          <br />
          {textField('Postal Code', 'postalCode')}
          <br />
          {textField('Mobile Number', 'cell')}
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
