import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import PlaceIcon from '@mui/icons-material/Place';
import { Location } from '../../generated-sources/openapi';
import { FormTextField } from './FormFields';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { RootState } from '../../store';
import ContentBox from '../layout/ContentBox';

export type AddLocationProps = {
  location: Location,
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddLocation({ location, setLocation, setLoading }:AddLocationProps) {
  const user = useSelector((state: RootState) => state.user);

  const locationSchema = Yup.object().shape({
    apiKey: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!')
      .required('Required'),
    address: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!')
      .required('Required'),
    url: Yup.string()
      .min(8, 'Too Short!')
      .required('Required'),
    latitude: Yup.number()
      .required('Required'),
    longitude: Yup.number()
      .required('Required'),
  });

  const saveLocation = async (data:Location, setSubmitting:((isSubmitting: boolean) => void)) => {
    setLoading(true);

    await getAdminAPI(user.accessToken).setLocation(data)
      .then(() => getPublicAPI().getLocation())
      .then((locationResponse: AxiosResponse<Location>) => {
        setLocation(locationResponse.data);
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  return (
    <ContentBox>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" component="div">
            Update Location
          </Typography>
          <PlaceIcon color="primary" />
        </Stack>
        <Formik
          initialValues={location}
          enableReinitialize
          validationSchema={locationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const loc:Location = {
              apiKey: values.apiKey,
              address: values.address,
              url: values.url,
              latitude: Number(values.latitude),
              longitude: Number(values.longitude),
            };
            await saveLocation(loc, setSubmitting);
          }}
        >
          {({
            submitForm, isSubmitting,
          }) => (
            <Form>
              <FormTextField label="Address" name="address" />
              <br />
              <FormTextField label="Latitude" name="latitude" />
              <br />
              <FormTextField label="Longitude" name="longitude" />
              <br />
              <FormTextField label="Google Maps URL" name="url" />
              <br />
              <FormTextField label="Google Maps API Key" name="apiKey" />
              <br />
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
      </CardContent>
    </ContentBox>
  );
}
