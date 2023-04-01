import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import CollectionsIcon from '@mui/icons-material/Collections';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FormTextField } from './FormFields';
import ContentBox from '../layout/ContentBox';

export type AddCarouselProps = {
  onAddImage:(setSubmitting: (isSubmitting: boolean) => void, image: any, title?: string, subtitle?: string) => Promise<void>
};

export default function AddCarouselItem({ onAddImage }:AddCarouselProps) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    // eslint-disable-next-line consistent-return
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const carouselSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!'),
    subtitle: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!'),
    image: Yup.array()
      .min(1, 'Please select an image file')
      .required('Required'),
  });

  const initialValues = {
    title: '',
    subtitle: '',
    image: '',
  };

  return (
    <ContentBox>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center">
          <CollectionsIcon color="primary" />
          <Typography variant="h6" component="div">
            Add Image
          </Typography>
        </Stack>
        <Formik
          initialValues={initialValues}
          validationSchema={carouselSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await onAddImage(setSubmitting, values.image[0], values.title, values.subtitle);
          }}
        >
          {({
            setFieldValue, submitForm, isSubmitting,
          }) => (
            <Form>
              <FormTextField label="Title" name="title" />
              <FormTextField label="Subtitle" name="subtitle" />
              {selectedFile
              && (
                <>
                  <Box
                    display="flex"
                    textAlign="center"
                    justifyContent="center"
                    flexDirection="column"
                  >
                    <img alt="preview" src={preview} style={{ width: '100%' }} />
                  </Box>
                  <br />
                </>
              )}
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Select Image
                <input
                  name="carouselimage"
                  accept="image/*"
                  type="file"
                  hidden
                  onChange={(e) => {
                    if (!e.target.files || e.target.files.length === 0) {
                      setSelectedFile(undefined);
                      return;
                    }
                    setSelectedFile(e.target.files[0]);
                    setFieldValue('image', Array.from(e.target.files));
                  }}
                />
              </Button>
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
