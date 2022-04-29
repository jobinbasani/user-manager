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
    const [dateOfBaptism, setDateOfBaptism] = useState(new Date());
    const [dateOfConfirmation, setDateOfConfirmation] = useState(new Date());
    const [dateOfHolyCommunion, setDateOfHolyCommunion] = useState(new Date());

    const handleDOBChange = (newValue: Date | null) => {
          setDateOfBirth(newValue!);
    }

    const handleDateOfBaptism = (newValue: Date | null) => {
        setDateOfBaptism(newValue!);
    }

    const handleDateOfConfirmation = (newValue: Date | null) => {
        setDateOfConfirmation(newValue!);
    }

    const handleDateOfHolyCommunion = (newValue: Date | null) => {
        setDateOfHolyCommunion(newValue!);
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
                <form onSubmit={submitHandler}>
                    <Card elevation={3} className={classes["form-container"]}>
                        <CardContent>
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
                                        label="Date of Birth"
                                        renderInput={(params) => <TextField {...params} /> }
                                        onChange={(date: Date | null) => handleDOBChange(date)}
                                        inputFormat="dd-MMM-yyyy"
                                        />
                                </LocalizationProvider>
                            </div> 
                        </CardContent>
                    </Card>
                    <Card elevation={3} className={classes["form-container"]}>
                        <div className={classes["form-element"]}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={dateOfBaptism}
                                    label="Date of Baptism"
                                    renderInput={(params) => <TextField {...params} /> }
                                    onChange={(date: Date | null) => handleDateOfBaptism(date)}
                                    inputFormat="dd-MMM-yyyy"
                                    />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={dateOfConfirmation}
                                    label="Date of Confirmation"
                                    renderInput={(params) => <TextField {...params} /> }
                                    onChange={(date: Date | null) => handleDateOfConfirmation(date)}
                                    inputFormat="dd-MMM-yyyy"
                                    />
                            </LocalizationProvider>
                        </div>
                        <div className={classes["form-element"]}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={dateOfHolyCommunion}
                                    label="Date of Holy Communion"
                                    renderInput={(params) => <TextField {...params} /> }
                                    onChange={(date: Date | null) => handleDateOfHolyCommunion(date)}
                                    inputFormat="dd-MMM-yyyy"
                                    />
                            </LocalizationProvider> 
                        </div>
                    </Card>
                </form>
            </Box>
    );
}

export default PrimaryApplicant;