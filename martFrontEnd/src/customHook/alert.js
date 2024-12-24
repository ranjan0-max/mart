import React, { useState } from 'react';
// import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const useSnackbarAlert = () => {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('success'); // Default severity
    const [message, setMessage] = useState('');
    const [anchorOrigin, setAnchorOrigin] = useState({ vertical: 'top', horizontal: 'right' });

    const handleOpen = (msg, severity = 'success', position = { vertical: 'top', horizontal: 'right' }) => {
        setMessage(msg);
        setSeverity(severity);
        setAnchorOrigin(position);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const SnackbarComponent = () => (
        <Snackbar open={open} autoHideDuration={1000} anchorOrigin={anchorOrigin} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );

    return { handleOpen, handleClose, SnackbarComponent };
};

export default useSnackbarAlert;
