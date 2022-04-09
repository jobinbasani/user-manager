import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import classes from './NotFound.module.css';

const NotFound = () => {
    return(
        <Card className={classes["notfound-container"]}>
            <Container maxWidth="sm">
                <CardMedia>
                    <Typography gutterBottom variant="h5" component="div">
                        Page Not Found
                    </Typography>
                </CardMedia>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Looks like you followed a broken link or entered a URL that doesn't exist on this site.
                    </Typography>
                </CardContent>
            </Container>
        </Card>
    );

}

export default NotFound;