import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { LinearProgress } from '@mui/material';
import Button from '@mui/material/Button';

interface Values {
  firstName: string;
  lastName: string;
  middleName:string;
}

export default function AddFamilyMember() {
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        middleName: '',
      }}
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
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Field
            component={TextField}
            label="First Name"
            name="firstName"
            margin="dense"
            variant="standard"
          />
          <br />
          <Field
            component={TextField}
            label="Middle Name"
            name="middleName"
            margin="dense"
            variant="standard"
          />
          <br />
          <Field
            component={TextField}
            label="Last Name"
            name="lastName"
            margin="dense"
            variant="standard"
          />
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
