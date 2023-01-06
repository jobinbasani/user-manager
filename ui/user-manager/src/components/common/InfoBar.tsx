import { AlertColor, Snackbar } from '@mui/material';
import React, {
  Dispatch, forwardRef, SetStateAction, SyntheticEvent,
} from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type InfoBarProps = {
  isOpen: boolean
  onClose: () => void
  autoHideDuration?:number
  message:string
  severity:AlertColor
}

const Alert = forwardRef<HTMLDivElement, AlertProps>((
  props,
  ref,
) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const checkAndCloseSnackBar = (fn: Dispatch<SetStateAction<boolean>>, event?: SyntheticEvent | Event, reason?: string) => {
  if (reason === 'clickaway') {
    return;
  }
  fn(false);
};

export default function InfoBar({
  isOpen, onClose, autoHideDuration, message, severity,
}:InfoBarProps) {
  return (
    <Snackbar open={isOpen} autoHideDuration={autoHideDuration || 3000} onClose={() => { checkAndCloseSnackBar(onClose); }}>
      <Alert onClose={() => { checkAndCloseSnackBar(onClose); }} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
