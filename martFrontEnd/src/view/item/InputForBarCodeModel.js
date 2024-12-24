import PropTypes from 'prop-types';

import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';

// third-party
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

// project imports
import { gridSpacing } from 'constant/constant';

// ==============================|| COUNTRY EVENT ADD / EDIT / DELETE ||============================== //

const InputForBarCodeModel = ({ handlePrint, onCancel, itemName }) => {
    const EventSchema = Yup.object().shape({
        quantity: Yup.number()
            .required('Quantity is required')
            .min(0, 'Quantity cannot be negative')
            .max(100, 'Quantity cannot be greater than 100')
    });

    function generateRandomString() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    const makeBarCodeValues = (quantity) => {
        const barCodeValues = [];
        for (let i = 1; i <= quantity; i++) {
            const randomCharacters = generateRandomString();
            barCodeValues.push(`${itemName}-(${randomCharacters + i})`);
        }
        return barCodeValues;
    };

    const formik = useFormik({
        initialValues: {
            quantity: 0
        },
        validationSchema: EventSchema,
        onSubmit: async (values) => {
            try {
                const data = values;
                const dataToSend = makeBarCodeValues(values.quantity);
                handlePrint(dataToSend);
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
                    <DialogTitle>How many bar code you want print</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={3} md={6}>
                                <Typography marginBottom="5px">Quantity</Typography>
                                <TextField
                                    size="small"
                                    {...getFieldProps('quantity')}
                                    error={Boolean(touched.quantity && errors.quantity)}
                                    helperText={touched.quantity && errors.quantity}
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
                                        Print
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

InputForBarCodeModel.propTypes = {
    handlePrint: PropTypes.func,
    onCancel: PropTypes.func
};

export default InputForBarCodeModel;
