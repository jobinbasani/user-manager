import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Stack } from '@mui/material';
import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import { Announcement } from '../../generated-sources/openapi';
import {
  FormDateTimeField, FormTextArea, FormTextField, OptionalDate,
} from './FormFields';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { RootState } from '../../store';
import ContentBox from '../layout/ContentBox';

type AddAnnouncementProps = {
  setFeeds: React.Dispatch<React.SetStateAction<Announcement[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type AnnouncementRecord = Omit<Announcement, 'expiresOn'> & {
  expiresOn: OptionalDate
}

export default function AddAnnouncement({ setFeeds, setLoading }:AddAnnouncementProps) {
  const user = useSelector((state: RootState) => state.user);

  const initialValues:AnnouncementRecord = {
    id: 'new', description: '', subtitle: '', title: '', createdOn: Date.now().toString(), expiresOn: null,
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

  const saveAnnouncement = async (data:AnnouncementRecord, setSubmitting:((isSubmitting: boolean) => void)) => {
    setLoading(true);
    let expiresOn = 0;
    if (data.expiresOn) {
      expiresOn = Math.floor(new Date(data.expiresOn).getTime() / 1000);
    }
    const announcement:Announcement = {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      createdOn: data.createdOn,
      expiresOn: expiresOn.toString(),
    };
    await getAdminAPI(user.accessToken).addAnnouncement(announcement)
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
    <ContentBox>
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
            submitForm, isSubmitting, values, setFieldValue,
          }) => (
            <Form>
              <FormTextField label="Title" name="title" />
              <br />
              <FormTextField label="Subtitle" name="subtitle" />
              <br />
              <FormTextArea label="Message" name="description" minRows={5} />
              <br />
              <FormDateTimeField label="Expires on" name="expiresOn" value={values.expiresOn} setFieldValue={setFieldValue} />
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
