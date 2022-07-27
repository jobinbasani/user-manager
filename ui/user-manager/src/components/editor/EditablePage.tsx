import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import Button from '@mui/material/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { AxiosResponse } from 'axios';
import RichTextEditor from './RichTextEditor';
import { UserDetails } from '../../store/user/user-slice';
import { PageContent } from '../../generated-sources/openapi';

type EditablePageProps={
  title:string;
  loadData:(()=> Promise<AxiosResponse<PageContent>>);
  submitData:((pageContent: PageContent)=> Promise<AxiosResponse<void>>);
  user:UserDetails;
}

export default function EditablePage({
  title, loadData, submitData, user,
}:EditablePageProps) {
  const [services, setServices] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const cancelEdit = () => setShowEditor(false);
  const onSave = (html:string|undefined) => {
    if (!html) {
      return;
    }
    submitData({ html })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setServices(html);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setShowEditor(false));
  };
  useEffect(() => {
    loadData()
      .then((res) => {
        if (res.status === 200) {
          setServices(res.data?.html || '');
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Stack spacing={2} p={2} sx={{ width: { xs: 0.8, sm: 0.6 } }}>
      <Typography variant="h6">
        {title}
      </Typography>
      { !showEditor && parse(services)}
      <Box>
        {user.isAdmin
          && !showEditor
          && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => setShowEditor(true)}
              startIcon={<BorderColorIcon />}
            >
              Edit
            </Button>
          )}
      </Box>
      {showEditor
        && <RichTextEditor content={services} onEditCancel={cancelEdit} onEditSave={onSave} />}
    </Stack>
  );
}
