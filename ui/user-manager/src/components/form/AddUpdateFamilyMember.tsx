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
import { dateString, getEnumIndexByEnumValue } from '../../util/util';
import {
  FormDateField, FormSelectField, FormTextField, OptionalDate,
} from './FormFields';

export type UserRecord = Omit<UserData,
'dateOfBirth'|
'dateOfConfirmation'|
'dateOfBaptism'|
'dateOfMarriage'|
'inCanadaSince'|
'canadianStatus'|
'maritalStatus'|
'gender'|
'relation'
> &{
  dateOfBirth:OptionalDate
  dateOfConfirmation:OptionalDate
  dateOfBaptism:OptionalDate
  dateOfMarriage:OptionalDate
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
    setTimeout(executeScroll, 600);
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
      dateOfBaptism: data.dateOfBaptism ? dateString(data.dateOfBaptism.toString()) : undefined,
      dateOfBirth: data.dateOfBirth ? dateString(data.dateOfBirth.toString()) : '',
      dateOfConfirmation: data.dateOfConfirmation ? dateString(data.dateOfConfirmation.toString()) : undefined,
      dateOfMarriage: data.dateOfMarriage ? dateString(data.dateOfMarriage.toString()) : undefined,
      dioceseInIndia: data.dioceseInIndia,
      email: data.email,
      familyUnit: data.familyUnit,
      firstName: data.firstName,
      gender: getEnumIndexByEnumValue(UserDataGenderEnum, data.gender) >= 0
        ? Object.values(UserDataGenderEnum)[getEnumIndexByEnumValue(UserDataGenderEnum, data.gender)]
        : UserDataGenderEnum.Male,
      homeParish: data.homeParish,
      profession: data.profession,
      houseName: data.houseName,
      inCanadaSince: data.inCanadaSince ? dateString(data.inCanadaSince.toString()) : undefined,
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
          <FormTextField label="Middle Name" name="middleName" />
          <FormTextField label="Last Name *" name="lastName" />
          <FormSelectField label="Gender *" name="gender" value={UserDataGenderEnum} />
          <FormTextField label="Email *" name="email" />
          <FormSelectField label="Marital Status" name="maritalStatus" value={UserDataMaritalStatusEnum} />
          <FormDateField
            hidden={values?.maritalStatus?.toLowerCase() !== 'married'}
            value={values.dateOfMarriage}
            setFieldValue={setFieldValue}
            label="Date of Marriage *"
            name="dateOfMarriage"
          />
          <FormTextField label="Baptismal Name" name="baptismalName" />
          <FormSelectField hidden={relatedUser.length > 0} label={`Relation to ${relatedUser} *`} name="relation" value={UserDataRelationEnum} />
          <FormTextField label="House Name" name="houseName" />
          <FormTextField label="Family Unit" name="familyUnit" />
          <FormDateField value={values.dateOfBirth} setFieldValue={setFieldValue} label="Date of Birth *" name="dateOfBirth" />
          <FormDateField value={values.dateOfBaptism} setFieldValue={setFieldValue} label="Date of Baptism" name="dateOfBaptism" />
          <FormDateField value={values.dateOfConfirmation} setFieldValue={setFieldValue} label="Date of Confirmation" name="dateOfConfirmation" />
          <FormSelectField label="Status in Canada *" name="canadianStatus" value={UserDataCanadianStatusEnum} />
          <FormDateField value={values.inCanadaSince} setFieldValue={setFieldValue} label="In Canada since" name="inCanadaSince" />
          <FormTextField label="Profession" name="profession" />
          <FormTextField label="Home Parish" name="homeParish" />
          <FormTextField label="Diocese in India" name="dioceseInIndia" />
          <FormTextField label="Previous Parish in Canada" name="previousParish" />
          <FormTextField label="Apt #" name="apartment" />
          <FormTextField label="Street # and name *" name="street" />
          <FormTextField label="City *" name="city" />
          <FormSelectField label="Province *" name="province" value={UserDataProvinceEnum} />
          <FormTextField label="Postal Code *" name="postalCode" />
          <FormTextField label="Mobile Number" name="mobile" />
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
