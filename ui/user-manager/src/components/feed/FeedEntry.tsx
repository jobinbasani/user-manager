import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Announcement } from '../../generated-sources/openapi';

export default function FeedEntry({
  id, title, subtitle, description, expiresOn, createdOn,
}: Announcement) {
  return (
    <Card sx={{ margin: 5 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {createdOn}
        </Typography>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {subtitle}
        </Typography>
        <Typography variant="body2">
          {description + id + expiresOn}
        </Typography>
      </CardContent>
    </Card>
  );
}
