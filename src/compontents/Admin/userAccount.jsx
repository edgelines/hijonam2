import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Button, Snackbar, Alert, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Table, TableHead, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { API } from '../util.jsx';

export default function HomeImageChagePage({ loadDataUrl, name }) {
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [data, setData] = useState([]);
    const vertical = 'bottom';
    const horizontal = 'center';

    // Form State & Handler
    const [dialog, setDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        username: "",
        password: ""
    })
    // Form
    const newForm = () => {
        setEditMode(false);
        setDialog(true);
        resetForm();
    }
    const resetForm = () => {
        setForm({
            username: "",
            password: ""
        });
    };
    const editBtn = (content) => {
        setEditMode(true);
        setForm({
            id: content.id,
            username: content.username,
            password: '',
        });
        setDialog(true);
    };
    const saveBtn = () => {
        if (editMode) {
            updateDatabase();
        } else {
            saveToDatabase();
        }
        setDialog(false);
        resetForm();
    };


    // DB CRUD Function
    const saveToDatabase = async () => {
        try {
            const response = await axios.post(`${API}/admin/register`, form);
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

    const updateDatabase = async () => {
        try {
            // Send the FormData to the server using axios
            const response = await axios.put(`${API}/admin/update/${form.id}`, form);
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
                await axios.delete(`${API}/${loadDataUrl}/${deleteID.id}`);
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
    const handleFormText = (event) => {
        const { name, value } = event.target;
        setForm(prevState => ({ ...prevState, [name]: value }));
    };

    const fetchData = async () => {
        await axios.get(`${API}/${loadDataUrl}`).then((response) => {
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
            <Dialog open={dialog} onClose={handleDialogClose}>
                <DialogContent>
                    <DialogContentText>
                        {editMode ? `${form.username}의 정보를 변경합니다.` : `${name} 등록합니다.`}
                    </DialogContentText>
                    <TextField
                        variant="standard"
                        label="ID"
                        name="username"
                        fullWidth
                        onChange={handleFormText}
                        value={form.username}
                        sx={{ mt: 3 }}
                    />

                    <TextField
                        variant="standard"
                        label="PASSWORD"
                        name="password"
                        type="password"
                        fullWidth
                        onChange={handleFormText}
                        value={form.password}
                        sx={{ mt: 3 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={saveBtn}>Save</Button>
                </DialogActions>
            </Dialog>

            <Grid container>
                <Grid item xs={6} textAlign='start' sx={{ ml: 5 }}>
                    <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={newForm}>Add User</Button>
                </Grid>
                <Grid item xs={11}>
                    <TableContainer sx={{ height: '80vh', width: '400px', mt: '2vh', ml: '1.8vw' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.username}</TableCell>
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