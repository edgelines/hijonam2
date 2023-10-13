import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Grid, Button, Snackbar, Alert, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Input, MenuItem,
    Tab, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, FormControl, FormControlLabel
} from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import { AntSwitch } from '../util.jsx';
import { ReactSortable } from "react-sortablejs";
import CssStyle from './artworks.module.css'

export default function ArtworksPage({ loadDataUrl }) {
    const [tabValue, setTabValue] = useState('1');
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');

    const [data, setData] = useState([]); // 오리진데이터
    const [genresList, setGenresList] = useState(['All']); // 장르 리스트
    const [genre, setGenre] = useState(null); // Selected Genres
    const [selectedData, setSelectedData] = useState([]); // Table Data

    const vertical = 'bottom';
    const horizontal = 'center';
    const url = 'http://hijonam.com/img/'

    // Form State & Handler
    const [dialog, setDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        fileName: "",
        genres: "",
        material: "",
        title: "",
        sizeW: "",
        sizeH: "",
        executed: "",
        sequence: ""
    })
    // Form
    const newForm = () => { setEditMode(false); setDialog(true); resetForm(); }
    const resetForm = () => {
        setForm({
            fileName: "",
            genres: "",
            material: "",
            title: "",
            sizeW: "",
            sizeH: "",
            executed: "",
            sequence: "",
            showArtworks: ""
        });
    };
    const editBtn = (content) => {
        setEditMode(true);
        setForm({
            ...form,
            id: content.id,
            genres: content.genres,
            material: content.material,
            title: content.title,
            sizeW: content.sizeW,
            sizeH: content.sizeH,
            executed: content.executed,
            sequence: content.sequence,
            showArtworks: content.showArtworks,
            fileName: "",
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
            const response = await axios.post(`${url}${loadDataUrl}/Artworks`, formData, {
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

        try {
            const response = await axios.put(`${url}${loadDataUrl}/Artworks/${newFormData.id}`, formData, {
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
                setSnackbar(true);
                setSeverity('success');
            } catch (error) {
                setSnackbar(true);
                setSeverity('error');
                console.error("Error deleting award:", error);
            }
        }
        fetchData();
    };

    const updateShowArtworks = async (item) => {
        try {
            const response = await axios.put(`${url}${loadDataUrl}/Artworks/${item.id}`, {
                showArtworks: item.showArtworks,
                sequence: item.sequence,
                executed: item.executed,
                genres: item.genres,
                material: item.material,
                sizeH: item.sizeH,
                sizeW: item.sizeW,
                title: item.title
            });

            if (response.status === 200) {
                setSnackbar(true);
                setSeverity('success');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const updateSequences = async () => {
        for (let i = 0; i < selectedData.length; i++) {
            const item = selectedData[i];
            try {
                const res = await axios.put(`${url}${loadDataUrl}/Artworks/${item.id}`, {
                    sequence: i + 1, // Update the sequence based on the order
                    showArtworks: item.showArtworks,
                    executed: item.executed,
                    genres: item.genres,
                    material: item.material,
                    sizeH: item.sizeH,
                    sizeW: item.sizeW,
                    title: item.title
                });
                if (res.status === 200) {
                    setSnackbar(true);
                    setSeverity('success');
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }

    // Handler
    const handleDialogClose = () => { resetForm(); setDialog(false); }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(false);
    };

    // 장르리스트에서 장르 선택
    const handleChangeGenres = (event) => { setGenre(event.target.value) }
    // Tab 변경 
    const handleChange = (event, newValue) => { setTabValue(newValue); };

    // FetchData
    const fetchData = async () => {
        await axios.get(`${url}${loadDataUrl}`).then((response) => {
            const res = response.data.sort((a, b) => a.id - b.id)
            setData(res);
            setSelectedData(res);
            var tmp = ['All'];
            res.forEach((value) => { tmp.push(value.genres); });
            const set = new Set(tmp);
            const newArr = [...set];
            setGenresList(newArr);
            // setGenre(newArr[1]);
        }).catch((error) => {
            setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }

    useEffect(() => { fetchData(); }, [])

    useEffect(() => {
        if (genre === 'All') {
            setSelectedData(data);
        } else {
            const d = data.filter(item => item.genres === genre);
            setSelectedData(d);
        }
    }, [data, genre])

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
            <DialogComponent dialog={dialog} form={form} data={data} handleDialogClose={handleDialogClose}
                editMode={editMode} saveBtn={saveBtn} genresList={genresList}
            />

            {/* 이미지 Table */}
            <Grid container>
                <Grid item xs={1} textAlign='start' sx={{ ml: 5 }}>
                    {tabValue === '1' ?
                        <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={newForm}>Add Genres</Button>
                        : <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={updateSequences}>Save Order</Button>
                    }
                </Grid>
                <Grid item xs={2} textAlign='start'>
                    <FormControl size="small" sx={{ width: 200 }}>
                        <TextField
                            label="Genres"
                            defaultValue='All'
                            // value={genre}
                            variant='standard'
                            select
                            onChange={handleChangeGenres}>
                            {genresList.map((item) => (
                                <MenuItem value={item} key={item}>{item}</MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                </Grid>
                {/* 상단 Tab */}
                <TabContext value={tabValue}>
                    <Grid container direction="column" alignItems='start'>
                        <TabList onChange={handleChange} aria-label="lab API tabs" >
                            <Tab label="이미지 추가/삭제/변경" value="1" />
                            <Tab label="이미지 순서변경" value="2" />
                        </TabList>
                    </Grid>
                    {/* 이미지 추가/삭제/변경 */}
                    <TabPanel value="1">
                        <Grid container>
                            <Grid item xs={12}>
                                <TableContainer sx={{ height: '75vh', width: '100%' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ width: '5vw' }}>Image</TableCell>
                                                <TableCell>Art Genres</TableCell>
                                                <TableCell sx={{ width: '15vw' }}>Material</TableCell>
                                                <TableCell sx={{ minWidth: '15vw' }}>Title</TableCell>
                                                <TableCell>Height(cm)</TableCell>
                                                <TableCell>Width(cm)</TableCell>
                                                <TableCell>Executed</TableCell>
                                                <TableCell sx={{ width: '30px' }}>Edit</TableCell>
                                                <TableCell sx={{ width: '150px' }}>Show Artworks</TableCell>
                                                <TableCell sx={{ width: '30px' }}>Delete</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedData.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>
                                                        <img src={`/img/Artworks/${row.fileName[0]}`} className="rounded-3 mx-auto"
                                                            style={{
                                                                width: '100%',
                                                                aspectRatio: '1 / 1',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{row.genres}</TableCell>
                                                    <TableCell>{row.material}</TableCell>
                                                    <TableCell>{row.title}</TableCell>
                                                    <TableCell align='center'>{row.sizeH}</TableCell>
                                                    <TableCell align='center'>{row.sizeW}</TableCell>
                                                    <TableCell align='center'>{row.executed}</TableCell>
                                                    <TableCell>
                                                        <Button size="small" variant="contained" color="warning" onClick={() => editBtn(row)}>Edit</Button>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <FormControlLabel
                                                            control={<AntSwitch sx={{ m: 1 }} checked={row.showArtworks === 1 ? false : true} onChange={() => updateShowArtworks(row)} />}
                                                            label={`${row.showArtworks === 1 ? 'Off' : 'On'}`}
                                                        />
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
                    </TabPanel>
                    <TabPanel value="2">
                        <div className={`${CssStyle.grid_container}`} sx={{ width: '80vw' }}>
                            <ReactSortable list={selectedData} setList={setSelectedData}
                                animation={200}
                                className={`${CssStyle.grid}`}
                                ghostClass='blue-background-class'
                            >
                                {selectedData.map((item) => (
                                    <div key={item.id} className={`${CssStyle.grid_item} ${CssStyle.listGroupitem}`}>
                                        <img src={`/img/Artworks/${item.fileName[0]}`} className="rounded-3 mx-auto"
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1 / 1',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>

                                ))}
                            </ReactSortable>
                        </div>
                    </TabPanel>
                </TabContext>
            </Grid>
        </Grid>
    )
}

const DialogComponent = React.memo(({ dialog, form, data, handleDialogClose, editMode, saveBtn, genresList }) => {
    const fileInputRef = useRef(null);
    const [localFormState, setLocalFormState] = useState(form);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        setLocalFormState(form);
    }, [form]);

    useEffect(() => {
        if (localFormState.genres) {
            const d = data.filter(item => item.genres === localFormState.genres);
            if (d.length > 0) {
                const maxSequence = Math.max(...d.map(item => item.sequence));
                const newOrder = maxSequence + 1;
                setLocalFormState(prevForm => ({
                    ...prevForm,
                    sequence: newOrder,
                }));
            } else {
                setLocalFormState(prevForm => ({
                    ...prevForm,
                    sequence: '',
                }));
            }
        }
    }, [localFormState.genres])

    const handleFormText = (event) => {
        const { name, value } = event.target;
        setLocalFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
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
        setLocalFormState({ ...localFormState, fileName: sanitizedFileObjects })
        const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
        setPreviewImages(imageUrls);
    };
    const handleFileDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFilesChange({ target: { files } }); // 기존의 handleFilesChange 함수를 재활용
    };
    const handleSave = () => {
        delete localFormState.img;
        saveBtn(localFormState);
        setPreviewImages([]);
    };
    const handleClose = () => {
        setPreviewImages([]);
        handleDialogClose();
    }

    return (
        <Dialog open={dialog}
            fullWidth={false} maxWidth={'md'}
            onClose={handleClose}>
            <DialogContent>
                <DialogContentText>
                    {editMode ? 'EDIT Artworks' : 'ADD Artworks'}
                </DialogContentText>
                <DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                variant="standard"
                                label="Select Art Genre"
                                name="genres"
                                select
                                fullWidth
                                onChange={handleFormText}
                                value={localFormState.genres}
                                helperText="장르를 선택하거나 새로 입력하세요."
                            >{genresList.map((item) => (
                                <MenuItem value={item} key={item}>{item}</MenuItem>
                            ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                variant="standard"
                                label="Create a New Genre"
                                name="genres"
                                fullWidth
                                onChange={handleFormText}
                                value={localFormState.genres}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                variant="standard"
                                label="Material"
                                name="material"
                                fullWidth
                                onChange={handleFormText}
                                value={localFormState.material}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                variant="standard"
                                label="Title"
                                name="title"
                                fullWidth
                                onChange={handleFormText}
                                value={localFormState.title}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                variant="standard"
                                label="Order"
                                name="sequence"
                                disabled
                                fullWidth
                                onChange={handleFormText}
                                value={localFormState.sequence}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                variant="standard"
                                label="Height(cm)"
                                name="sizeH"
                                fullWidth
                                onChange={handleFormText}
                                value={localFormState.sizeH}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                variant="standard"
                                label="Width(cm)"
                                name="sizeW"
                                fullWidth
                                onChange={handleFormText}
                                value={localFormState.sizeW}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                variant="standard"
                                label="Executed"
                                name="executed"
                                fullWidth
                                onChange={handleFormText}
                                value={localFormState.executed}
                            />
                        </Grid>
                    </Grid>
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
                {/* DragDrop Upload */}
                <Grid container sx={{ mt: '15px' }}>
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        style={{ width: '100%', height: '80px', border: '2px dashed gray' }}
                    >
                    </div>
                    <Grid container>
                        <Grid item xs={9}>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFilesChange}
                                style={{ display: 'none' }}
                            />
                        </Grid>
                        <Grid item xs={3} container direction='column' justifyContent='end'>
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
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    )
})