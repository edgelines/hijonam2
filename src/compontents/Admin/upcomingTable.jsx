import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
    Grid, Button, Snackbar, Alert, Dialog, DialogContent, DialogContentText, TextField, DialogActions, MenuItem, Input,
    Table, TableHead, TableBody, TableCell, TableContainer, TableRow
} from '@mui/material';
import { VisuallyHiddenInput } from '../util.jsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ExhibitionPage({ loadDataUrl, name }) {
    const fileInputRef = useRef(null);
    const [previewImages, setPreviewImages] = useState([]);
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [data, setData] = useState([]);
    const vertical = 'bottom';
    const horizontal = 'center';
    // const url = 'http://hijonam.com/api/'
    const url = 'http://hijonam.com/img/'

    // Form State & Handler
    const [dialog, setDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ startDate: "", endDate: "", title: "", title_kr: "", location: "", soloGroup: "", fileName: [], memo: '' })
    const [errors, setErrors] = useState({ startDate: '', endDate: '' });
    // Form
    const newForm = () => { setEditMode(false); setDialog(true); resetForm(); }
    const resetForm = () => {
        setForm({ startDate: "", endDate: "", title: "", title_kr: "", location: "", soloGroup: "", fileName: [], memo: '' });
        setPreviewImages([]);
        setErrors({ startDate: '', endDate: '' });
    };
    const editBtn = (content) => {
        setEditMode(true);
        setForm({ id: content.id, startDate: content.startDate, endDate: content.endDate, title: content.title, title_kr: content.title_kr, location: content.location, soloGroup: content.soloGroup, memo: content.memo });
        setDialog(true);
    };
    const saveBtn = () => {
        if (editMode) {
            updateDatabase();
        } else { console.log(form); saveToDatabase(); }
        setDialog(false);
        resetForm();
    };

    // DB CRUD Function
    const saveToDatabase = async () => {
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            if (key !== "fileName") {
                formData.append(key, form[key]);
            }
        });
        // 파일 배열 처리
        if (form.fileName) {
            for (const file of form.fileName) {
                formData.append("images", file);
            }
            const fileName = Array.from(form.fileName).map(file => file.name);
            formData.append("fileName", JSON.stringify(fileName));
        } else { formData.append("fileName", JSON.stringify('Upcoming Exhibition.png')); }

        try {
            const response = await axios.post(`${url}${loadDataUrl}/Exhibition`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', },
            });
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
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            if (key !== "fileName") {
                formData.append(key, form[key]);
            }
        });
        // 파일 배열 처리
        if (form.fileName) {
            for (const file of form.fileName) {
                formData.append("images", file);
            }
            const fileName = Array.from(form.fileName).map(file => file.name);
            formData.append("fileName", JSON.stringify(fileName));
        } else { formData.append("fileName", JSON.stringify('Upcoming Exhibition.png')); }

        // formData 확인 코드
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            const response = await axios.put(`${url}${loadDataUrl}/Exhibition/${form.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', },
            });
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
                setSnackbar(true);
                setSeverity('success');
                setDialog(false);
            } catch (error) {
                setSnackbar(true);
                setSeverity('error');
                console.error("Error deleting award:", error);
            }
        }
        fetchData();
    };

    const handleDialogClose = () => { resetForm(); setDialog(false); }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setSnackbar(false);
    };
    const handleFormText = useCallback((event) => {
        const { name, value } = event.target;
        setForm(prevState => ({ ...prevState, [name]: value }));
    }, []);
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            setErrors((prev) => ({ ...prev, [name]: 'YYYY-MM-DD 형식이어야 합니다.' }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        setForm((prev) => ({ ...prev, [name]: String(value) }));
    };
    const handleFilesChange = (event) => {
        const files = event.target.files;
        const sanitizedFileObjects = Array.from(files).map(file => {
            const sanitizedFileName = file.name.replace(/[가-힣\s]/g, '');
            return new File([file], sanitizedFileName, { type: file.type });
        });
        setForm({ ...form, fileName: sanitizedFileObjects })
        const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
        setPreviewImages(imageUrls);
        // file의 오브젝트를 form.fileName에 전부 담음 ( 파일 속성 전체를 의미함. )
        // ex lastModified : 1693645952866, lastModifiedDate : Sat Sep 02 2023 18:12:32 GMT+0900 (한국 표준시) {}, name: "KakaoTalk_20230902_181134860.jpg", 
        // size: 2757612, type: "image/jpeg",webkitRelativePath: "",[[Prototype]]: File
    };
    const handleFileDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFilesChange({ target: { files } }); // 기존의 handleFilesChange 함수를 재활용
    };
    const fetchData = async () => {
        await axios.get(`${url}${loadDataUrl}`).then((response) => {
            const dateFields = ['startDate', 'endDate'];
            const data = response.data.map(item => {
                dateFields.forEach(field => {
                    const date = new Date(item[field]);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    item[field] = `${year}-${month}-${day}`;
                });
                return item;
            });
            setData(data);
        }).catch((error) => {
            setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }
    useEffect(() => { fetchData(); }, [name])

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
            <Dialog open={dialog} maxWidth={'md'} onClose={handleDialogClose}>
                <DialogContent>
                    <DialogContentText>
                        {editMode ? `< ${name} Exhibition > 내용을 변경합니다.` : `< ${name} Exhibition > 내용을 추가합니다.`}
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                variant="standard"
                                label="Start Date"
                                name="startDate"
                                fullWidth
                                value={form.startDate}
                                onChange={handleDateChange}
                                error={Boolean(errors.startDate)}
                                helperText={errors.startDate}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                variant="standard"
                                label="Last Date"
                                name="endDate"
                                fullWidth
                                value={form.endDate}
                                onChange={handleDateChange}
                                error={Boolean(errors.endDate)}
                                helperText={errors.endDate}
                            />
                        </Grid>
                        <Grid item xs={4}><TextField
                            variant="standard"
                            label="Location"
                            name="location"
                            fullWidth
                            multiline
                            onChange={handleFormText}
                            value={form.location}
                        /></Grid>
                        <Grid item xs={2}>
                            <TextField
                                variant="standard"
                                label="Solo / Group"
                                name="soloGroup"
                                fullWidth
                                select
                                onChange={handleFormText}
                                value={form.soloGroup}
                            >{[0, 1].map((item) => (
                                <MenuItem value={item} key={item}>{item === 0 ? 'Solo' : 'Group'}</MenuItem>
                            ))}
                            </TextField></Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="standard"
                                label="Title (Eng)"
                                name="title"
                                fullWidth
                                multiline
                                onChange={handleFormText}
                                value={form.title}
                            /></Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="standard"
                                label="Title (Kor)"
                                name="title_kr"
                                fullWidth
                                multiline
                                onChange={handleFormText}
                                value={form.title_kr}
                            /></Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                label="Memo"
                                name="memo"
                                fullWidth
                                multiline
                                onChange={handleFormText}
                                value={form.memo}
                            /></Grid>
                    </Grid>
                    {/* DragDrop Upload */}
                    <Grid container sx={{ mt: '15px' }}>
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                            style={{ width: '100%', height: '80px', border: '2px dashed gray' }}
                        >
                        </div>
                        <Grid container>
                            <Grid item xs={8}>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFilesChange}
                                    style={{ display: 'none' }}
                                />
                            </Grid>
                            <Grid item xs={4} container direction='column' justifyContent='end'>
                                <Button
                                    size='small'
                                    variant="contained"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    파일 선택
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <div>
                    {previewImages.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            style={{ width: '300px', aspectRatio: '1 / 1', objectFit: 'cover', margin: '5px' }}
                        />
                    ))}
                </div>

                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={saveBtn}>Save</Button>
                </DialogActions>
            </Dialog>

            <Grid container>
                <Grid item xs={6} textAlign='start' sx={{ ml: 5 }}>
                    <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={newForm}>Add Exhibition</Button>
                </Grid>
                <Grid item xs={11}>
                    <TableContainer sx={{ height: '80vh', width: '100%', mt: '2vh', ml: '1.8vw' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>Last Date</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>'Solo / Group' Status</TableCell>
                                    <TableCell>Memo</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <img src={`/img/Exhibition/${row.fileName[0]}`} className="rounded-3 mx-auto"
                                                style={{
                                                    width: '150px',
                                                    aspectRatio: '1 / 1',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{row.title}</TableCell>
                                        <TableCell>{row.startDate}</TableCell>
                                        <TableCell>{row.endDate}</TableCell>
                                        <TableCell>{row.location}</TableCell>
                                        <TableCell>{row.soloGroup === 0 ? 'Solo' : 'Group'}</TableCell>
                                        <TableCell>{row.memo}</TableCell>
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