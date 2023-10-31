import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Radio, RadioGroup, FormControlLabel, FormControl, Tooltip, tooltipClasses } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import axios from 'axios';
import { AntSwitch, MarginPictures } from './util.jsx';
import styles from './sortPage.module.css';
import jsPDF from "jspdf";
// import logo from '../assets/hijonam_logo.png'
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx'
const theme = createTheme({
    palette: {
        primary: {
            main: 'rgb(0, 0, 0)',
        },
    },
    typography: {
        fontFamily: "'Helvetica', 'Nanum Gothic', 'Roboto', serif, Avenir, Arial, sans-serif",
        fontSize: 12,
    }
});

export default function SortPage() {
    const isTablet = useMediaQuery('(max-width:1200px)');
    const isLgTablet = useMediaQuery('(max-width:1366px)');
    // Img Data State
    const [orignData, setOrignData] = useState([]);
    const [genresData, setGenresData] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedData, setSelectedData] = useState([]);
    const [selectedResult, setSelectedResult] = useState([]);

    // Export Table State
    const date = new Date(); // 현재 시간 가져오기
    const year = date.getFullYear(); // 년도 가져오기
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 가져오기
    const day = String(date.getDate()).padStart(2, '0'); // 일 가져오기
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[date.getDay()]; // 요일 가져오기
    const dateString = `${year}-${month}-${day} (${dayOfWeek})`; // 출력 문자열 만들기
    const [inchCm, setInchCm] = useState(false);
    const [heightWidth, setHeightWidth] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://hijonam.com/img/artworks`)
            const orderd = response.data.sort((a, b) => a.id - b.id);
            const artworks = orderd.filter(item => item.showArtworks == 0);
            // Ottchil과 Ceramin 사이즈 공란 처리
            artworks.forEach(item => {
                if (item.genres === 'Ottchil' || item.genres === 'Ceramic') {
                    item.sizeW = '';
                    item.sizeH = '';
                }
            });
            // data.value = response.data;
            var tmp = [];
            response.data.forEach((value, index, array) => { tmp.push(value.genres); });
            const set = new Set(tmp);
            const newArr = [...set];

            setGenresData(newArr)
            // 원본데이터 저장
            setOrignData(artworks);

            setSelectedGenre(newArr[0])

            // // Export PDF Test Code
            // setSelectedResult(artworks);

        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    useEffect(() => { fetchData(); }, [])
    useEffect(() => { filterByGenre(); }, [selectedGenre, orignData]);

    const filterByGenre = () => {
        // originalArtworks 배열에서 selected.data 배열에 없는 아이템들만 필터링합니다.
        const filteredArtworks = orignData.filter(item => {
            return item.genres === selectedGenre
        });
        setSelectedData(filteredArtworks)
    }
    const imgSelection = (item) => {
        if (!selectedResult) {
            console.error("selected or selected.result is undefined");
            return;
        }

        const index = selectedResult.findIndex(i => i.id === item.id);

        if (index !== -1) {
            // 이미 선택된 아이템이면 배열에서 제거합니다.
            const newResult = [...selectedResult];
            newResult.splice(index, 1);
            setSelectedResult(newResult);
        } else {
            // 아직 선택되지 않은 아이템이면 배열에 추가합니다.
            setSelectedResult(prevState => ([...prevState, item]));
        }
    };

    // Btn Handler
    const handleGenreChange = (genre) => { setSelectedGenre(genre); }
    const handleInchCm = () => { inchCm ? setInchCm(false) : setInchCm(true); }
    const handleHeightWidth = () => { heightWidth ? setHeightWidth(false) : setHeightWidth(true); }

    // Export Handler
    const exportPDF = async () => {
        const input = document.getElementById('tableToExport');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/jpeg');
                const img = new Image();
                img.src = imgData;
                img.onload = function () {
                    const imgWidth = 210 - 20; // A4 dimensions minus margins
                    const pageHeight = isTablet ? 295 - 17 : isLgTablet ? 295 - 19 : 295 - 19;
                    const imgHeight = canvas.height * imgWidth / canvas.width;
                    let heightLeft = imgHeight;

                    const doc = new jsPDF('p', 'mm', 'a4');

                    if (imgHeight <= pageHeight) {
                        doc.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
                    } else {
                        let position = 0;

                        while (heightLeft >= 0) {
                            let canvasPart = document.createElement('canvas');
                            canvasPart.width = canvas.width;
                            let partImgHeight = pageHeight * canvas.width / imgWidth;
                            canvasPart.height = partImgHeight;
                            let ctx = canvasPart.getContext('2d');
                            ctx.drawImage(
                                canvas,
                                0,
                                position * partImgHeight,
                                canvas.width,
                                Math.min(partImgHeight, canvas.height - position * partImgHeight),
                                0,
                                0,
                                canvas.width,
                                Math.min(partImgHeight, canvas.height - position * partImgHeight)
                            );
                            let imgPart = canvasPart.toDataURL('image/png');

                            if (position > 0) {
                                doc.addPage();
                            }
                            doc.addImage(imgPart, 'PNG', 10, 10, imgWidth, imgHeight < pageHeight ? imgHeight : pageHeight);
                            heightLeft -= pageHeight;
                            position++;
                        }
                    }

                    doc.save('HijoNam Artworks.pdf');
                }
            });
    };

    const exportToExcel = async () => {
        let table = document.getElementById("tableToExport");
        let ws = XLSX.utils.table_to_sheet(table);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Artworks");
        XLSX.writeFile(wb, "Artworks.xlsx");
    }
    return (
        <>
            <div>
                <MarginPictures title='SORT' />
                {/* Tltle */}
                <Grid container sx={{ mt: '2vh' }}>
                    <Grid item xs={isTablet ? 6.6 : isLgTablet ? 6 : 10.05} textAlign='start'>
                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '30px', paddingLeft: 2.7, paddingTop: 1.5, color: 'rgb(196, 196, 196)', fontWeight: 600 }}>
                            This page is designed to select artworks by genre and create a list of works
                        </Typography>
                    </Grid>
                    <Grid item xs={isTablet ? 2.4 : isLgTablet ? 3.5 : 0} ></Grid>
                    <Grid item xs={isTablet ? 3 : isLgTablet ? 2.5 : 1.95} textAlign='end'>
                        <ThemeProvider theme={theme}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <LightTooltip title="Inch to Cm Conversion." placement="left" arrow sx={{ fontSize: '2rem' }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography>cm</Typography>
                                            <AntSwitch onChange={handleInchCm} inputProps={{ 'aria-label': 'ant design' }} />
                                            <Typography>inch</Typography>
                                        </Stack>
                                    </LightTooltip>
                                </Grid>
                                <Grid item xs={6} >
                                    <LightTooltip title="Height, Width <-> Width, Height" placement="left" arrow sx={{ fontSize: '2rem' }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <AntSwitch onChange={handleHeightWidth} inputProps={{ 'aria-label': 'ant design' }} />
                                            <Typography>{heightWidth ? "Height, Width" : "Width, Height"}</Typography>
                                        </Stack>
                                    </LightTooltip>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={6}>
                                    <LightTooltip title="This content will be exported to a PDF file." placement="left" arrow sx={{ fontSize: '2rem' }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Button variant="outlined" onClick={exportPDF}>Export PDF</Button>
                                        </Stack>
                                    </LightTooltip>
                                </Grid>
                                <Grid item xs={6}>
                                    <LightTooltip title="The selected image is exported to Excel. The image does not appear." placement="left" arrow sx={{ fontSize: '2rem' }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Button variant="outlined" onClick={exportToExcel}>Export Excel</Button>
                                        </Stack>
                                    </LightTooltip>
                                </Grid>
                            </Grid>
                        </ThemeProvider>
                    </Grid>
                </Grid>

                {/* Selected Img / Table */}
                <Grid container sx={{ mb: '80px' }} >
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={isTablet ? 11.8 : isLgTablet ? 5.9 : 6.5}>
                        <Grid container textAlign='start' sx={{ mt: '2vh', paddingLeft: 0.8 }}>
                            <ThemeProvider theme={theme}>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        defaultValue="Painting"
                                        onChange={(e) => handleGenreChange(e.target.value)}
                                    >
                                        {
                                            genresData.map((genre) => (
                                                <FormControlLabel key={genre} value={genre} control={<Radio />} label={genre} />
                                            ))
                                        }
                                    </RadioGroup>
                                </FormControl>
                            </ThemeProvider>
                        </Grid>
                        <Grid container className='gx-2' sx={{ mt: '1vh' }}>
                            {
                                selectedData.map((item) => (
                                    <Grid item xs={1} key={item.id} onClick={() => imgSelection(item)}
                                        sx={{ width: '80px', height: '80px' }}
                                    >
                                        <img src={`/img/Artworks/${item.fileName[0]}`} loading="lazy"
                                            className={`rounded-3 mx-auto ${styles.listGroupitem} ${selectedResult.includes(item) ? styles.selected : ''}`}
                                            style={{
                                                top: 0,
                                                left: 0,
                                                width: '90%',
                                                height: '90%',
                                                objectFit: 'cover',
                                            }} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>

                    <Grid item xs={isTablet ? 7 : isLgTablet ? 5.9 : 5} className='mx-auto' id="tableToExport">
                        <h4 style={{ mb: '10px' }}>Artworks List</h4>
                        <Grid container direction="column" textAlign='right' sx={{ mt: '3px', mb: isTablet ? '15.5px' : isLgTablet ? '10px' : '14.5px' }}>
                            <ul style={{ fontSize: '12px' }}>Date : {dateString}</ul>
                        </Grid>
                        <ThemeProvider theme={theme}>
                            <TableContainer component={Paper} elevation={0}>
                                <Table sx={{ minWidth: 650, maxWidth: isLgTablet ? 900 : 1500 }} size="small" aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" style={{ width: 100 }} >Img</TableCell>
                                            <TableCell align="center" style={{ width: 350 }}>Title</TableCell>
                                            <TableCell align="center" style={{ width: 250 }}>Material</TableCell>
                                            {heightWidth ?
                                                <>
                                                    <TableCell align="center" style={{ width: isTablet ? 100 : isLgTablet ? 85 : 100 }}>Height {inchCm ? '(inch)' : '(cm)'} </TableCell>
                                                    <TableCell align="center" style={{ width: isTablet ? 100 : isLgTablet ? 85 : 100 }}>Width {inchCm ? '(inch)' : '(cm)'} </TableCell>
                                                </> :
                                                <>
                                                    <TableCell align="center" style={{ width: isTablet ? 100 : isLgTablet ? 85 : 100 }}>Width {inchCm ? '(inch)' : '(cm)'} </TableCell>
                                                    <TableCell align="center" style={{ width: isTablet ? 100 : isLgTablet ? 85 : 100 }}>Height {inchCm ? '(inch)' : '(cm)'} </TableCell>
                                                </>
                                            }
                                            <TableCell align="center" style={{ width: isTablet ? 90 : isLgTablet ? 85 : 90 }}>Executed </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedResult.map((row) => (
                                            <TableRow key={row.fileName}>
                                                <TableCell align="center" >
                                                    <img src={`/img/Artworks/${row.fileName[0]}`}
                                                        className='rounded-3 mx-auto'
                                                        style={{
                                                            top: 0,
                                                            left: 0,
                                                            width: isTablet ? '60.13px' : isLgTablet ? '57.11px' : '60.13px',
                                                            height: isTablet ? '60.13px' : isLgTablet ? '57.11px' : '60.13px',
                                                            // height: '100%',
                                                            objectFit: 'cover',
                                                            border: '0.1px solid grey'
                                                        }} />
                                                </TableCell>
                                                <TableCell align="center" sx={{ fontSize: isTablet ? 12 : isLgTablet ? 11.5 : 12 }}>{row.title}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: isTablet ? 12 : isLgTablet ? 11.5 : 12 }}>{row.material}</TableCell>
                                                {heightWidth ?
                                                    <>
                                                        <TableCell align="center" sx={{ fontSize: isTablet ? 12 : isLgTablet ? 11.5 : 12 }}>{inchCm ? parseInt(row.sizeH * 0.393701) : row.sizeH}</TableCell>
                                                        <TableCell align="center" sx={{ fontSize: isTablet ? 12 : isLgTablet ? 11.5 : 12 }}>{inchCm ? parseInt(row.sizeW * 0.393701) : row.sizeW}</TableCell>
                                                    </> : <>
                                                        <TableCell align="center" sx={{ fontSize: isTablet ? 12 : isLgTablet ? 11.5 : 12 }}>{inchCm ? parseInt(row.sizeW * 0.393701) : row.sizeW}</TableCell>
                                                        <TableCell align="center" sx={{ fontSize: isTablet ? 12 : isLgTablet ? 11.5 : 12 }}>{inchCm ? parseInt(row.sizeH * 0.393701) : row.sizeH}</TableCell>
                                                    </>
                                                }
                                                <TableCell align="center" sx={{ fontSize: isTablet ? 12 : isLgTablet ? 11.5 : 12 }}>{row.executed}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </ThemeProvider>
                    </Grid>
                </Grid>

            </div >


        </>
    );
}


const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        //   backgroundColor: theme.palette.common.white,
        //   color: 'rgba(0, 0, 0, 0.87)',
        //   boxShadow: theme.shadows[1],
        fontSize: 14,
    },
}));