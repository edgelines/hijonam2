import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Radio, RadioGroup, FormControlLabel, FormControl, Tooltip, tooltipClasses, TextField } from '@mui/material';
import { ThemeProvider, styled } from '@mui/material/styles';
// import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import { generateTheme, API, IMG } from '../util.jsx';
import styles from './priceList.module.css';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx'


export default function PriceListPage() {
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

    const someProps = { fontFamily: null, fontSize: null }
    const theme = generateTheme(someProps);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${IMG}/artworks`)
            const readHoPerPrice = await axios.get(`${API}/pricePolicy`)
            const orderd = response.data.sort((a, b) => a.id - b.id);
            const artworks = orderd.filter(item => item.showArtworks == 0);
            const genrePriceMap = {};

            // 장르별 가격을 맵으로 변환
            readHoPerPrice.data.forEach(item => {
                if (item.genres === 'Fabric') {
                    genrePriceMap['Fabric Collage'] = item.price;
                } else {
                    genrePriceMap[item.genres] = item.price;
                }
            });
            // artworks 배열의 각 작품에 hoPerPrice 속성 추가
            artworks.forEach(artwork => {
                artwork.hoPerPrice = genrePriceMap[artwork.genres] || '';
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
    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        filterByGenre();
    }, [selectedGenre, orignData]);

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
                    const pageHeight = 295 - 19;
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
                <Grid container sx={{ mt: '2vh' }}>
                    <Grid item xs={10} textAlign='start'>
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
                    <Grid item xs={2} textAlign='end'>
                        <ThemeProvider theme={theme}>
                            <Grid container>
                                <Grid item xs={5}>
                                    <LightTooltip title="This content will be exported to a PDF file." placement="left" arrow sx={{ fontSize: '14px' }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Button variant="outlined" onClick={exportPDF}>Export PDF</Button>
                                        </Stack>
                                    </LightTooltip>
                                </Grid>
                                <Grid item xs={6}>
                                    <LightTooltip title="The selected image is exported to Excel. The image does not appear." placement="left" arrow sx={{ fontSize: '14px' }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Button variant="outlined" onClick={exportToExcel}>Export Excel</Button>
                                        </Stack>
                                    </LightTooltip>
                                </Grid>
                            </Grid>
                        </ThemeProvider>
                    </Grid>
                </Grid>

                <Grid container sx={{ mt: '4vh' }}>
                    <Grid item xs={6.5}>
                        <Grid container className='gx-2'>
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
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={5} className='mx-auto' id="tableToExport">
                        <h4 style={{ mb: '10px' }}>Artworks List</h4>
                        <Grid container direction="column" textAlign='right' sx={{ mt: '28px', mb: '16px' }}>
                            <ul style={{ fontSize: '12px' }}>Date : {dateString}</ul>
                        </Grid>
                        <ThemeProvider theme={theme}>
                            <TableContainer component={Paper} elevation={0}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" style={{ width: 65 }} >Img</TableCell>
                                            <TableCell align="center" style={{ width: 200 }}>Title</TableCell>
                                            <TableCell align="center" style={{ width: 65 }}>호수</TableCell>
                                            <TableCell align="center" style={{ width: 100 }}>호당가격</TableCell>
                                            <TableCell align="center" style={{ width: 65 }}>Grade</TableCell>
                                            <TableCell align="center">Price</TableCell>
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
                                                            width: '61.2px',
                                                            height: '61.2px',
                                                            // height: '100%',
                                                            objectFit: 'cover',
                                                            border: '1px solid black'
                                                        }} />
                                                </TableCell>
                                                <TableCell align="center">{row.title}</TableCell>
                                                <TableCell align="center">{row.ho}</TableCell>
                                                <TableCell align="center">{row.hoPerPrice ? (row.hoPerPrice).toLocaleString('KO-KR') : ''}</TableCell>
                                                <TableCell align="center">{row.grade}</TableCell>
                                                <TableCell align="center">
                                                    <TextField variant="standard" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </ThemeProvider>
                    </Grid>
                </Grid>

            </div>

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
        fontSize: 13,
    },
}));