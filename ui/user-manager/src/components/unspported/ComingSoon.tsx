import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import classes from './NotFound.module.css';

const ComingSoon = () => {
    return(
        <Card className={classes["notfound-container"]}>
        <Container maxWidth="sm">
            <CardMedia>
                <Typography gutterBottom variant="h5" component="div">
                    Coming Soon ...
                </Typography>
            </CardMedia>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    This page has not been created yet. We are working on it. Stay Tuned.
                </Typography>
            </CardContent>
        </Container>
    </Card>
    );

}

export default ComingSoon;