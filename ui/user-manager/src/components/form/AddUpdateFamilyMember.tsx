import {
  Form, Formik,
} from 'formik';
import {
  Alert,
  LinearProgress,
} from '@mui/material';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import React, { useEffect, useRef } from 'react';
import {
  UserData,
  UserDataCanadianStatusEnum,
  UserDataGenderEnum,
  UserDataMaritalStatusEnum, UserDataProvinceEnum, UserDataRelationEnum,
} from '../../generated-sources/openapi';
import { getEnumIndexByEnumValue } from '../../util/util';
import {
  FormDateField, FormSelectField, FormTextField, OptionalDate,
} from './FormFields';

export type UserRecord = Omit<UserData,
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

export type AddUpdateFamilyDetailsProps = {
  relatedUser:string;
  editUserId: string|null;
  initialValues: UserRecord;
  showFormFn:React.Dispatch<React.SetStateAction<boolean>>
  onMemberDataSubmit:((data:UserData, editUserId:string|null) => Promise<{ payload: UserData[]; type: string; }>)
};

export default function AddUpdateFamilyMember({
  relatedUser, initialValues, editUserId,
  showFormFn, onMemberDataSubmit,
}:AddUpdateFamilyDetailsProps) {
  const focusRef = useRef<HTMLDivElement>(null);
  const executeScroll = () => focusRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => {
    setTimeout(executeScroll, 500);
  }, [initialValues]);

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
        is: () => relatedUser.length > 0,
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
    await onMemberDataSubmit(userData, editUserId)
      .finally(() => {
        setSubmitting(false);
        showFormFn(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={userInfoSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await saveUserData(values, setSubmitting);
      }}
    >
      {({
        errors, isSubmitting, values, setFieldValue,
      }) => (
        <Form>
          <div ref={focusRef} />
          <FormTextField label="First Name *" name="firstName" />
          <br />
          <FormTextField label="Middle Name" name="middleName" />
          <br />
          <FormTextField label="Last Name *" name="lastName" />
          <br />
          <FormSelectField label="Gender *" name="gender" value={UserDataGenderEnum} />
          <br />
          <FormTextField label="Email *" name="email" />
          <br />
          <FormSelectField label="Marital Status *" name="maritalStatus" value={UserDataMaritalStatusEnum} />
          <br />
          <FormTextField label="Baptismal Name" name="baptismalName" />
          <br />
          {relatedUser.length > 0
            && <FormSelectField label={`Relation to ${relatedUser} *`} name="relation" value={UserDataRelationEnum} />}
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
          <FormSelectField label="Status in Canada *" name="canadianStatus" value={UserDataCanadianStatusEnum} />
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
          <FormSelectField label="Province *" name="province" value={UserDataProvinceEnum} />
          <br />
          <FormTextField label="Postal Code *" name="postalCode" />
          <br />
          <FormTextField label="Mobile Number" name="cell" />
          {isSubmitting && <LinearProgress />}
          <br />
          {Object.keys(errors).length > 0
            && <Alert severity="error">Please fill all mandatory fields(marked with an asterisk *)</Alert>}
          <br />
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
          <Button onClick={() => showFormFn(false)}>Cancel</Button>

        </Form>
      )}
    </Formik>
  );
}
