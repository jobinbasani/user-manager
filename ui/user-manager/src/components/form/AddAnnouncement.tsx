import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CampaignIcon from '@mui/icons-material/Campaign';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import { Announcement } from '../../generated-sources/openapi';
import { FormTextArea, FormTextField } from './FormFields';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { RootState } from '../../store';

type AddAnnouncementProps = {
  setFeeds: React.Dispatch<React.SetStateAction<Announcement[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddAnnouncement({ setFeeds, setLoading }:AddAnnouncementProps) {
  const user = useSelector((state: RootState) => state.user);

  const initialValues:Announcement = {
    id: 'new', description: '', subtitle: '', title: '', createdOn: Date.now().toString(), expiresOn: '',
  };

  const announcementSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!')
      .required('Required'),
    subtitle: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!'),
    description: Yup.string()
      .min(2, 'Too Short!')
      .max(1000, 'Too Long!')
      .required('Required'),
  });

  const saveAnnouncement = async (data:Announcement, setSubmitting:((isSubmitting: boolean) => void)) => {
    setLoading(true);
    await getAdminAPI(user.accessToken).addAnnouncement(data)
      .then(() => getPublicAPI().getAnnouncements())
      .then((feeds: AxiosResponse<Array<Announcement>>) => {
        if (feeds.data.length > 0) {
          setFeeds(feeds.data);
        }
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  return (
    <Card sx={{ margin: 5 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" component="div">
            Add Announcement
          </Typography>
          <CampaignIcon color="primary" />
        </Stack>
        <Formik
          initialValues={initialValues}
          validationSchema={announcementSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await saveAnnouncement(values, setSubmitting);
          }}
        >
          {({
            submitForm, isSubmitting,
          }) => (
            <Form>
              <FormTextField label="Title" name="title" />
              <br />
              <FormTextField label="Subtitle" name="subtitle" />
              <br />
              <FormTextArea label="Message" name="description" minRows={5} />
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
    </Card>
  );
}
