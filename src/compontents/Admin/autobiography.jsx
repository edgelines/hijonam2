import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Grid, Button, Snackbar, Alert, TextField, Tab, Typography } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import { ReactSortable } from "react-sortablejs";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// import ImageResize from '@looop/quill-image-resize-module-react'
// import ImageResize from 'quill-image-resize-module';
// import { ImageDrop } from "quill-image-drop-module";
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import "./autobiography.css";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CssStyle from './autobiography.module.css';
const Font = Quill.import("formats/font");
const Size = Quill.import("formats/size");
Font.whitelist = ["Helvetica", "Nanum-Gothic", "Roboto", "Raleway", "Montserrat", "Lato", "Rubik"];
Size.whitelist = ["8px", "9px", "10px", "11px", "12px", "14px", "18px", "24px", "36px"];
Quill.register(Size, true);
Quill.register(Font, true);
// Quill.register('modules/ImageResize', ImageResize);
// Quill.register("modules/imageDrop", ImageDrop);
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

export default function AutobiographyPage({ loadDataUrl }) {
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [tabValue, setTabValue] = useState('1');
    const [data, setData] = useState([]); // Origin Data
    const [currentPage, setCurrentPage] = useState(null);

    const vertical = 'bottom';
    const horizontal = 'center';
    const url = 'http://hijonam.com/img/'

    // Form State & Handler
    const [form, setForm] = useState({ regDate: "", title: "", content: "", title_kr: "", content_kr: "", views: "" })
    // Form
    const resetForm = () => { setForm({ regDate: "", title: "", content: "", title_kr: "", content_kr: "", views: "" }); };

    const editBtn = (content) => {
        // setEditMode(true);
        handlePageChange('Edit')
        setForm({
            ...form,
            id: content.id,
            regDate: content.regDate,
            title: content.title,
            content: content.content,
            title_kr: content.title_kr,
            content_kr: content.content_kr,
            views: content.views
        });
    };
    const saveBtn = (newFormData) => {
        if (currentPage === 'Edit') {
            updateDatabase(newFormData);
        } else {
            saveToDatabase(newFormData);
        }
        resetForm();
    };

    // DB CRUD Function
    const saveToDatabase = async (newFormData) => {
        try {
            const response = await axios.post(`http://hijonam.com/img/autobiography/save`, newFormData);
            setSeverity('success');
            setSnackbar(true);
            handlePageChange('Cancel')
        } catch (error) {
            setSeverity('error');
            setSnackbar(true);
            console.error(error);
        }
        fetchData();
    };
    const updateDatabase = async (newFormData) => {
        try {
            // Send the FormData to the server using axios
            // console.log('newFormData : ', newFormData);
            const response = await axios.put(`http://hijonam.com/img/autobiography/save/${newFormData.id}`, newFormData);
            setSeverity('success');
            setSnackbar(true);
            handlePageChange('Cancel')
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
                await axios.delete(`${url}${loadDataUrl}/${deleteID.id}`);
                setSeverity('success');
                setSnackbar(true);
                fetchData();
            } catch (error) {
                setSeverity('error');
                setSnackbar(true);
                console.error("Error deleting award:", error);
            }
        }
        fetchData();
    };
    const updateSequences = async () => {
        for (let i = data.length - 1; i >= 0; i--) {
            // for (let i = 0; i < data.length; i++) {
            const item = data[i];
            try {
                const res = await axios.put(`${url}${loadDataUrl}/autobiography/save/${item.id}`, {
                    ...item,
                    sequence: i + 1 // Update the sequence based on the order
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
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(false);
    };

    const fetchData = async () => {
        await axios.get(`${url}${loadDataUrl}`).then((response) => {
            const dateFields = ['regDate'];
            const res = response.data.map(item => {
                dateFields.forEach(field => {
                    if (item[field]) {
                        const date = new Date(item[field]);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        item[field] = `${year}-${month}-${day}`;
                    }
                });
                return item;
            })
            setData(res.sort((a, b) => a.sequence - b.sequence));
        }).catch((error) => {
            setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }
    useEffect(() => { fetchData(); }, [])


    // Handler
    const handlePageChange = (newValue) => { setCurrentPage(newValue); }
    // Tab 변경 
    const handleChange = (event, newValue) => { setTabValue(newValue); };
    const imageRegex = /<img.*?src="(.*?)".*?>/; // 이미지 태그에서 src 값을 추출하는 정규식
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

            <Grid container>
                <Grid item xs={6} textAlign='start' sx={{ ml: 5 }}>
                    <Grid container>
                        {currentPage === 'Writing' ?
                            <>
                                <Grid item xs={2}>
                                    <Button sx={{ mt: 2 }} size="small" variant="contained" startIcon={<KeyboardBackspaceIcon />} onClick={() => handlePageChange('Cancel')}>뒤로가기</Button>
                                </Grid>
                            </>
                            : currentPage === 'Edit' ?
                                <Grid item xs={2}>
                                    <Button sx={{ mt: 2 }} size="small" variant="contained" startIcon={<KeyboardBackspaceIcon />} onClick={() => handlePageChange('Cancel')}>뒤로가기</Button>
                                </Grid>
                                :
                                <Grid item xs={2}>
                                    {tabValue === '1' ?
                                        <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={() => handlePageChange('Writing')}>Writing</Button>
                                        : <Button sx={{ mt: 2 }} size="small" variant="contained" onClick={updateSequences}>Save Order</Button>
                                    }
                                </Grid>
                        }
                    </Grid>
                </Grid>
                <TabContext value={tabValue}>
                    <Grid container direction="column" alignItems='start'>
                        <TabList onChange={handleChange} aria-label="lab API tabs" >
                            <Tab label="추가/삭제/변경" value="1" />
                            <Tab label="순서변경" value="2" />
                        </TabList>
                    </Grid>
                    {/* 추가/삭제/변경 */}
                    <TabPanel value="1">
                        <Grid container>
                            <ContentsComponent currentPage={currentPage} form={form} data={data} editBtn={editBtn} deleteDatabase={deleteDatabase} saveBtn={saveBtn} />
                        </Grid>
                    </TabPanel>
                    {/* 순서변경 */}
                    <TabPanel value="2">
                        <Grid container sx={{ mb: '15px' }}>
                            <Typography align='start' sx={{ fontSize: '14px' }}>순서의 번호가 작을수록 먼저 먼저 보이게 됩니다.</Typography>
                        </Grid>
                        <div className={`${CssStyle.grid_container}`} sx={{ width: '80vw' }}>
                            <ReactSortable list={data} setList={setData}
                                animation={200}
                                className={`${CssStyle.grid}`}
                                ghostClass='blue-background-class'
                            >
                                {data.map((item, index) => (
                                    <Grid container key={item.id}>
                                        <Grid item>
                                            <div className={`${CssStyle.grid_item} ${CssStyle.listGroupitem}`}>
                                                <img src={item.content.match(imageRegex) ? item.content.match(imageRegex)[0] : null} className="rounded-3 mx-auto"
                                                    style={{
                                                        width: '100%',
                                                        aspectRatio: '1 / 1',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography align='start' sx={{ fontSize: '12px' }}>
                                                {item.title}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography align='start' sx={{ fontSize: '12px' }}>
                                                {item.year}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography align='start' sx={{ fontSize: '12px' }}>
                                                순서 : {index + 1}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                            </ReactSortable>
                        </div>
                    </TabPanel>
                </TabContext>
            </Grid>

        </Grid>
    )
}

const EditorForm = ({ form, saveBtn, edit }) => {
    const [localFormState, setLocalFormState] = useState(form);
    const quillRef = useRef(null);
    const quillRef_kr = useRef(null);

    // 이미지 삽입시 재랜더링으로 커서를 찾지 못하는 현상 방지
    const modules = useMemo(() => {
        return {
            imageActions: {},
            imageFormats: {},
            toolbar: [
                [{ font: Font.whitelist }],
                [{ size: Size.whitelist }], // custom dropdown
                // [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                ],
                [{ align: [] }],
                ["link", "image"],
                // ["clean"],
            ],
            // // 핸들러 설정
            // handlers: {
            //     image: imageHandler // 이미지 tool 사용에 대한 핸들러 설정
            // },
            // imageResize: {
            //     displayStyles: {
            //         backgroundColor: 'black',
            //         border: 'none',
            //         color: 'white'
            //     },
            //     modules: ['Resize', 'DisplaySize', 'Toolbar']
            // }
            // ,
            // imageDrop: true,
            // clipboard: {
            //     matchVisual: false              // toggle to add extra line breaks when pasting HTML:
            // },
        }
    }, []);

    const formats = [
        "font", "size", "color", "background", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "align", 'float', 'height', 'width'
    ];

    // Handler
    const actionUploadEditorImage = async (file) => {

        // const sanitizedFileName = `${file.name.replace(/[가-힣\s]/g, '').normalize('NFC')}`;
        let sanitizedFileName = file.name.replace(/[^\w\s.]/g, '').replace(/[가-힣\s]/g, '').normalize('NFC');
        if (sanitizedFileName.length <= 4) { // 예: ".jpg" 보다 짧거나 같은 경우
            const timestamp = new Date().getTime();
            const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z 사이의 랜덤한 알파벳
            sanitizedFileName = `${timestamp}_${randomLetter}${sanitizedFileName}`;
        }
        // Create a new File object with the new name
        const newFile = new File([file], sanitizedFileName, { type: file.type });

        const formData = new FormData();
        formData.append("images", newFile);
        formData.append("fileName", sanitizedFileName);
        try {
            // formData를 서버에 전송
            const response = await axios.post(
                `http://hijonam.com/img/autobiography/upload/Autobiography`, formData,
                { headers: { 'Content-Type': 'multipart/form-data', }, }
            );

            // 서버로부터 받은 응답을 반환
            return response.data; // 서버에서 반환되는 이미지 URL의 형태에 따라 이 부분을 조정해야 할 수 있습니다.

        } catch (error) {
            console.error(error);
            throw error; // 에러를 throw 하여, Quill 이미지 업로드 핸들러에서 catch로 잡을 수 있게 합니다.
        }
    }
    const handleEdior = (event) => {
        const { name, value } = event.target;
        setLocalFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const handleQuillChange = (content) => {
        setLocalFormState(prevState => ({
            ...prevState,
            content: content // content는 ReactQuill에서 제공하는 onChange의 첫 번째 인자입니다.
        }));
    }
    const handleQuillChangeKR = (content) => {
        // console.log(content);
        setLocalFormState(prevState => ({
            ...prevState,
            content_kr: content // content는 ReactQuill에서 제공하는 onChange의 첫 번째 인자입니다.
        }));
    }
    const handleSave = () => {
        saveBtn({
            ...localFormState,
            // content: value
        });
    };

    useEffect(() => {
        const quill = quillRef.current;
        const quill_kr = quillRef_kr.current;

        const handleImage = () => {
            // 이미지 핸들 로직
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
                const file = input.files[0];

                // 현재 커서 위치 저장
                // const range = getEditor().getSelection(true);
                const range = quill.selection

                // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
                quill.getEditor().insertEmbed(range.index, "image", `/img/Util/loading.gif`);


                try {
                    const url = await actionUploadEditorImage(file);
                    // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
                    quill.getEditor().deleteText(range.index, 1);
                    // 받아온 url을 이미지 태그에 삽입
                    quill.getEditor().insertEmbed(range.index, "image", url);

                    // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
                    quill.getEditor().setSelection(range.index + 1);
                } catch (e) {
                    quill.getEditor().deleteText(range.index, 1);
                }
            };
        }
        const handleImage_kr = () => {
            // 이미지 핸들 로직
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
                const file = input.files[0];

                // 현재 커서 위치 저장
                // const range = getEditor().getSelection(true);
                const range = quill_kr.selection

                // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
                quill_kr.getEditor().insertEmbed(range.index, "image", `/img/Util/loading.gif`);


                try {
                    const url = await actionUploadEditorImage(file);
                    // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
                    quill_kr.getEditor().deleteText(range.index, 1);
                    // 받아온 url을 이미지 태그에 삽입
                    quill_kr.getEditor().insertEmbed(range.index, "image", url);

                    // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
                    quill_kr.getEditor().setSelection(range.index + 1);
                } catch (e) {
                    quill_kr.getEditor().deleteText(range.index, 1);
                }
            };
        }

        if (quillRef.current) {
            // const { getEditor } = quillRef.current;
            const toolbar = quill.getEditor().getModule("toolbar");
            toolbar.addHandler("image", handleImage);
        }
        if (quillRef_kr.current) {
            // const { getEditor } = quillRef.current;
            const toolbar_kr = quill_kr.getEditor().getModule("toolbar");
            toolbar_kr.addHandler("image", handleImage_kr);
        }
    }, []);

    useEffect(() => {
        setLocalFormState(form);
        if (!edit) {
            const day = new Date();
            const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            setLocalFormState({ ...localFormState, regDate: formattedDate, views: 0 })
        }
    }, [edit]);

    return (
        <>
            <Grid container sx={{ marginTop: '2vh' }}>
                <Grid item xs={5.9}>
                    <Grid container sx={{ marginBottom: '2vh' }}>
                        <TextField label='제목 (한글)' variant='standard' fullWidth value={localFormState.title_kr} name="title_kr" onChange={handleEdior} />
                    </Grid>
                    <Grid container sx={{ textAlign: 'start' }} >
                        <ReactQuill
                            style={{ height: "65svh", }}
                            ref={quillRef_kr}
                            theme="snow"
                            value={localFormState.content_kr}
                            modules={modules}
                            formats={formats}
                            onChange={handleQuillChangeKR}
                            placeholder="내용을 입력하세요."
                            preserveWhitespace
                        />
                    </Grid>

                </Grid>
                <Grid item xs={0.2}>

                </Grid>
                <Grid item xs={5.9}>
                    <Grid container sx={{ marginBottom: '2vh' }}>
                        <TextField label='제목 (영어)' variant='standard' fullWidth value={localFormState.title} name="title" onChange={handleEdior} />
                    </Grid>
                    <Grid container sx={{ textAlign: 'start' }} >
                        <ReactQuill
                            style={{ height: "65svh" }}
                            ref={quillRef}
                            theme="snow"
                            value={localFormState.content}
                            modules={modules}
                            formats={formats}
                            onChange={handleQuillChange}
                            placeholder="내용을 영어로 입력하세요."
                            preserveWhitespace
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container sx={{ marginTop: '6svh' }}>
                <Grid item xs={12} textAlign='end'>
                    <Button sx={{ mt: '10px' }} size="small" variant="contained" onClick={handleSave}>Save</Button>
                </Grid>
            </Grid>

        </>
    );
};


const DataTable = ({ rows, editBtn, deleteDatabase }) => {
    const columns = [
        { field: 'regDate', headerName: '등록일', width: 130 },
        { field: 'title', headerName: '제목(영어)', width: 130 },
        { field: 'content', headerName: '내용(영어)', width: 400, },
        { field: 'title_kr', headerName: '제목(한글)', width: 130 },
        { field: 'content_kr', headerName: '내용(한글)', width: 400, },
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


const ContentsComponent = ({ form, currentPage, data, editBtn, deleteDatabase, saveBtn }) => {
    switch (currentPage) {
        case 'Writing':
            return <EditorForm form={form} saveBtn={saveBtn} edit={false} />;
        case 'Edit':
            return <EditorForm form={form} saveBtn={saveBtn} edit={true} />;
        case 'Cancel':
            return <DataTable rows={data} editBtn={editBtn} deleteDatabase={deleteDatabase} />
        default:
            return <DataTable rows={data} editBtn={editBtn} deleteDatabase={deleteDatabase} />
    }
}
