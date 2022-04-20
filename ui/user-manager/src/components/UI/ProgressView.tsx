/** Generic progress view with a spinner */

import { Typography, 
         Container, 
         Card, 
         CircularProgress, 
         Box } from '@mui/material';
import classes from "./ProgressView.module.css";

interface ProgressViewProps {
    text: String;
}

const ProgressView = (props: ProgressViewProps) => {

    return(
        <Card className={classes["progress-container"]}>
            <Container maxWidth="sm"> 
                <Box sx={{ display: 'flex' }} 
                     style={{   padding: '3rem',
                                justifyContent:'center',
                                alignContent: 'center',
                                alignItems: 'center'}}>
                    <CircularProgress />
                </Box>
                <Typography textAlign="center">
                   {props.text}
                </Typography>
            </Container>
        </Card>
    );

}

export default ProgressView;