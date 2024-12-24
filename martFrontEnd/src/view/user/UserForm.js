import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import { useState } from 'react';

// third-party
import { Form, FormikProvider, useFormik } from 'formik';
import _ from 'lodash';
import * as Yup from 'yup';

// project imports
import { gridSpacing } from 'constant/constant';
//icons
import { Visibility, VisibilityOff } from '@mui/icons-material';

// constant
const getInitialValues = (event, range, userDetail) => {
    const newEvent = {
        name: !event ? userDetail?.name : '',
        email: !event ? userDetail?.email : ''
    };

    if (event || range) {
        return _.merge({}, newEvent, event);
    }

    return newEvent;
};

// ==============================|| COUNTRY EVENT ADD / EDIT / DELETE ||============================== //

const UserForm = ({ event, range, handleCreate, handleUpdate, onCancel, userDetail, itemList }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const EventSchema = Yup.object().shape({
        name: Yup.string().max(50, 'Name must be less than or equal to 255 characters').required('Name is required'),

        email: Yup.string()
            .email('Invalid email address')
            .max(255, 'Email must be less than or equal to 255 characters')
            .required('Email is required'),

        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters') // You can add a min length if required
    });

    const formik = useFormik({
        initialValues: getInitialValues(event, range, userDetail),
        validationSchema: EventSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const data = values;
                if (event) {
                    handleCreate(data);
                } else {
                    handleUpdate(userDetail._id, data);
                }
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

    return (
        <FormikProvider value={formik}>
            <LocalizationProvider>
                <Form autoComplete="off" onSubmit={handleSubmit}>
                    <DialogTitle>{event ? 'Add User' : 'Edit User'}</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={6} md={6}>
                                <Typography marginBottom="5px">Name</Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    {...getFieldProps('name')}
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Typography marginBottom="5px">Email</Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    {...getFieldProps('email')}
                                    error={Boolean(touched.email && errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Typography marginBottom="5px">Password</Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    {...getFieldProps('password')}
                                    error={Boolean(touched.password && errors.password)}
                                    helperText={touched.password && errors.password}
                                    type={showPassword ? 'text' : 'password'} // Toggle between text and password type
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={handleClickShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Grid item>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button type="button" variant="outlined" onClick={onCancel}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                                        {!event ? 'Update' : 'Save'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Form>
            </LocalizationProvider>
        </FormikProvider>
    );
};

UserForm.propTypes = {
    event: PropTypes.bool,
    range: PropTypes.object,
    handleDelete: PropTypes.func,
    handleCreate: PropTypes.func,
    handleUpdate: PropTypes.func,
    onCancel: PropTypes.func
};

export default UserForm;
