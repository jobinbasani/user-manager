import { Form, Formik, FormikValues } from 'formik';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Image } from 'react-grid-gallery';
import { FormTextField } from '../form/FormFields';
import ContentBox from '../layout/ContentBox';
import RichTextEditor from '../editor/RichTextEditor';
import { AdminProps } from '../../pages/private/Admin';
import { getAdminAPI } from '../../api/api';
import ImageGallery from '../images/ImageGallery';
import { PageContent } from '../../generated-sources/openapi';

type EditPageContentProps = AdminProps & {
  title?:string
  subtitles?:string[]
  backgroundImage?:string
  html?:string
  onSave:(data: PageContent)=> Promise<void>
  onCancel?:()=>void
  hidden?:boolean
  saveButtonLabel?:string
}
export default function EditPageContent({
  hidden, user, title, subtitles, backgroundImage, html, onSave, onCancel, saveButtonLabel,
}:EditPageContentProps) {
  if (hidden) {
    return null;
  }
  const [images, setImages] = useState<Image[]>([]);

  const loadImages = () => {
    getAdminAPI(user.accessToken).getBackgroundImages()
      .then((itemsResp) => setImages(
        itemsResp.data.map((bg) => bg as Image)
          .map((im) => (im.src === (backgroundImage || '') ? { ...im, isSelected: true } : im)),
      ));
  };

  useEffect(() => {
    loadImages();
  }, [user]);

  const onImageSelection = (nextImages:Image[], fieldName:string, setFieldValue:(field: string, value: any) => void) => {
    setImages(nextImages);
    const selectedImage = nextImages.find((im) => im.isSelected === true);
    setFieldValue(fieldName, selectedImage ? selectedImage.src : '');
  };

  const saveData = async (values:FormikValues) => {
    const pageContent:PageContent = {};
    if (values.title && values.title.length > 0) {
      pageContent.title = values.title;
    }
    if (values.subtitle && values.subtitle.length > 0) {
      pageContent.subtitles = [values.subtitle];
    }
    if (values.backgroundImage && values.backgroundImage.length > 0) {
      pageContent.backgroundImage = values.backgroundImage;
    }
    if (values.html && values.html.length > 0) {
      pageContent.html = values.html;
    }
    await onSave(pageContent);
  };

  const pageContentSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!'),
  });

  const initialValues = {
    title: title || '',
    subtitle: subtitles && subtitles.length > 0 ? subtitles[0] : '',
    html: html || '',
    backgroundImage: backgroundImage || '',
  };

  return (
    <ContentBox>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={pageContentSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await saveData(values);
            setSubmitting(false);
            resetForm();
          }}
        >
          {({
            setFieldValue, submitForm, isSubmitting,
          }) => (
            <Form>
              <FormTextField label="Title" name="title" />
              <FormTextField label="Subtitle" name="subtitle" />
              <Typography variant="h6" component="div">
                Background
              </Typography>
              <ImageGallery images={images} onSelect={(nextImages:Image[]) => onImageSelection(nextImages, 'backgroundImage', setFieldValue)} singleSelectOnly />
              <br />
              <Typography variant="h6" component="div">
                Content
              </Typography>
              <RichTextEditor content={html} onChange={(ct) => { setFieldValue('html', ct); }} />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                {saveButtonLabel || 'Submit'}
              </Button>
              {onCancel
                && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={onCancel}
                    sx={{ marginLeft: 2 }}
                  >
                    Cancel
                  </Button>
                )}
            </Form>
          )}
        </Formik>
      </CardContent>
    </ContentBox>
  );
}
