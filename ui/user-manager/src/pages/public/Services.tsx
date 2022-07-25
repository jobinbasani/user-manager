import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import RichTextEditor from '../../components/editor/RichTextEditor';

function Services() {
  return (
    <Stack spacing={2} p={2} sx={{ width: { xs: 0.8, sm: 0.6 } }}>
      <Typography variant="h6" gutterBottom component="div">
        Services
      </Typography>
      <RichTextEditor />
    </Stack>
  );
}

export default Services;
