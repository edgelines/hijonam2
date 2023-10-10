import { Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TextField, Button, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { MarginPictures } from './util.jsx';


export default function ContactPage() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const Contact_title = 'For any inquiries regarding exhibition, price list, image licensing, brand collaborations or anything else, please complete the form below and my manager will be in touch shortly.'

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [emailError, setEmailError] = useState("");
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState(null);
    const vertical = 'bottom';
    const horizontal = 'center';
    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(prevState => ({ ...prevState, [name]: value }));

        // Email validation
        if (name === "email") {
            if (!value) {
                setEmailError("Required.");
            } else if (value.length > 20) {
                setEmailError("Max 20 characters");
            } else if (!isValidEmail(value)) {
                setEmailError("Invalid e-mail.");
            } else {
                setEmailError("");
            }
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(false);
    };

    const isValidEmail = (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value);
    };
    const submit = async () => {
        if (!form.name || !form.email || !form.subject || !form.message) {
            setSnackbar(true);
            setSeverity('warning');
            return;
        }

        try {
            const now = new Date();
            const koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
            form.date = koreanTime.toISOString().substring(0, 19);
            const res = await axios.post(`http://hijonam.com/api/contact`, form);
            setSnackbar(true);
            setSeverity('success');
            await axios.post(`http://checkmate.iptime.org:7900/hijonamContact`, form);
            resetForm();
        } catch (err) {
            setSnackbar(true);
            setSeverity('error');
        }
    };

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={snackbar}
                onClose={handleClose}
                // key={vertical + horizontal}
                autoHideDuration={5000}
            >
                <Alert severity={severity} elevation={6} onClose={handleClose}>
                    {severity === 'success' ? 'Your message has been successfully sent.' : severity === 'error' ? 'Sorry, there was an error. Please try again later.' : 'Kindly ensure all fields are filled out.'}
                </Alert>
            </Snackbar>
            {isMobile ? (
                <>
                    <MarginPictures title='CONTACT' />
                    <Grid container sx={{ overflowX: 'hidden', padding: 3 }}>
                        <Grid container >
                            <span style={{ fontSize: '12px', textAlign: 'start' }}>{Contact_title}</span>
                        </Grid>

                        <Grid container sx={{ marginTop: '2vh' }}>
                            <Grid container>
                                <TextField
                                    variant="standard"
                                    label="Name"
                                    name="name"
                                    fullWidth
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid container>
                                <TextField
                                    variant="standard"
                                    type="email"
                                    label="Email Address"
                                    name="email"
                                    fullWidth
                                    value={form.email}
                                    onChange={handleChange}
                                    helperText={emailError}
                                    error={!!emailError}
                                />
                            </Grid>

                            <Grid container>
                                <TextField
                                    variant="standard"
                                    label="Subject"
                                    name="subject"
                                    fullWidth
                                    value={form.subject}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid container>
                                <TextField
                                    variant="standard"
                                    label="Message"
                                    name="message"
                                    fullWidth
                                    value={form.message}
                                    onChange={handleChange}
                                    multiline
                                    rows={3} // Adjust based on your needs
                                />
                            </Grid>

                            <Grid container sx={{ marginTop: '1vh' }} direction='column' alignItems='end'>
                                <Button variant="outlined" style={{ color: 'black', borderColor: '#bbb', fontSize: '12px' }} onClick={submit}>Submit</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <>
                    <MarginPictures title='CONTACT' />
                    <div style={{ marginTop: '8svh', marginLeft: '9vw', marginBottom: '7svh' }}>
                        {/* <div id={styles.Contact}> */}
                        {/* <Grid container id={styles.title}> */}
                        <Grid container >
                            <Grid item xs={10} md={10} lg={8} xl={8} textAlign='start' >
                                <span style={{ fontSize: '17px' }}>{Contact_title}</span>
                            </Grid>
                        </Grid>

                        <Grid container>
                            {/* <Grid container id={styles.email}> */}
                            <Grid item md={10} style={{ marginTop: '8vh' }} >
                                <Grid container>
                                    <Grid item xs={6}>
                                        <TextField
                                            variant="standard"
                                            label="Name"
                                            name="name"
                                            fullWidth
                                            value={form.name}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container style={{ marginTop: '3vh' }}>
                                    <Grid item xs={6}>
                                        <TextField
                                            variant="standard"
                                            type="email"
                                            label="Email Address"
                                            name="email"
                                            fullWidth
                                            value={form.email}
                                            onChange={handleChange}
                                            helperText={emailError}
                                            error={!!emailError}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container style={{ marginTop: '3vh' }}>
                                    <TextField
                                        variant="standard"
                                        label="Subject"
                                        name="subject"
                                        fullWidth
                                        value={form.subject}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid container style={{ marginTop: '3vh' }}>
                                    <TextField
                                        variant="standard"
                                        label="Message"
                                        name="message"
                                        fullWidth
                                        value={form.message}
                                        onChange={handleChange}
                                        multiline
                                        rows={4} // Adjust based on your needs
                                    />
                                </Grid>

                                <div className="text-end" style={{ marginTop: '1vh' }}>
                                    <Button variant="outlined" style={{ color: 'black', borderColor: '#bbb' }} onClick={submit}>Submit</Button>
                                </div>

                            </Grid>
                        </Grid>
                    </div>
                </>
            )}
        </>
    );
}
