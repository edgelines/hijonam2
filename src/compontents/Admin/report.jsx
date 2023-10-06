import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid, Button, Snackbar, Alert, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Typography, Select, MenuItem,
    Tab, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, FormControl, FormControlLabel, RadioGroup, FormLabel, Radio,
} from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
// import { VisuallyHiddenInput, AntSwitch } from '../util.jsx';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { ReactSortable } from "react-sortablejs";
// import CssStyle from './artworks.module.css'
import { Chart, CombinationsChart } from './highcharts.jsx'
import { DataGrid, gridClasses } from '@mui/x-data-grid';

export default function ArtworksPage({ loadDataUrl }) {
    const url = 'http://hijonam.com/img/'
    const [tabValue, setTabValue] = useState('period');
    const [currentPage, setCurrentPage] = useState('월별');
    const [data, setData] = useState([]); // 오리진데이터
    const [genresList, setGenresList] = useState([]); // 장르 리스트
    const [executedList, setExecutedList] = useState([]); // 제작년도 리스트
    const [selectedData, setSelectedData] = useState([]); // 필터된 데이터 
    const [chartData, setChartData] = useState([]);
    const [genre, setGenre] = useState('All'); // Selected Genres
    const [executed, setExecuted] = useState('All') //

    // Handler
    // 장르리스트에서 장르 선택
    const handleChangeGenres = (event) => { setGenre(event.target.value) }
    const handleChangeExecuted = (event) => { setExecuted(event.target.value) }
    // Tab 변경 
    const handleChange = (event, newValue) => { setTabValue(newValue); };
    // 기간별 Chart 
    const handlePageChange = (event) => {
        setCurrentPage(event.target.value);
    }

    // FetchData
    const fetchData = async () => {
        await axios.get(`${url}${loadDataUrl}`).then((response) => {
            const res = response.data.sort((a, b) => a.id - b.id)
            setData(res);
            const result = res.map((item) => {
                return {
                    ...item,
                    imgName: item.fileName[0],
                };
            })
            setSelectedData(result);

            var tmp = ['All'], executed = ['All'];
            res.forEach((value) => { tmp.push(value.genres); executed.push(value.executed); });
            var set = new Set(tmp);
            var newArr = [...set];
            setGenresList(newArr);

            executed.sort((a, b) => Number(a) - Number(b));
            var set = new Set(executed);
            var newArr = [...set];
            setExecutedList(newArr);

            filterByPeriod();

        }).catch((error) => {
            // setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }

    useEffect(() => { fetchData(); filterByPeriod(); }, [])

    useEffect(() => {
        let tableData = [...data];
        if (tabValue === 'serial') {
            if (genre !== 'All') {
                tableData = data.filter((item) => item.genres === genre);
            }
            if (executed !== 'All') {
                tableData = tableData.filter((item) => item.executed === executed);
            }

            const result = tableData.map((item) => {
                return {
                    ...item,
                    imgName: item.fileName[0],
                };
            })
            setSelectedData(result)
        } else if (tabValue === 'holder') {
            // holder Data
            const holder = tableData.filter(item => item.borrow_date != null);
            setSelectedData(holder)
        } else if (tabValue === 'buyer') {
            const dateFields = ['return_date', 'sales_date', 'borrow_date'];
            tableData = tableData.filter(item => item.buyer_name != '' && item.buyer_name != null)
            tableData = tableData.map(item => {
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
            });
            const result = tableData.map((item) => {
                return {
                    ...item,
                    imgName: item.fileName[0],
                    avrHo: item.avrHo = item.ho ? (item.price / item.ho).toLocaleString('ko-KR', { maximumFractionDigits: 2 }) : ''
                };
            })
            setSelectedData(result)
        } else {
            filterByPeriod();
        }

    }, [tabValue, genre, executed, data, currentPage])

    // DataGrid Columns
    const buyerCols = [
        {
            field: 'imgName', headerName: 'Image', width: 80,
            renderCell: (params) => (
                <img src={`/img/Artworks/${params.value}`} className="rounded-3 mx-auto"
                    style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover'
                    }}
                />
            )
        },
        { field: 'sales_date', headerName: 'Sales Date', },
        { field: 'buyer_name', headerName: "Buyer's Name", width: 150, },
        { field: 'genres', headerName: 'Genre', width: 150, },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'serial_number', headerName: 'Serial #', width: 100, },
        { field: 'sizeH', headerName: 'Height', width: 80, },
        { field: 'sizeW', headerName: 'Width', width: 80, },
        {
            field: 'price', headerName: 'Price', width: 100,
            valueFormatter: (params) => {
                if (params.value == null || params.value === '') {
                    return '';
                }
                return `${params.value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}`;
            }
        },
        { field: 'ho', headerName: '호수', width: 80, },
        {
            field: 'avrHo', headerName: '\n', width: 100,
            renderHeader: () => (
                <div>
                    <Grid container>
                        <Typography sx={{ fontSize: '14px' }}>
                            Average unit
                        </Typography>
                        <Typography sx={{ fontSize: '14px' }}>
                            price per "Ho"
                        </Typography>
                    </Grid>
                </div>
            )
        },
    ]
    const holderCols = [
        {
            field: 'imgName', headerName: 'Image', width: 80,
            renderCell: (params) => (
                <img src={`/img/Artworks/${params.value}`} className="rounded-3 mx-auto"
                    style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover'
                    }}
                />
            )
        },
        { field: 'genres', headerName: 'Genre', },
        { field: 'material', headerName: 'Material', width: 300, },
        { field: 'title', headerName: 'Title', width: 300, },
        { field: 'executed', headerName: 'Executed', width: 100, },
        { field: 'serial_number', headerName: 'Serial #', width: 100, },
    ]

    // 기간선택 Function
    const filterByPeriod = () => {
        let periodData = [];
        switch (currentPage) {
            case '분기별':
                periodData = filterDataByPeriod('quarter');
                break;
            case '년도별':
                periodData = filterDataByPeriod('year');
                break;
            case '장르별기준':
                periodData = createHighchartsData();
                console.log(periodData);
                break;
            default:
                periodData = filterDataByPeriod('month');
                break;
        }
        if (currentPage === '월별' || currentPage === '분기별' || currentPage === '년도별') {
            periodData.sort((a, b) => a.period.localeCompare(b.period));
        }
        setChartData(periodData)

    }
    const filterDataByPeriod = (period) => {
        var tmp2 = data.filter(item => item.sales === 1);

        // return originData.value.reduce((acc, cur) => {
        return tmp2.reduce((acc, cur) => {
            const salesDate = new Date(cur.sales_date);
            let periodKey = '';
            switch (period) {
                case 'month':
                    periodKey = `${salesDate.getFullYear()}-${salesDate.getMonth() + 1}`;
                    break;
                case 'quarter':
                    periodKey = `${salesDate.getFullYear()}-Q${Math.floor(salesDate.getMonth() / 3) + 1}`;
                    break;
                case 'year':
                    periodKey = `${salesDate.getFullYear()}`;
                    break;
            }

            const existingPeriod = acc.find(item => item.period === periodKey);

            if (existingPeriod) {
                existingPeriod.totalPrice += cur.price;
            } else {
                acc.push({
                    period: periodKey,
                    totalPrice: cur.price,
                });
            }

            return acc;
        }, []);
    }
    const groupDataByGenreAndYear = () => {
        let groupedData = {};
        var tmp2 = data.filter(item => item.sales === 1);
        tmp2.forEach(item => {
            // originData.value.forEach(item => {
            if (!groupedData[item.genres]) {
                groupedData[item.genres] = {};
            }

            const year = new Date(item.sales_date).getFullYear();

            if (!groupedData[item.genres][year]) {
                groupedData[item.genres][year] = 0;
            }

            groupedData[item.genres][year] += item.price;
        });
        return groupedData;

        // // 정렬
        // // 키 (장르)를 알파벳 순으로 정렬
        // const sortedKeys = Object.keys(groupedData).sort((a, b) => a.localeCompare(b));

        // // 정렬된 키 순서대로 새 객체 생성
        // const sortedGroupedData = {};
        // for (const key of sortedKeys) {
        //     sortedGroupedData[key] = groupedData[key];
        // }
        // return sortedGroupedData;
    }
    const createHighchartsData = () => {
        // 장르와 년도별로 데이터 그룹화
        const groupedData = groupDataByGenreAndYear();

        console.log('groupedData', groupedData);
        // Highcharts에서 사용할 카테고리와 시리즈 데이터 생성
        const categories = Object.keys(groupedData).sort((a, b) => a.localeCompare(b)); // 정렬
        // const categories = Object.keys(groupedData);
        let seriesData = [];
        let pieData = [];

        // 년도별로 데이터를 그룹화하기 위한 객체
        let yearGroupedData = {};

        categories.forEach(category => {
            for (let year in groupedData[category]) {
                if (!yearGroupedData[year]) {
                    yearGroupedData[year] = [];
                }
                yearGroupedData[year].push(groupedData[category][year]);

                // Pie chart data
                pieData.push({
                    name: category,
                    y: groupedData[category][year]
                });
            }
        });

        // 년도별로 column 데이터 생성
        for (let year in yearGroupedData) {
            seriesData.push({
                type: 'column',
                name: year,
                data: yearGroupedData[year]
            });
        }

        // Pie chart data 추가
        seriesData.push({
            type: 'pie',
            id: 'pie',
            data: pieData,
            center: [100, 80],
            size: 100,
            innerSize: '70%',
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        });

        return {
            categories: categories,
            series: seriesData
        };
    }

    return (
        <Grid container>

            {/* 이미지 Table */}
            {/* 상단 Tab */}
            <TabContext value={tabValue}>
                {/* <Grid container direction="column" alignItems='start'> */}
                <TabList onChange={handleChange} aria-label="lab API tabs" >
                    <Tab label="period" value="period" />
                    <Tab label="buyer" value="buyer" />
                    <Tab label="holder" value="holder" />
                    <Tab label="serial #" value="serial" />
                </TabList>
                {/* </Grid> */}

                {/* Tab Panel */}
                <Grid container>
                    <TabPanel value="period" sx={{ minWidth: '80vw' }}>
                        <Grid container>
                            <Grid item xs={2}>
                                <RadioGroup
                                    aria-labelledby="radio-buttons-group-label"
                                    name="radio-buttons-group"
                                    value={currentPage} // 현재 페이지 값을 RadioGroup의 value로 설정
                                    onChange={handlePageChange} // 페이지 변경 핸들러
                                >
                                    <FormLabel sx={{ textAlign: 'start', fontWeight: 580, color: 'black' }}>Revenue by Period</FormLabel>
                                    <FormControlLabel value="월별" control={<Radio />} label="월별" />
                                    <FormControlLabel value="분기별" control={<Radio />} label="분기별" />
                                    <FormControlLabel value="년도별" control={<Radio />} label="년도별" />
                                    <FormControlLabel value="장르별기준" control={<Radio />} label="장르별기준 년도별" />
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={10}>
                                <ContentsComponent currentPage={currentPage} data={chartData} />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value="buyer" sx={{ minWidth: '80vw' }}>
                        <BuyerHolderTable selectedData={selectedData} Cols={buyerCols} />
                    </TabPanel>
                    <TabPanel value="holder" sx={{ minWidth: '80vw' }}>
                        <BuyerHolderTable selectedData={selectedData} Cols={holderCols} />
                        {/* <HolderTable holderData={holderData} /> */}
                    </TabPanel>
                    <TabPanel value="serial" sx={{ minWidth: '80vw' }}>
                        <SerialTable genresList={genresList} executedList={executedList}
                            selectedData={selectedData} handleChangeGenres={handleChangeGenres} handleChangeExecuted={handleChangeExecuted}
                        />
                    </TabPanel>
                </Grid>
            </TabContext>

        </Grid>
    )
}

const BuyerHolderTable = ({ selectedData, Cols }) => {
    return (
        <Grid container spacing={2}>
            {selectedData && selectedData.length > 0 ?
                <DataGrid rows={selectedData}
                    hideFooter
                    // rowHeight={80}
                    getRowHeight={() => 'auto'}
                    height={800}
                    columns={Cols}
                    sx={{
                        border: 0, [`& .${gridClasses.cell}`]: {
                            py: 1,
                        },
                        whiteSpace: 'normal',
                        lineHeight: 1.2,
                    }}
                />
                :
                <Grid item xs={12} direction='column'>
                    <Typography align='center' sx={{ fontSize: '13px', fontWeight: 550 }}>
                        대여한 작품이 없습니다.
                    </Typography>
                </Grid>
            }

        </Grid>
    )
}

const SerialTable = ({ genresList, executedList, selectedData, handleChangeGenres, handleChangeExecuted
    // handleChangeGenres,  handleChangeExecuted 
}) => {

    // DataGrid Columns
    const serialCols = [
        {
            field: 'imgName', headerName: 'Image', width: 80,
            renderCell: (params) => (
                <img src={`/img/Artworks/${params.value}`} className="rounded-3 mx-auto"
                    style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover'
                    }}
                />
            )
        },
        { field: 'genres', headerName: 'Genre', },
        { field: 'material', headerName: 'Material', width: 300, },
        { field: 'title', headerName: 'Title', width: 300, },
        { field: 'executed', headerName: 'Executed', width: 100, },
        { field: 'serial_number', headerName: 'Serial #', width: 100, },
    ]


    return (
        <Grid container spacing={2} >
            <Grid item xs={2}>
                <TextField
                    label="Filter by Art Genre"
                    defaultValue='All'
                    variant='standard'
                    fullWidth
                    select
                    onChange={handleChangeGenres}>
                    {genresList.map((item) => (
                        <MenuItem value={item} key={item}>{item}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Filter by Executed"
                    defaultValue='All'
                    variant='standard'
                    fullWidth select
                    sx={{ mt: 2 }}
                    onChange={handleChangeExecuted}>
                    {executedList.map((item) => (
                        <MenuItem value={item} key={item}>{item}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={10}>
                <DataGrid rows={selectedData}
                    hideFooter
                    // rowHeight={80}
                    getRowHeight={() => 'auto'}
                    height={700}
                    columns={serialCols}
                    sx={{
                        border: 0, [`& .${gridClasses.cell}`]: {
                            py: 1,
                        },
                    }}
                />
            </Grid>
        </Grid>
    )
}

const ContentsComponent = ({ currentPage, data }) => {
    switch (currentPage) {
        case '분기별':
            return <Chart data={data} height={480} Select={'Period'} />
        case '년도별':
            return <Chart data={data} height={480} Select={'Period'} />
        case '장르별기준':
            return <CombinationsChart data={data} height={480} />;
        default: // 월별 기본
            return <Chart data={data} height={480} Select={'Period'} />
    }
}