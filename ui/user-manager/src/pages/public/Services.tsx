import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import RichTextEditor from '../../components/editor/RichTextEditor';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { RootState } from '../../store';

export default function Services() {
  const [services, setServices] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const cancelEdit = () => setShowEditor(false);
  const onSave = (html:string|undefined) => {
    if (!html) {
      return;
    }
    getAdminAPI(user.accessToken)
      .setServiceData({ html })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setServices(html);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setShowEditor(false));
  };
  useEffect(() => {
    getPublicAPI()
      .getServices()
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
        Services
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
