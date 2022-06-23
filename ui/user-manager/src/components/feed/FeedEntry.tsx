import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Announcement } from '../../generated-sources/openapi';

type FeedProps={
  announcement:Announcement
}

export default function FeedEntry({ announcement }: FeedProps) {
  return (
    <Card sx={{ margin: 5 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {announcement.createdOn}
        </Typography>
        <Typography variant="h5" component="div">
          {announcement.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {announcement.subtitle}
        </Typography>
        <Typography variant="body2">
          {announcement.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
