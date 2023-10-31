import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Button, Snackbar, Alert, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, MenuItem } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { API } from '../util.jsx';

export default function ContackBookPage({ loadDataUrl, name }) {
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [data, setData] = useState([]);
    const vertical = 'bottom';
    const horizontal = 'center';
    const [field, setField] = useState([]);

    // Form State & Handler
    const [dialog, setDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        name: "",
        job: "",
        position: "",
        field: "",
        phoneNumber: "",
        email: "",
        memo: ""
    })
    // Form
    const newForm = () => {
        setEditMode(false);
        setDialog(true);
        resetForm();
    }
    const resetForm = () => {
        setForm({
            name: "",
            job: "",
            position: "",
            field: "",
            phoneNumber: "",
            email: "",
            memo: ""
        });
    };
    const editBtn = (content) => {
        setEditMode(true);
        setForm({
            id: content.id,
            name: content.name,
            job: content.job,
            position: content.position,
            field: content.field,
            phoneNumber: content.phoneNumber,
            email: content.email,
            memo: content.memo
        });
        setDialog(true);
    };
    const saveBtn = (newFormData) => {
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
            const response = await axios.post(`${API}/${loadDataUrl}`, newFormData);
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
            const response = await axios.put(`${API}/${loadDataUrl}/${newFormData.id}`, newFormData);
            setSnackbar(true);
            setSeverity('success');
            setDialog(false);
            fetchData();
        } catch (error) {
            setSnackbar(true);
            setSeverity('error');
            console.error(error);
        }

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

    const fetchData = async () => {
        await axios.get(`${API}/${loadDataUrl}`).then((response) => {
            const res = response.data.sort((a, b) => a.id - b.id)
            setData(res);

            let tmp = ['딜러', '언론', '운송업체', '사진기사', '평론가', '종교인', '교육인', '기업인'];
            res.forEach((value) => { tmp.push(value.field); });
            var set = new Set(tmp);
            var newArr = [...set];
            setField(newArr);

        }).catch((error) => {
            setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }
    useEffect(() => {
        fetchData();
    }, [name])

    const tableCols = [
        { field: 'name', headerName: '이름', width: 100 },
        { field: 'job', headerName: '직업', },
        { field: 'position', headerName: '직급', },
        { field: 'field', headerName: '필드', },
        { field: 'phoneNumber', headerName: '전화번호', width: 200 },
        { field: 'email', headerName: '이메일주소', width: 300 },
        { field: 'memo', headerName: 'Note', width: 400 },
        {
            field: 'actions',
            headerName: '',
            width: 180,
            renderCell: (params) => (
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Button
                            size="small"
                            variant="contained"
                            color="warning"
                            onClick={() => editBtn(params.row)}
                        >
                            Edit
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => deleteDatabase(params.row)}
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            ),
        }
    ]

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
                editMode={editMode} field={field} saveBtn={saveBtn}
            />

            <Grid container>
                <Grid item xs={6} textAlign='start' sx={{ ml: 5 }}>
                    <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={newForm}>Add Contact</Button>
                </Grid>
                <Grid item xs={11}>
                    <DataGrid rows={data}
                        hideFooter
                        // rowHeight={25}
                        height={800}
                        columns={tableCols}
                        slots={{ toolbar: GridToolbar }}
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                                csvOptions: { disableToolbarButton: true },
                                printOptions: { disableToolbarButton: true },
                            },
                        }}
                        sx={{ border: 0, }}
                    />



                </Grid>
            </Grid>

        </Grid>
    )
}


const DialogComponent = React.memo(({ dialog, form, field, handleDialogClose, editMode, saveBtn }) => {
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
                    {editMode ? `${form.name}의 정보를 변경합니다.` : `새로운 연락처를 추가합니다.`}
                </DialogContentText>
                <Grid container spacing={2} rowSpacing={1}>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            label="이름"
                            name="name"
                            onChange={handleFormText}
                            value={localFormState.name}
                        /></Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            label="직업"
                            name="job"
                            onChange={handleFormText}
                            value={localFormState.job}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            label="직급"
                            name="position"
                            onChange={handleFormText}
                            value={localFormState.position}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            label="필드"
                            name="field"
                            fullWidth
                            onChange={handleFormText}
                            value={localFormState.field}
                            helperText="딜러, 언론, 운송업체, 등등 "
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            label="필드"
                            name="field"
                            fullWidth select
                            onChange={handleFormText}
                            value={localFormState.field}
                        >
                            {field.map((item) => (
                                <MenuItem value={item} key={item}>{item}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            label="전화번호"
                            name="phoneNumber"
                            fullWidth
                            multiline
                            onChange={handleFormText}
                            value={localFormState.phoneNumber}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="standard"
                            label="E-mail"
                            name="email"
                            fullWidth
                            onChange={handleFormText}
                            value={localFormState.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="standard"
                            label="Note"
                            name="memo"
                            fullWidth multiline
                            onChange={handleFormText}
                            value={localFormState.memo}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    )
})






{/* <TableContainer sx={{ height: '80vh', width: '100%', mt: '2vh', ml: '1.8vw' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>이름</TableCell>
                                    <TableCell>직업</TableCell>
                                    <TableCell>직급</TableCell>
                                    <TableCell>필드</TableCell>
                                    <TableCell>전화번호</TableCell>
                                    <TableCell>이메일주소</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.job}</TableCell>
                                        <TableCell>{row.position}</TableCell>
                                        <TableCell>{row.field}</TableCell>
                                        <TableCell>{row.phoneNumber}</TableCell>
                                        <TableCell>{row.email}</TableCell>
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
                    </TableContainer> */}