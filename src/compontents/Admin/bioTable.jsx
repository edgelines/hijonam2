import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Grid, Button, Snackbar, Alert, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

export default function BioTablePage({ loadDataUrl, name }) {
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [data, setData] = useState([]);
    const vertical = 'bottom';
    const horizontal = 'center';
    const url = 'http://hijonam.com/api/'
    // const url = 'http://hijonam.com/img/'

    // Form State & Handler
    const [dialog, setDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        year: "",
        title: "",
        location: "",
        title_kr: "",
    })
    // Form
    const newForm = () => {
        setEditMode(false);
        setDialog(true);
        resetForm();
    }
    const resetForm = () => {
        setForm({
            year: "",
            title: "",
            location: "",
            title_kr: "",
        });
    };
    const editBtn = (content) => {
        setEditMode(true);
        setForm({
            id: content.id,
            year: content.year,
            title: content.title,
            location: content.location,
            title_kr: content.title_kr,
        });
        setDialog(true);
    };
    const saveBtn = (newFormData) => {
        // setForm(newFormData);
        // console.log('newFormData', newFormData);
        // console.log('savBtn', form);
        if (editMode) {
            updateDatabase(newFormData);
        } else {
            saveToDatabase(newFormData);
        }
        setDialog(false);
        resetForm();
    };


    // DB CRUD Function
    const saveToDatabase = async (newFormData) => {
        try {
            const response = await axios.post(`${url}${loadDataUrl}`, newFormData);
            data.unshift(response.data);
            setSnackbar(true);
            setSeverity('success');
            setDialog(false);
        } catch (error) {
            setSnackbar(true);
            setSeverity('error');
            console.error(error);
        }
    };

    const updateDatabase = async (newFormData) => {
        try {
            // Send the FormData to the server using axios
            // console.log('newFormData : ', newFormData);
            const response = await axios.put(`${url}${loadDataUrl}/${newFormData.id}`, newFormData);
            setSnackbar(true);
            setSeverity('success');
            setDialog(false);
        } catch (error) {
            setSnackbar(true);
            setSeverity('error');
            console.error(error);
        }
        fetchData();
    };

    const deleteDatabase = async (deleteID) => {
        const confirmDelete = window.confirm("이 항목을 삭제 할까요?");
        if (confirmDelete) {
            try {
                await axios.delete(`${url}${loadDataUrl}/${deleteID.id}`);
                fetchData();
                setSnackbar(true);
                setSeverity('success');
                setDialog(false);
            } catch (error) {
                setSnackbar(true);
                setSeverity('error');
                console.error("Error deleting award:", error);
            }
        }
    };

    // Handler
    const handleDialogClose = () => { resetForm(); setDialog(false); }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(false);
    };
    // const handleFormText = (event) => {
    //     const { name, value } = event.target;
    //     setForm(prevState => ({ ...prevState, [name]: value }));
    // };

    const fetchData = async () => {
        await axios.get(`${url}${loadDataUrl}`).then((response) => {
            setData(response.data);
        }).catch((error) => {
            setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }
    useEffect(() => {
        fetchData();
    }, [name])

    return (
        <Grid container>
            {/* FeedBack SnackBar */}
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={snackbar}
                onClose={handleClose}
                autoHideDuration={5000}
            >
                <Alert severity={severity} elevation={6} onClose={handleClose}>
                    {severity === 'success' ? '변경 사항을 저장했어요.' : severity === 'error' ? '에러가 발생했어요. 잠시후 다시 시도해주세요.' : 'Kindly ensure all fields are filled out.'}
                </Alert>
            </Snackbar>

            {/* Form */}
            <DialogComponent dialog={dialog} form={form} handleDialogClose={handleDialogClose}
                editMode={editMode} name={name} saveBtn={saveBtn}
            />

            <Grid container>
                <Grid item xs={6} textAlign='start' sx={{ ml: 5 }}>
                    <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={newForm}>Add Image</Button>
                </Grid>
                <Grid item xs={11}>
                    <TableContainer sx={{ height: '80vh', width: '100%', mt: '2vh', ml: '1.8vw' }}>
                        <Table size="small">
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.year}</TableCell>
                                        <TableCell>{row.title}</TableCell>
                                        <TableCell>
                                            <Button size="small" variant="contained" color="warning" onClick={() => editBtn(row)}>Edit</Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button size="small" variant="contained" color="error" onClick={() => deleteDatabase(row)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

        </Grid>
    )
}


const DialogComponent = React.memo(({ dialog, form, handleDialogClose, editMode, name, saveBtn }) => {
    const [localFormState, setLocalFormState] = useState(form);

    useEffect(() => {
        setLocalFormState(form);
    }, [form]);

    const handleFormText = (event) => {
        const { name, value } = event.target;
        setLocalFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSave = () => {
        saveBtn(localFormState);
    };

    return (
        <Dialog open={dialog} onClose={handleDialogClose}>
            <DialogContent>
                <DialogContentText>
                    {editMode ? `${name}에 아래의 내용을 변경합니다.` : `${name}에 아래의 내용을 추가합니다.`}
                </DialogContentText>
                <TextField
                    variant="standard"
                    label="Year"
                    name="year"
                    fullWidth
                    onChange={handleFormText}
                    value={localFormState.year}
                    sx={{ mt: 3 }}
                />

                <TextField
                    variant="standard"
                    label="Title (Eng)"
                    name="title"
                    fullWidth
                    multiline
                    onChange={handleFormText}
                    value={localFormState.title}
                    sx={{ mt: 3 }}
                />

                <TextField
                    variant="standard"
                    label="Title (Kor)"
                    name="title_kr"
                    fullWidth
                    multiline
                    onChange={handleFormText}
                    value={localFormState.title_kr}
                    sx={{ mt: 3 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    )
})