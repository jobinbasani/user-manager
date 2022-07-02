import {
  Field, Form, Formik,
} from 'formik';
import { Select } from 'formik-mui';
import {
  LinearProgress, MenuItem,
} from '@mui/material';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import {
  UserData,
  UserDataCanadianStatusEnum,
  UserDataGenderEnum,
  UserDataMaritalStatusEnum, UserDataProvinceEnum, UserDataRelationEnum,
} from '../../generated-sources/openapi';
import { getEnumIndexByEnumValue } from '../../util/util';
import { getFamilyManagementAPI } from '../../api/api';
import { RootState } from '../../store';
import { setFamilyDetails } from '../../store/family/family-slice';
import { FormDateField, FormTextField, OptionalDate } from './FormFields';

type FormProps = {
  showFormFn:React.Dispatch<React.SetStateAction<boolean>>
}

type UserRecord = Omit<UserData,
'dateOfBirth'|
'dateOfConfirmation'|
'dateOfBaptism'|
'inCanadaSince'|
'canadianStatus'|
'maritalStatus'|
'gender'|
'relation'
> &{
  dateOfBirth:OptionalDate
  dateOfConfirmation:OptionalDate
  dateOfBaptism:OptionalDate
  inCanadaSince:OptionalDate
  canadianStatus:string
  maritalStatus:string
  gender:string
  relation:string
};

export default function AddFamilyMember({ showFormFn }:FormProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const family = useSelector((state: RootState) => state.family);

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
    relation: Yup.string()
      .when('firstName', {
        is: () => family.members.length > 0,
        then: (schema) => schema.required('Required'),
      }),
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

  const getInitialValues = () => {
    const initialValues:UserRecord = {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      gender: '',
      baptismalName: '',
      relation: '',
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

    if (family.members.length === 0) {
      initialValues.firstName = user.userInfo.firstName;
      initialValues.lastName = user.userInfo.lastName;
      initialValues.email = user.userInfo.userEmail;
    } else {
      const primaryAcct = family.members[0];
      initialValues.familyUnit = primaryAcct.familyUnit;
      initialValues.apartment = primaryAcct.apartment;
      initialValues.street = primaryAcct.street;
      initialValues.city = primaryAcct.city;
      initialValues.postalCode = primaryAcct.postalCode;
    }
    return initialValues;
  };

  const saveUserData = async (data:UserRecord, setSubmitting:((isSubmitting: boolean) => void)) => {
    const userData:UserData = {
      apartment: data.apartment,
      baptismalName: data.baptismalName,
      canadianStatus: getEnumIndexByEnumValue(UserDataCanadianStatusEnum, data.canadianStatus) >= 0
        ? Object.values(UserDataCanadianStatusEnum)[getEnumIndexByEnumValue(UserDataCanadianStatusEnum, data.canadianStatus)]
        : UserDataCanadianStatusEnum.Citizen,
      relation: getEnumIndexByEnumValue(UserDataRelationEnum, data.relation) >= 0
        ? Object.values(UserDataRelationEnum)[getEnumIndexByEnumValue(UserDataRelationEnum, data.relation)]
        : undefined,
      city: data.city,
      dateOfBaptism: data.dateOfBaptism ? data.dateOfBaptism.toString() : undefined,
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toString() : '',
      dateOfConfirmation: data.dateOfConfirmation ? data.dateOfConfirmation.toString() : undefined,
      dioceseInIndia: data.dioceseInIndia,
      email: data.email,
      familyUnit: data.familyUnit,
      firstName: data.firstName,
      gender: getEnumIndexByEnumValue(UserDataGenderEnum, data.gender) >= 0
        ? Object.values(UserDataGenderEnum)[getEnumIndexByEnumValue(UserDataGenderEnum, data.gender)]
        : UserDataGenderEnum.Male,
      homeParish: data.homeParish,
      houseName: data.houseName,
      inCanadaSince: data.inCanadaSince ? data.inCanadaSince.toString() : undefined,
      lastName: data.lastName,
      maritalStatus: getEnumIndexByEnumValue(UserDataMaritalStatusEnum, data.maritalStatus) >= 0
        ? Object.values(UserDataMaritalStatusEnum)[getEnumIndexByEnumValue(UserDataMaritalStatusEnum, data.maritalStatus)]
        : undefined,
      middleName: data.middleName,
      mobile: data.mobile,
      postalCode: data.postalCode,
      previousParishInCanada: data.previousParishInCanada,
      province: getEnumIndexByEnumValue(UserDataProvinceEnum, data.province ?? 'NS') >= 0
        ? Object.values(UserDataProvinceEnum)[getEnumIndexByEnumValue(UserDataProvinceEnum, data.province ?? 'NS')]
        : UserDataProvinceEnum.Ns,
      street: data.street,
    };
    await getFamilyManagementAPI(user.accessToken).addFamilyMembers([userData])
      .then(() => getFamilyManagementAPI(user.accessToken).getUserFamily())
      .then((familyDetails) => dispatch(setFamilyDetails(familyDetails.data)))
      .finally(() => {
        setSubmitting(false);
        showFormFn(false);
      });
  };

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
      initialValues={getInitialValues()}
      validationSchema={userInfoSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await saveUserData(values, setSubmitting);
      }}
    >
      {({
        submitForm, isSubmitting, values, setFieldValue,
      }) => (
        <Form>
          <FormTextField label="First Name *" name="firstName" />
          <br />
          <FormTextField label="Middle Name" name="middleName" />
          <br />
          <FormTextField label="Last Name *" name="lastName" />
          <br />
          {selectField('Gender *', 'gender', UserDataGenderEnum)}
          <br />
          <FormTextField label="Email *" name="email" />
          <br />
          {selectField('Marital Status *', 'maritalStatus', UserDataMaritalStatusEnum)}
          <br />
          <FormTextField label="Baptismal Name" name="baptismalName" />
          <br />
          {family.members.length > 0
            && selectField(`Relation to ${user.userInfo.firstName} *`, 'relation', UserDataRelationEnum)}
          <br />
          <FormTextField label="House Name" name="houseName" />
          <br />
          <FormTextField label="Family Unit" name="familyUnit" />
          <br />
          <FormDateField value={values.dateOfBirth} setFieldValue={setFieldValue} label="Date of Birth *" name="dateOfBirth" />
          <br />
          <FormDateField value={values.dateOfBaptism} setFieldValue={setFieldValue} label="Date of Baptism" name="dateOfBaptism" />
          <br />
          <FormDateField value={values.dateOfConfirmation} setFieldValue={setFieldValue} label="Date of Confirmation" name="dateOfConfirmation" />
          <br />
          {selectField('Status in Canada *', 'canadianStatus', UserDataCanadianStatusEnum)}
          <br />
          <FormDateField value={values.inCanadaSince} setFieldValue={setFieldValue} label="In Canada since" name="inCanadaSince" />
          <br />
          <FormTextField label="Home Parish" name="homeParish" />
          <br />
          <FormTextField label="Diocese in India" name="dioceseInIndia" />
          <br />
          <FormTextField label="Previous Parish in Canada" name="previousParish" />
          <br />
          <FormTextField label="Apt #" name="apartment" />
          <br />
          <FormTextField label="Street # and name *" name="street" />
          <br />
          <FormTextField label="City *" name="city" />
          <br />
          {selectField('Province *', 'province', UserDataProvinceEnum)}
          <br />
          <FormTextField label="Postal Code *" name="postalCode" />
          <br />
          <FormTextField label="Mobile Number" name="cell" />
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
