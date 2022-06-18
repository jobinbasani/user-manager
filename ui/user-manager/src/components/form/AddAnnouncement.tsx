import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CampaignIcon from '@mui/icons-material/Campaign';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';

export default function AddAnnouncement() {
  return (
    <Card sx={{ margin: 5 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" component="div">
            Add Announcement
          </Typography>
          <CampaignIcon color="primary" />
        </Stack>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Holy Mass at 5:30
        </Typography>
        <Typography variant="body2">
          All are invited!
        </Typography>
      </CardContent>
    </Card>
  );
}
