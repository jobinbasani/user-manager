import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

export default function FeedEntry() {
  return (
    <Card sx={{ margin: 5 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          23rd May
        </Typography>
        <Typography variant="h5" component="div">
          Ascension of Christ
        </Typography>
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
