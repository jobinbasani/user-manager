import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import classes from './NotFound.module.css';

function Unauthorized() {
  return (
    <Card className={classes['notfound-container']}>
      <Container maxWidth="sm">
        <CardMedia>
          <Typography gutterBottom variant="h5" component="div">
            Unauthorized
          </Typography>
        </CardMedia>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            You are not authorized to view this page.
          </Typography>
        </CardContent>
      </Container>
    </Card>
  );
}

export default Unauthorized;
