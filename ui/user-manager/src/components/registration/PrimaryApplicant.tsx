import { 
    FormControl,
    CardContent,
    Typography,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    TextField,
    Card, 
    } from '@mui/material';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import classes from './Registration.module.css';
import { useState } from 'react';

const PrimaryApplicant = () => {
    const [dateOfBirth, setDateOfBirth] = useState(new Date());

    const handleDOBChange = (newValue: Date | null) => {
          setDateOfBirth(newValue!);
    }

    const submitHandler = () => {

    }

    const handleGenderSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Selected: " + (event.target as HTMLInputElement).value);
    }

    return (
            <Box>
                <Typography gutterBottom variant="h5" component="div" className={classes["form-title"]}>
                   PART A – PRIMARY APPLICANT INFORMATION
                </Typography>
                <Card elevation={3} className={classes["form-container"]}>
                    <CardContent>

                        <form onSubmit={submitHandler}>
                            <div className={classes["form-element"]}>
                                <TextField
                                    id="first-name"
                                    label="First Name"
                                    placeholder="First Name"
                                    margin="normal"
                                    className={classes["form-text-field"]}
                                    fullWidth
                                    />
                                <TextField
                                    id="middle-name"
                                    label="Middle Name"
                                    placeholder="Middle Name"
                                    margin="normal"
                                    className={classes["form-text-field"]}
                                    fullWidth
                                    />
                                <TextField
                                    id="last-name"
                                    label="Last Name"
                                    placeholder="Last Name"
                                    margin="normal"
                                    className={classes["form-text-field"]}
                                    fullWidth
                                    />
                            </div>
                            <div className={classes["form-element"]}>
                                <TextField
                                    id="baptismal-name"
                                    label="Baptismal Name"
                                    placeholder="Baptismal Name"
                                    margin="normal"
                                    style ={{width: '100%'}}
                                    className={classes["form-text-field"]}
                                    fullWidth
                                    />
                                <TextField
                                    id="house-name"
                                    label="House Name"
                                    placeholder="House Name"
                                    margin="normal"
                                    style ={{width: '100%'}}
                                    className={classes["form-text-field"]}
                                    fullWidth={true}
                                    />
                            </div>
                            <div className={classes["form-element"]}>
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                        onChange={handleGenderSelection}
                                        row
                                        >
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    </RadioGroup>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={dateOfBirth}
                                    renderInput={(params) => <TextField {...params} /> }
                                    onChange={(date: Date | null) => handleDOBChange(date)}
                                    inputFormat="dd-MMM-yyyy"
                                    />
                                </LocalizationProvider>
                            </div>

                        </form>
                        
                    </CardContent>
                </Card>
            </Box>
    );
}

export default PrimaryApplicant;