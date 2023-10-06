import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Button, Snackbar, Alert, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Typography, FormControl, MenuItem } from '@mui/material';
import { VisuallyHiddenInput } from '../util.jsx';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function GenresPage({ loadDataUrl }) {
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState(null);
    const [data, setData] = useState([]); // Origin Data
    const [selectedData, setSelectedData] = useState([]);
    const [select, setSelect] = useState('All');

    const vertical = 'bottom';
    const horizontal = 'center';
    const url = 'http://hijonam.com/img/'

    // Form State & Handler

    const [dialog, setDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        subject: "",
        title: "",
        year: "",
        month: "",
        memo: "",
        memo_kr: "",
        fileName: "",
        folderName: "",
        sequence: "",
        uploadDate: "",
        img: ""
    })
    // Form
    const newForm = () => {
        setEditMode(false);
        setDialog(true);
        resetForm();
    }
    const resetForm = () => {
        setForm({
            subject: "",
            title: "",
            year: "",
            month: "",
            memo: "",
            memo_kr: "",
            fileName: "",
            folderName: "",
            sequence: "",
            uploadDate: "",
            img: ""
        });
    };
    const editBtn = (content) => {
        setEditMode(true);
        setForm({
            id: content.id,
            subject: content.subject,
            title: content.title,
            year: content.year,
            month: content.month,
            memo: content.memo,
            memo_kr: content.memo_kr,
            fileName: "",
            folderName: content.folderName,
            sequence: content.sequence,
            uploadDate: content.uploadDate,
            img: content.fileName
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
        const formData = new FormData();
        Object.keys(newFormData).forEach((key) => {
            if (key !== "fileName") {
                formData.append(key, newFormData[key]);
            }
        });
        // 파일 배열 처리
        if (newFormData.fileName) {
            for (const file of newFormData.fileName) {
                formData.append("images", file);
            }
            const fileName = Array.from(newFormData.fileName).map(file => file.name);
            formData.append("fileName", JSON.stringify(fileName));
        }

        try {
            // formData에는 file과, fileName, ...form 정보가 같이 담겨서 전송되고, 
            // 여기서 file은 images의 키로 저장했고, multer에서 images에 담긴것들을 서버 디랙토리에 저장함.
            const response = await axios.post(`${url}${loadDataUrl}/Photos/${newFormData.folderName}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            data.push(response.data);
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
        const formData = new FormData();
        Object.keys(newFormData).forEach((key) => {
            if (key !== "fileName") {
                formData.append(key, newFormData[key]);
            }
        });
        // 파일 배열 처리
        if (newFormData.fileName) {
            for (const file of newFormData.fileName) {
                formData.append("images", file);
            }
            const fileName = Array.from(newFormData.fileName).map(file => file.name);
            formData.append("fileName", JSON.stringify(fileName));
        }

        // // formData 확인 코드
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
        try {
            const response = await axios.put(`${url}${loadDataUrl}/Photos/${newFormData.folderName}/${newFormData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
                fetchData();
                setSnackbar(true);
                setSeverity('success');
            } catch (error) {
                setSnackbar(true);
                setSeverity('error');
                console.error("Error deleting award:", error);
            }
        }
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

    const fetchData = async () => {
        await axios.get(`${url}${loadDataUrl}`).then((response) => {
            setData(response.data);
            setSelectedData(response.data);
        }).catch((error) => {
            setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }
    useEffect(() => {
        fetchData();
    }, [])
    useEffect(() => {
        let result = [...data]
        if (select !== 'All') {
            result = result.filter((item) => item.subject === select)
        }
        setSelectedData(result)
    }, [select])

    // Handler
    const handleChangeSubject = (event) => { setSelect(event.target.value) }
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
                editMode={editMode} saveBtn={saveBtn}
            />

            <Grid container>
                <Grid item xs={6} textAlign='start' sx={{ ml: 5 }}>
                    <Grid container>
                        <Grid item xs={2}>
                            <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={newForm}>Add Photos</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl size="small" sx={{ width: 200 }}>
                                <TextField
                                    label="Subject"
                                    defaultValue='All'
                                    variant='standard'
                                    select
                                    onChange={handleChangeSubject}>
                                    {['All', 'Exhibition', 'Studio Korea', 'Studio US', 'Other Moments'].map((item) => (
                                        <MenuItem value={item} key={item}>{item}</MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>

                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={11} sx={{ ml: 5 }}>
                    <DataTable rows={selectedData} editBtn={editBtn} deleteDatabase={deleteDatabase} />
                </Grid>
            </Grid>

        </Grid>
    )
}
const DataTable = ({ rows, editBtn, deleteDatabase }) => {
    // DataGrid Columns
    const columns = [
        {
            field: 'imgName', headerName: 'Image', width: 80,
            renderCell: (params) =>
            (
                <img src={`/img/Photos/${params.row.folderName}/${params.row.fileName[0]}`}
                    className="rounded-3 mx-auto"
                    style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover'
                    }}
                />
            )
        },
        { field: 'subject', headerName: 'Subject', width: 130 },
        { field: 'title', headerName: 'Title', width: 130 },
        { field: 'year', headerName: 'Year', },
        {
            field: 'month', headerName: 'Month',
            renderCell: (params) => {
                return params.value === 0 ? '' : params.value;
            }
        },
        { field: 'memo', headerName: 'Note US', width: 400, },
        { field: 'memo_kr', headerName: 'Note KR', width: 400, },
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
        <Grid container sx={{ height: '87vh' }}>
            <DataGrid rows={rows}
                hideFooter
                rowHeight={80}
                // getRowHeight={() => 'auto'}
                height={700}
                columns={columns}
                sx={{
                    border: 0, [`& .${gridClasses.cell}`]: {
                        py: 1,
                    },
                }}
            />
        </Grid>
    )
}

const DialogComponent = React.memo(({ dialog, form, handleDialogClose, editMode, saveBtn }) => {
    const [localFormState, setLocalFormState] = useState(form);
    const [previewImages, setPreviewImages] = useState([]);
    useEffect(() => {
        if (!editMode) {
            const day = new Date();
            const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            setLocalFormState({ ...form, uploadDate: formattedDate })
        }
        // setLocalFormState(form);
    }, [form]);

    const handleFormText = (event) => {
        const { name, value } = event.target;
        setLocalFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleFilesChange = (event) => {
        const files = event.target.files;
        let foldername;
        if (localFormState.subject === 'Studio Korea') { foldername = 'StudioKorea' }
        else if (localFormState.subject === 'Studio US') { foldername = 'StudioUS' }
        else if (localFormState.subject === 'Other Moments') { foldername = 'OtherMoments' }
        else if (localFormState.subject === 'Exhibition') { foldername = 'Exhibition' }

        setLocalFormState({ ...localFormState, folderName: localFormState.subject, fileName: files })
        const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
        setPreviewImages(imageUrls);
        // file의 오브젝트를 form.fileName에 전부 담음 ( 파일 속성 전체를 의미함. )
        // ex lastModified : 1693645952866, lastModifiedDate : Sat Sep 02 2023 18:12:32 GMT+0900 (한국 표준시) {}, name: "KakaoTalk_20230902_181134860.jpg", 
        // size: 2757612, type: "image/jpeg",webkitRelativePath: "",[[Prototype]]: File
    };
    const handleSave = () => {
        delete localFormState.img;
        console.log(localFormState);
        // saveBtn(localFormState);
        // setPreviewImages([]);
    };


    return (
        <Dialog open={dialog} onClose={handleDialogClose}>
            <DialogContent>
                <DialogContentText>
                    {editMode ? `${form.title}의 정보를 변경합니다.` : `새로운 연락처를 추가합니다.`}
                </DialogContentText>
                <Grid container sx={{ mt: 1 }}>
                    {editMode ?
                        <div>
                            <img src={`/img/Photos/${localFormState.folderName}/${localFormState.img}`}
                                className="rounded-3 mx-auto"
                                style={{
                                    width: '300px',
                                    // aspectRatio: '1 / 1',
                                    // objectFit: 'cover'
                                }}
                            />
                        </div>
                        :
                        <div>
                            {previewImages.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    style={{ width: '300px', margin: '5px' }}
                                />
                            ))}
                        </div>
                    }
                </Grid>
                <Grid container spacing={2} rowSpacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            label="Subject"
                            name="subject"
                            fullWidth select
                            onChange={handleFormText}
                            value={localFormState.subject}
                        >
                            {['Exhibition', 'Studio Korea', 'Studio US', 'Other Moments'].map((item) => (
                                <MenuItem value={item} key={item}>{item}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            label="Year"
                            name="year"
                            onChange={handleFormText}
                            value={localFormState.year}
                        /></Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            label="Month"
                            name="month"
                            onChange={handleFormText}
                            value={localFormState.month}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="standard"
                            label="title"
                            name="title"
                            fullWidth multiline
                            onChange={handleFormText}
                            value={localFormState.title}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="standard"
                            label="Note US"
                            name="memo"
                            fullWidth multiline
                            onChange={handleFormText}
                            value={localFormState.memo}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="standard"
                            label="Note KR"
                            name="memo_kr"
                            fullWidth multiline
                            onChange={handleFormText}
                            value={localFormState.memo_kr}
                        />
                    </Grid>
                </Grid>

                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    href="#file-upload"
                    sx={{ mb: -3 }}
                >
                    Upload images
                    <VisuallyHiddenInput type="file" multiple hidden onChange={handleFilesChange} />
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    )
})