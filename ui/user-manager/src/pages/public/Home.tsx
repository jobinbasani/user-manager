import { Grid, Card } from '@mui/material';
import HomeCarousel from '../../components/carousel/HomeCarousel';
import PastoralMessage from '../../components/message/PastoralMessage';

function Home() {
  return (
    <div>
      <HomeCarousel />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <PastoralMessage />
        </Grid>
        <Grid item xs={4}>
          <Card elevation={3}>xs=4</Card>
        </Grid>

      </Grid>
    </div>
  );
}

export default Home;
