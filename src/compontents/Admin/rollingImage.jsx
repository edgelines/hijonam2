import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Grid, Button, Snackbar, Alert, Typography, Dialog, DialogContent, DialogContentText, Input, DialogActions } from '@mui/material';
// import { VisuallyHiddenInput } from '../util.jsx';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function RollingImageChagePage({ loadDataUrl }) {
    const fileInputRef = useRef(null);
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [data, setData] = useState([]);
    const vertical = 'bottom';
    const horizontal = 'center';
    const url = 'http://hijonam.com/img/'

    // Form State & Handler
    const [previewImages, setPreviewImages] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        fileName: "",
        sequence: "",
    })
    // Form
    const newForm = () => {
        setEditMode(false);
        setDialog(true);
        resetForm();
    }
    const resetForm = () => {
        setForm({
            fileName: "",
            sequence: "",
        });
        setPreviewImages([])
    };
    const editBtn = (content) => {
        setEditMode(true);
        setForm({
            ...form,
            id: content.id,
            fileName: "",
            sequence: content.sequence,
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

    const handleFilesChange = (event) => {
        const files = event.target.files;
        const sanitizedFileObjects = Array.from(files).map(file => {
            const sanitizedFileName = file.name.replace(/[가-힣\s]/g, '').normalize('NFC');
            if (sanitizedFileName.length <= 4) { // 예: ".jpg" 보다 짧거나 같은 경우
                const timestamp = new Date().getTime();
                const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z 사이의 랜덤한 알파벳
                sanitizedFileName = `${timestamp}_${randomLetter}${sanitizedFileName}`;
            }
            return new File([file], sanitizedFileName, { type: file.type });
        });

        // console.log('files', sanitizedFileObjects);
        // console.log('files', files);
        setForm({ ...form, fileName: sanitizedFileObjects });
        // setForm({ ...form, fileName: files })
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
    const handleDialogClose = () => {
        resetForm();
        setDialog(false);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(false);
    };
    // DB CRUD Function
    const saveToDatabase = async () => {
        var sequence = data.length > 0 ? data[data.length - 1].sequence : 0;

        const formData = new FormData();

        formData.append("sequence", sequence + 1);

        // form에 담긴 파일 정보를 풀어서 fileName을 별도로 저장함
        for (const file of form.fileName) {
            formData.append("images", file);
        }
        const fileName = Array.from(form.fileName).map(file => file.name);
        formData.append("fileName", JSON.stringify(fileName));

        try {
            await axios.post(`${url}${loadDataUrl}/Rolling`, formData, { headers: { 'Content-Type': 'multipart/form-data', }, });
            setSeverity('success');
            setSnackbar(true);
            // setDialog(false);
        } catch (error) {
            setSeverity('error');
            setSnackbar(true);
            console.error(error);
        }
        fetchData();
    };

    const updateDatabase = async () => {
        const formData = new FormData();
        // Add the form fields to the FormData
        formData.append("sequence", form.sequence);

        // form에 담긴 파일 정보를 풀어서 fileName을 별도로 저장함
        for (const file of form.fileName) {
            formData.append("images", file);
        }
        const fileName = Array.from(form.fileName).map(file => file.name);
        formData.append("fileName", JSON.stringify(fileName));

        try {
            await axios.put(`${url}${loadDataUrl}/Rolling/${form.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSeverity('success');
            setSnackbar(true);
        } catch (error) {
            setSeverity('error');
            setSnackbar(true);
            console.error(error);
        }
        fetchData();
    };

    const deleteDatabase = async (deleteID) => {
        const confirmDelete = window.confirm("이 항목을 삭제 할까요?");
        if (confirmDelete) {
            try {
                await axios.delete(`${url}${loadDataUrl}/Rolling/${deleteID.id}`);
                setSeverity('success');
                setSnackbar(true);
            } catch (error) {
                setSeverity('error');
                setSnackbar(true);
                console.error("Error deleting award:", error);
            }
        }
        fetchData();
    };

    const fetchData = async () => {
        await axios.get(`${url}${loadDataUrl}`).then((response) => {
            setData(response.data);
        }).catch((error) => {
            setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }
    useEffect(() => { fetchData(); }, [])
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
            <Dialog open={dialog}
                fullWidth={false} maxWidth={'md'}
                onClose={handleDialogClose}>
                <DialogContent>
                    <DialogContentText>
                        {editMode ? '변경할 이미지를 선택해주세요' : '홈에 추가할 이미지를 선택해주세요'}
                    </DialogContentText>
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
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={saveBtn}>Save</Button>
                </DialogActions>
            </Dialog>

            <Grid container>
                <Grid item xs={6} textAlign='start' sx={{ ml: 5 }}>
                    <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={newForm}>Add Image</Button>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        {data.map((item) => (
                            <Grid item xs={2} sx={{ padding: 5 }} key={item.id}>
                                <img src={`/img/Rolling/${item.fileName}`} className="rounded-3 mx-auto"
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        objectFit: 'cover'
                                    }}
                                />
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Button sx={{ mt: 2 }} size="small" variant="contained" color="warning" onClick={() => editBtn(item)}>Edit</Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button sx={{ mt: 2 }} size="small" variant="contained" color="error" onClick={() => deleteDatabase(item)}>Delete</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    )
}

