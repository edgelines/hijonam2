import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Grid, Button, Snackbar, Alert, Typography, Dialog, DialogContent, DialogContentText, Input, DialogActions, TextField, MenuItem } from '@mui/material';
import { getFileType } from '../util.jsx';
import { IMG } from '../util.jsx';


export default function HomeImageChagePage({ loadDataUrl }) {
    const fileInputRef = useRef(null);
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [data, setData] = useState([]);
    // const [data2, setData2] = useState([]);

    const vertical = 'bottom';
    const horizontal = 'center';

    // Form State & Handler
    const [previewImages, setPreviewImages] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        lang: "",
        fileName: "",
    })
    // Form
    const newForm = () => {
        setEditMode(false);
        setDialog(true);
        resetForm();
    }
    const resetForm = () => {
        setForm({
            lang: "",
            fileName: "",
        });
        setPreviewImages([])
    };
    const editBtn = (content) => {
        setEditMode(true);
        setForm({
            ...form,
            id: content.id,
            lang: content.lang,
            fileName: "",
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
            const sanitizedFileName = file.name.replace(/[가-힣]/g, '').normalize('NFC');
            // 파일 이름이 너무 짧거나 없는 경우 타임스탬프 추가
            if (sanitizedFileName.length <= 4) { // 예: ".jpg" 보다 짧거나 같은 경우
                const timestamp = new Date().getTime();
                const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z 사이의 랜덤한 알파벳
                sanitizedFileName = `${timestamp}_${randomLetter}${sanitizedFileName}`;
            }
            return new File([file], sanitizedFileName, { type: file.type });
        });

        // console.log('files', sanitizedFileObjects);
        // 이전 파일 목록에 새 파일 목록을 추가
        const updatedFiles = [...form.fileName, ...sanitizedFileObjects];
        setForm({ ...form, fileName: updatedFiles });
        // setForm({ ...form, fileName: files })
        const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
        setPreviewImages(prevPreviewImages => [...prevPreviewImages, ...imageUrls]);
        // file의 오브젝트를 form.fileName에 전부 담음 ( 파일 속성 전체를 의미함. )
        // ex lastModified : 1693645952866, lastModifiedDate : Sat Sep 02 2023 18:12:32 GMT+0900 (한국 표준시) {}, name: "KakaoTalk_20230902_181134860.jpg", 
        // size: 2757612, type: "image/jpeg",webkitRelativePath: "",[[Prototype]]: File
    };
    const handleFileDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFilesChange({ target: { files } }); // 기존의 handleFilesChange 함수를 재활용
    };
    const handleFormText = (event) => {
        const { name, value } = event.target;
        setForm(prevState => ({ ...prevState, [name]: value }));
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
        }

        try {
            await axios.post(`${IMG}/${loadDataUrl}/Catalogue`, formData, { headers: { 'Content-Type': 'multipart/form-data', }, });
            setSeverity('success');
            setSnackbar(true);
        } catch (error) {
            setSeverity('error');
            setSnackbar(true);
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
        }

        try {
            await axios.put(`${IMG}/${loadDataUrl}/Catalogue/${form.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data', }, });
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
                await axios.delete(`${IMG}/${loadDataUrl}/${deleteID.id}`);
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
        await axios.get(`${IMG}/${loadDataUrl}`).then((response) => {
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
                        {editMode ? '수정을 할 경우 PDF파일과 이미지파일을 추가해줘야해요' : '카탈로그에 이미지와 PDF를 등록합니다.'}
                    </DialogContentText>
                    <TextField
                        variant="standard"
                        label="언어"
                        name="lang"
                        fullWidth
                        select
                        onChange={handleFormText}
                        value={form.lang}
                    >
                        {['Kr', 'En'].map((item) => (
                            <MenuItem value={item} key={item}>{item}</MenuItem>
                        ))}
                    </TextField>
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
                    <Typography align='start' sx={{ mt: 2, fontSize: '15px', fontWeight: 600, color: 'red' }}>수정을 할 경우 PDF파일과 이미지파일을 추가해줘야해요</Typography>
                    <Grid container sx={{ mt: 2 }}>
                        {
                            data.length > 0 ?
                                data.map((item, index) => {
                                    const pdfFile = item.fileName.find(name => getFileType(name) === 'pdf');
                                    const imageFile = item.fileName.find(name => getFileType(name) === 'image');
                                    const fileUrl = pdfFile ? `/img/Catalogue/${pdfFile}` : `/img/Catalogue/${imageFile}`;
                                    const handleContainerClick = () => {
                                        if (pdfFile) {
                                            const link = document.createElement('a');
                                            link.href = fileUrl;
                                            link.download = pdfFile;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }
                                    };
                                    return (
                                        <Grid item xs={2} key={item.id} onClick={handleContainerClick}>
                                            {pdfFile ? (
                                                <Grid container sx={{ cursor: 'pointer' }}>
                                                    <img src={`/img/Catalogue/${imageFile}`} className="rounded-3 mx-auto"
                                                        style={{
                                                            width: '100%',
                                                            aspectRatio: '1 / 1',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                    <Typography align='start' sx={{ mt: 1, fontSize: '13px' }}>
                                                        Ver : {item.lang}
                                                    </Typography>
                                                    <Typography align='start' sx={{ fontSize: '13px' }}>
                                                        {pdfFile}
                                                    </Typography>
                                                </Grid>
                                            ) : (
                                                <img src={`/img/Catalogue/${imageFile}`} className="rounded-3 mx-auto"
                                                    style={{
                                                        width: '100%',
                                                        aspectRatio: '1 / 1',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            )}
                                            <Grid container sx={{ mt: 2, borderTop: '1px solid black' }}>
                                                <Grid item xs={6} sx={{ mt: 1 }}>
                                                    <Button size="small" variant="contained" color="warning" onClick={(e) => { e.stopPropagation(); editBtn(item); }}>Edit</Button>
                                                </Grid>
                                                <Grid item xs={6} sx={{ mt: 1 }}>
                                                    <Button size="small" variant="contained" color="error" onClick={(e) => { e.stopPropagation(); deleteDatabase(item); }}>Delete</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )
                                })
                                :
                                (<>
                                    <Typography>등록된 카탈로그가 없어요</Typography>
                                </>)
                        }
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    )
}

