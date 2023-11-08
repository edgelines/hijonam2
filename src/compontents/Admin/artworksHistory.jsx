import React, { FC, useState, forwardRef, useRef, useEffect, useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import {
    Grid, Button, Snackbar, Alert, Dialog, DialogContent, DialogContentText, TextField, DialogActions, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableRow, FormControlLabel, InputAdornment,
    RadioGroup, Radio, FormLabel, Badge,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { IMG, TEST } from '../util.jsx';

// import { TableVirtuoso } from 'react-virtuoso';

export default function ArtworksHistoryPage({ loadDataUrl }) {
    const isLgTablet = useMediaQuery('(max-width:1400px)');
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');

    const [pageNum, setPageNum] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [originData, setOriginData] = useState([]);
    // const [data, setData] = useState([]); // fetchData들의 merge.
    const [genresList, setGenresList] = useState([]); // 장르 리스트
    const [genre, setGenre] = useState('All'); // Selected Genres
    const [sales, setSales] = useState('All');
    const [selectedData, setSelectedData] = useState([]); // Table Data
    const [locationList, setLocationList] = useState([]);
    const vertical = 'bottom';
    const horizontal = 'center';

    // Form State & Handler
    const [dialog, setDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        genres: "",
        material: "",
        title: "",
        sizeW: "",
        sizeH: "",
        executed: "",
        fileName: '',
        serial_number: '',
        sales: 0,
        sales_country: '',
        sales_date: '',
        payment_status: '',
        exchange: '',
        price: '',
        buyer_name: '',
        buyer_phone: '',
        buyer_city: '',
        buyer_district: '',
        buyer_neighborhood: '',
        seller_name: '',
        holder_name: '',
        holder_phone: '',
        holder_city: '',
        holder_district: '',
        holder_neighborhood: '',
        return_date: '',
        note: '',
        location: '',
        ho: '',
        grade: '',
    })
    // Form
    const resetForm = () => {
        setForm({
            genres: "",
            material: "",
            title: "",
            sizeW: "",
            sizeH: "",
            executed: "",
            fileName: '',
            serial_number: '',
            sales: 0,
            sales_country: '',
            sales_date: '',
            payment_status: '',
            exchange: '',
            price: '',
            buyer_name: '',
            buyer_phone: '',
            buyer_city: '',
            buyer_district: '',
            buyer_neighborhood: '',
            seller_name: '',
            holder_name: '',
            holder_phone: '',
            holder_city: '',
            holder_district: '',
            holder_neighborhood: '',
            return_date: '',
            note: '',
            location: '',
            ho: '',
            grade: '',
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
            fileName: content.fileName,
            serial_number: content.serial_number,
            sales: content.sales,
            sales_country: content.sales_country,
            sales_date: content.sales_date,
            payment_status: content.payment_status,
            exchange: content.exchange,
            price: content.price,
            buyer_name: content.buyer_name,
            buyer_phone: content.buyer_phone,
            buyer_city: content.buyer_city,
            buyer_district: content.buyer_district,
            buyer_neighborhood: content.buyer_neighborhood,
            seller_name: content.seller_name,
            holder_name: content.holder_name,
            holder_phone: content.holder_phone,
            holder_city: content.holder_city,
            holder_district: content.holder_district,
            holder_neighborhood: content.holder_neighborhood,
            borrow_date: content.borrow_date,
            return_date: content.return_date,
            note: content.note,
            location: content.location,
            ho: content.ho,
            grade: content.grade,
        });
        setDialog(true);
    };
    const saveBtn = (newFormData) => {
        if (editMode) {
            updateDatabase(newFormData);
        }
        setDialog(false);
        resetForm();
    };

    // DB CRUD Function
    const updateDatabase = async (newFormData) => {
        const formData = new FormData();
        Object.keys(newFormData).forEach((key) => {
            if (key !== "fileName") {
                formData.append(key, newFormData[key]);
            }
        });
        // 파일 배열 처리
        if (newFormData.fileName && newFormData.fileName.length > 0) {
            // const fileName = Array.from(newFormData.fileName).map(file => { console.log(file) });
            const fileName = Array.from(newFormData.fileName).map(file => file);
            formData.append("fileName", JSON.stringify(fileName));
        }
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        try {
            // console.log(newFormData);
            const response = await axios.put(`${IMG}/${loadDataUrl}/Artworks/${newFormData.id}`, formData);
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

    // Handler
    // 장르리스트에서 장르 선택
    const handleFilterByArtGenre = (event) => { setGenre(event.target.value); }
    // ArtworksStatus
    const handleFilterByArtworkStatus = (event) => { setSales(event.target.value); }
    const handleDialogClose = () => { resetForm(); setDialog(false); }
    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setSnackbar(false); };

    // FetchData
    const fetchData = async (pageNum, pageSize = 15) => {
        setIsLoading(true);
        await axios.get(`${TEST}/adminArtworks`, {
            params: {
                pageNum,
                pageSize,
                genres: genre !== 'All' ? genre : undefined
            }
        }).then((response) => {
            const dateFields = ['return_date', 'sales_date', 'borrow_date'];
            const resDate = response.data.map(item => {
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
            const res = resDate.sort((a, b) => a.id - b.id)
            // setData(res);

            // 기존의 데이터와 새로 fetch로 불러온 데이터를 합치고, 장르가 All이 아닐경우 해당장르만 재필터링함 ( 첫로딩시 'All' 로 불러오기 때문에 )
            // 기존의데이터 필터링 (선택적)
            let 기존의데이터 = genre !== 'All'
                ? selectedData.filter(item => item.genres === genre)
                : selectedData;
            // console.log('기존의데이터 :', 기존의데이터)
            // 기존의데이터와 새 데이터를 합칩니다.
            const 합쳐진데이터 = 기존의데이터.concat(res);
            const 중복제거데이터 = 합쳐진데이터.filter((item, index, array) => {
                return array.findIndex(otherItem => otherItem.id === item.id) === index;
            })

            const newArr = genre !== 'All'
                ? 중복제거데이터.filter(item => item.genres === genre)
                : 중복제거데이터;
            // console.log('newArr :', newArr)
            // 합쳐진데이터를 상태로 설정합니다.
            setSelectedData(newArr);
            setIsLoading(false);
        }).catch((error) => {
            setSeverity('error');
            setIsLoading(false);
            console.error("Error fetching artworks:", error);
        });
    }
    const loadGenres = async () => {
        const res = await axios.get(`${IMG}/genres`);
        var tmp = ['All'];
        res.data.forEach((value) => { tmp.push(value.genres); });
        setGenresList(tmp);
        // setGenre(tmp[0]);
    }
    const loadOriginData = async () => {
        const res = await axios.get(`${IMG}/artworks`);
        setOriginData(res.data);
        var location = [];
        res.data.forEach((value) => { location.push(value.location); });
        // 작품 보관 위치 
        var set = new Set(location);
        var newArr = [...set];
        setLocationList(newArr);
    }
    // 첫랜더링시 장르 테이블에서 장르 리스트 불러오고, 전체 오리진 데이터 불러옴
    useEffect(() => { loadGenres(); loadOriginData(); }, [])

    // 장르를 누르게 되었을때 첫번째 페이지부터 다시 불러오게 만듬.
    useEffect(() => {
        setPageNum(1);
        fetchData(1);
        // console.log('genre : ', genre, pageNum)
    }, [genre]);

    // pageNum이 2 이상일 경우에만 작동. 1일경우 장르를 눌렀을때 똑같이 한번 더 작동하게됨.
    useEffect(() => {
        if (pageNum > 1) {
            fetchData(pageNum)
            // console.log('pageNum : ', genre, pageNum);
        }
    }, [pageNum])

    // Artwork 상태코드, 전체 Origin 데이터에서 불러옴.
    useEffect(() => {
        let filtered = [...originData];
        if (genre !== 'All') {
            filtered = filtered.filter(data => data.genres === genre)
            console.log(filtered);
        }
        if (sales !== 'All') {
            if (sales === "Available") {
                filtered = filtered.filter(data => data.sales == 0 && !data.holder_name);
            } else if (sales === "Sold") {
                filtered = filtered.filter(data => data.sales == 1);
            } else if (sales === "Reservation") {
                filtered = filtered.filter(data => data.sales == 2);
            } else if (sales === "On Rent") {
                filtered = filtered.filter(data => data.holder_name);
            } else if (sales === "One-off") {
                filtered = filtered.filter(data => data.payment_status == 'One-off');
            } else if (sales === "Installments") {
                filtered = filtered.filter(data => data.payment_status == 'Installments');
            }
        }
        setSelectedData(filtered);
    }, [sales])

    const labelStyle = { fontSize: isLgTablet ? '13px' : '14px', textAlign: 'start' }
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
            <DialogComponent dialog={dialog} data={originData} form={form} handleDialogClose={handleDialogClose} saveBtn={saveBtn} locationList={locationList} />

            {/* Content */}
            <Grid container>
                {/* RadioGroup */}
                <Grid item xs={1.5}>
                    <RadioGroup
                        aria-labelledby="radio-buttons-group-label"
                        name="radio-buttons-group"
                        defaultValue="All"
                        // value={filterByArtGenre} // 현재 페이지 값을 RadioGroup의 value로 설정
                        onChange={handleFilterByArtGenre} // 페이지 변경 핸들러
                    >
                        <FormLabel sx={{ textAlign: 'start', fontWeight: 660, color: 'black' }}>Filter by Art Genre</FormLabel>
                        {genresList.map((item) => (
                            <FormControlLabel value={item} control={<Radio size='small' />} label={item} key={item} sx={{ '.MuiFormControlLabel-label': labelStyle }} />
                        ))}
                    </RadioGroup>
                    <RadioGroup
                        aria-labelledby="radio-buttons-group-label"
                        name="radio-buttons-group"
                        // value={sales} // 현재 페이지 값을 RadioGroup의 value로 설정
                        defaultValue="All"
                        onChange={handleFilterByArtworkStatus} // 페이지 변경 핸들러
                        sx={{ mt: 3 }}
                    >
                        <FormLabel sx={{ textAlign: 'start', fontWeight: 660, color: 'black' }}>Filter by Artwork Status</FormLabel>
                        {['All', 'Available', 'Reservation', 'Sold', 'On Rent', 'One-off', 'Installments'].map((item) => (
                            <FormControlLabel value={item} control={<Radio size='small' />} label={item} key={item} sx={{ '.MuiFormControlLabel-label': labelStyle }} />
                        ))}
                    </RadioGroup>
                </Grid>

                {/* History Table */}
                <Grid item xs={10.3}>
                    <MemoizedTable selectedData={selectedData} editBtn={editBtn} isLoading={isLoading} setPageNum={setPageNum} sales={sales} genre={genre} />
                    {/* <MemoizedTable selectedData={selectedData} editBtn={editBtn} /> */}
                </Grid>
            </Grid>
        </Grid>
    )
}

const MemoizedTable = React.memo(function TableComponent({ selectedData, editBtn, isLoading, setPageNum, sales, genre }) {
    const tableContainerRef = useRef(null);  // Create a ref
    const handleScroll = (event) => {
        if (isLoading) return;
        const { offsetHeight, scrollTop, scrollHeight } = event.target;
        // console.log(offsetHeight + scrollTop, scrollHeight);  // Log the values to check
        if (offsetHeight + scrollTop + 100 >= scrollHeight) {
            // console.log(offsetHeight + scrollTop + 100, scrollHeight);
            setPageNum(prevPageNum => prevPageNum + 1);
        }
    }

    useEffect(() => {
        if (sales === 'All') {
            const tableContainerElement = tableContainerRef.current;
            if (tableContainerElement) {
                tableContainerElement.addEventListener('scroll', handleScroll);
                return () => tableContainerElement.removeEventListener('scroll', handleScroll);
            }
        }
    }, [isLoading]);

    // 장르가 변경되었을때 스크롤 상단으로 옮기기
    useEffect(() => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTop = 0; // 스크롤을 맨 위로 이동
        }
    }, [genre])
    return (
        <TableContainer ref={tableContainerRef} sx={{ height: '90svh', width: '100%', fontSize: '12px' }}>
            <Table size="small">
                <TableBody>
                    {selectedData.map((row) => (
                        <TableRowComponent key={row.id} row={row} editBtn={editBtn} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

const TableRowComponent = React.memo(({ row, editBtn }) => {
    // ... 여기서 row 데이터를 사용하여 각 행을 렌더링 ...
    const TableTitle = { textAlign: 'center', fontWeight: 'bold' };
    return (
        <React.Fragment key={row.id}>
            <TableRow>
                <TableCell rowSpan={6} sx={{ width: '8vw' }}>
                    {row.sales === 1 && row.fileName ?
                        <Badge badgeContent=' ' color="error" sx={{
                            '.MuiBadge-badge': {
                                width: 25, // 배지의 너비 설정
                                height: 25, // 배지의 높이 설정
                                borderRadius: 15
                            },
                        }}>
                            <img src={`/img/Artworks/${row.fileName[0]}`} className="rounded-3 mx-auto"
                                style={{
                                    width: '100%',
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover'
                                }}
                            />
                        </Badge>
                        : row.sales === 2 && row.fileName ?
                            <Badge badgeContent=' ' color="info">
                                <img src={`/img/Artworks/${row.fileName[0]}`} className="rounded-3 mx-auto"
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Badge>
                            : row.holder_name && row.fileName ?
                                <Badge badgeContent=' ' color="success">
                                    <img src={`/img/Artworks/${row.fileName[0]}`} className="rounded-3 mx-auto"
                                        style={{
                                            width: '100%',
                                            aspectRatio: '1 / 1',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Badge>
                                :
                                <img src={`/img/Artworks/${row.fileName[0]}`} className="rounded-3 mx-auto"
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        objectFit: 'cover'
                                    }}
                                />
                    }
                </TableCell>
                <TableCell sx={TableTitle}>Title</TableCell>
                <TableCell sx={TableTitle}>Material</TableCell>
                <TableCell sx={TableTitle}>Executed</TableCell>
                <TableCell sx={TableTitle}>Height</TableCell>
                <TableCell sx={TableTitle}>Width</TableCell>
                <TableCell sx={TableTitle}>호수</TableCell>
                <TableCell sx={TableTitle}>Grade</TableCell>
                <TableCell sx={TableTitle}>Serial #</TableCell>
            </TableRow>
            <TableRow>
                <TableCell align='center' >{row.title}</TableCell>
                <TableCell align='center' >{row.material}</TableCell>
                <TableCell align='center' >{row.executed}</TableCell>
                <TableCell align='center' >{row.sizeH}</TableCell>
                <TableCell align='center' >{row.sizeW}</TableCell>
                <TableCell align='center' >{row.ho}</TableCell>
                <TableCell align='center' >{row.grade}</TableCell>
                <TableCell align='center' >{row.serial_number}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={TableTitle}>Sales</TableCell>
                <TableCell sx={TableTitle}>Sales Country</TableCell>
                <TableCell sx={TableTitle}>Sales Date</TableCell>
                <TableCell sx={TableTitle} colSpan={3}>Payment Status</TableCell>
                <TableCell sx={TableTitle} colSpan={2}>Price(원)</TableCell>
            </TableRow>
            <TableRow>
                <TableCell align='center'>{row.sales === 1 ? 'O' : row.sales === 2 ? '▲' : 'X'} </TableCell>
                <TableCell align='center'>{row.sales_country} </TableCell>
                <TableCell align='center'>{row.sales_date} </TableCell>
                <TableCell align='center' colSpan={3}>{row.payment_status} </TableCell>
                <TableCell align='center' colSpan={2}>{row.price ? row.price.toLocaleString('KR') : ''} </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={TableTitle} >Buyer's Name</TableCell>
                <TableCell sx={TableTitle} colSpan={2}>Buyer's Phone #</TableCell>
                <TableCell sx={TableTitle} colSpan={3}>Buyer's Address</TableCell>
                <TableCell sx={TableTitle} colspan={2}>Seller's Name</TableCell>
            </TableRow>
            <TableRow >
                <TableCell align='center'>{row.buyer_name} </TableCell>
                <TableCell align='center' colSpan={2}>{row.buyer_phone} </TableCell>
                <TableCell align='center'>{row.buyer_city} </TableCell>
                <TableCell align='center'>{row.buyer_district} </TableCell>
                <TableCell align='center'>{row.buyer_neighborhood} </TableCell>
                <TableCell align='center' colSpan={2}>{row.seller_name} </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={TableTitle} >Current Location</TableCell>
                <TableCell sx={TableTitle} >Holder's Name</TableCell>
                <TableCell sx={TableTitle} colSpan={2}>Holder's Phone #</TableCell>
                <TableCell sx={TableTitle} colSpan={3}>Holder's Address</TableCell>
                <TableCell sx={TableTitle} >Borrow Date</TableCell>
                <TableCell sx={TableTitle} >Return Date</TableCell>
            </TableRow>
            <TableRow>
                <TableCell align='center' >{row.location} </TableCell>
                <TableCell align='center' >{row.holder_name} </TableCell>
                <TableCell align='center' colSpan={2}>{row.holder_phone} </TableCell>
                <TableCell align='center' >{row.holder_city} </TableCell>
                <TableCell align='center' >{row.holder_district} </TableCell>
                <TableCell align='center' >{row.holder_neighborhood} </TableCell>
                <TableCell align='center' >{row.borrow_date} </TableCell>
                <TableCell align='center' >{row.return_date} </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={8}>
                    <TextField
                        variant="standard"
                        label="Note"
                        name="executed"
                        fullWidth
                        disabled
                        multiline
                        margin="nomal"
                        rows={3}
                        value={row.note}
                        sx={{ backgroundColor: '#fff8db' }}
                    />
                </TableCell>
                <TableCell>
                    <Button size="small" variant="contained" color="warning" onClick={() => editBtn(row)}>Edit</Button>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
});


const DialogComponent = React.memo(({ dialog, data, form, handleDialogClose, saveBtn, locationList }) => {
    const [localFormState, setLocalFormState] = useState(form);
    const [errors, setErrors] = useState({ sales_date: '', borrow_date: '', return_date: '' });

    useEffect(() => { setLocalFormState(form); }, [form]);
    const serialDef = useMemo(() => {
        if (localFormState.serial_number) {
            return localFormState.serial_number; // If the serial number already exists, return it
        } else {
            const genrePrefix = localFormState.genres ? localFormState.genres.slice(0, 3).toUpperCase() : '';
            const yearSuffix = localFormState.executed ? String(localFormState.executed).slice(-2) : '';
            const filterGenre = data.filter(item => item.genres === localFormState.genres);
            const lengthData = filterGenre.filter(item => item.executed === localFormState.executed && item.serial_number);
            let maxSerialNumber = 0;
            lengthData.forEach(item => {
                const serialNumberPart = item.serial_number.slice(-3);  // 마지막 3자리를 추출
                const serialNumber = parseInt(serialNumberPart, 10);  // 숫자로 변환
                if (serialNumber > maxSerialNumber) {  // 현재까지 찾은 최대값과 비교
                    maxSerialNumber = serialNumber;
                }
            });
            // 1을 더하고 3자리 문자열로 변환. 필요하다면 앞에 0을 추가
            const newSerialNumber = String(maxSerialNumber + 1).padStart(3, '0');

            return genrePrefix + yearSuffix + newSerialNumber;
        }
    }, [localFormState.serial_number]);
    const numberToKorean = (number) => {
        var inputNumber = number < 0 ? false : number;
        var unitWords = ['', '만', '억', '조', '경', '해', '자'];
        var splitUnit = 10000;
        var splitCount = unitWords.length;
        var resultArray = [];
        var resultString = '';

        for (var i = 0; i < splitCount; i++) {
            var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
            unitResult = Math.floor(unitResult);
            if (unitResult > 0) {
                resultArray[i] = unitResult;
            }
        }

        for (var a = 0; a < resultArray.length; a++) {
            if (!resultArray[a]) continue;
            resultString = String(resultArray[a]) + unitWords[a] + resultString;
        }

        return resultString;
    }
    const koreanPrice = useMemo(() => { return numberToKorean(localFormState.price) }, [localFormState.price])
    // }, [localFormState.serial_number, localFormState.genres, localFormState.executed, data]);
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setLocalFormState((prev) => ({ ...prev, [name]: value }));
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            setErrors((prev) => ({ ...prev, [name]: 'YYYY-MM-DD 형식이어야 합니다.' }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleDialogClose_하부컴포넌트 = () => {
        handleDialogClose();
        setErrors({ sales_date: '', borrow_date: '', return_date: '' });
    }

    const handleFormText = (event) => {
        const { name, value } = event.target;
        setLocalFormState((prevState) => ({
            ...prevState,
            // [name]: value,
            [name]: name === "price" ? (isNaN(parseInt(value, 10)) ? "" : parseInt(value, 10)) : value,
        }));
    };

    const handleSave = () => {
        const filteredFormState = Object.fromEntries(
            Object.entries(localFormState).filter(([key, value]) => value !== null)
        );
        // console.log(filteredFormState);
        // delete localFormState.fileName;
        saveBtn(filteredFormState);
    };

    return (
        <Dialog open={dialog}
            fullWidth={false} maxWidth={'lg'}
            onClose={handleDialogClose_하부컴포넌트}>
            <DialogContent>
                <DialogContentText>
                    Update History
                </DialogContentText>
                <DialogContentText>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                {/* 이미지 & 비활성화 */}
                                <TableRow>
                                    <TableCell rowSpan={5} sx={{ width: '8vw' }}>
                                        {localFormState.sales === 1 && localFormState.fileName ?
                                            <Badge badgeContent=' ' color="error" sx={{
                                                '.MuiBadge-badge': {
                                                    width: 25, // 배지의 너비 설정
                                                    height: 25, // 배지의 높이 설정
                                                    borderRadius: 15
                                                },
                                            }}>
                                                <img src={`/img/Artworks/${localFormState.fileName[0]}`} className="rounded-3 mx-auto"
                                                    style={{
                                                        width: '100%',
                                                        aspectRatio: '1 / 1',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </Badge>
                                            : localFormState.sales === 2 && localFormState.fileName ?
                                                <Badge badgeContent=' ' color="info">
                                                    <img src={`/img/Artworks/${localFormState.fileName[0]}`} className="rounded-3 mx-auto"
                                                        style={{
                                                            width: '100%',
                                                            aspectRatio: '1 / 1',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </Badge>
                                                : localFormState.holder_name && localFormState.fileName ?
                                                    <Badge badgeContent=' ' color="success">
                                                        <img src={`/img/Artworks/${localFormState.fileName[0]}`} className="rounded-3 mx-auto"
                                                            style={{
                                                                width: '100%',
                                                                aspectRatio: '1 / 1',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    </Badge>
                                                    :
                                                    <img src={`/img/Artworks/${localFormState.fileName[0]}`} className="rounded-3 mx-auto"
                                                        style={{
                                                            width: '100%',
                                                            aspectRatio: '1 / 1',
                                                            objectFit: 'cover'
                                                        }}
                                                    />

                                        }
                                    </TableCell>
                                    <TableCell colSpan={2}>
                                        <TextField
                                            variant="standard"
                                            label="Title"
                                            name="title"
                                            fullWidth disabled
                                            onChange={handleFormText}
                                            value={localFormState.title}
                                        />
                                    </TableCell>
                                    <TableCell colSpan={2}>
                                        <TextField
                                            variant="standard"
                                            label="Material"
                                            name="material"
                                            fullWidth disabled
                                            onChange={handleFormText}
                                            value={localFormState.material}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Height"
                                            name="sizeH"
                                            fullWidth disabled
                                            onChange={handleFormText}
                                            value={localFormState.sizeH}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Width"
                                            name="sizeW"
                                            fullWidth disabled
                                            onChange={handleFormText}
                                            value={localFormState.sizeW}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Executed"
                                            name="executed"
                                            fullWidth disabled
                                            onChange={handleFormText}
                                            value={localFormState.executed}
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Grade"
                                            name="grade"
                                            fullWidth
                                            select
                                            onChange={handleFormText}
                                            value={localFormState.grade !== null && localFormState.grade !== undefined ? localFormState.grade : '-'}
                                        >
                                            {['M★', 'M1', 'M2', '-'].map((item) => (
                                                <MenuItem value={item} key={item}>{item}</MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="호수"
                                            name="ho"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.ho}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Serial #"
                                            name="serial_number"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={serialDef}
                                        />
                                    </TableCell>
                                    <TableCell colSpan={2}>
                                        <TextField
                                            variant="standard"
                                            label="Current Location : Select"
                                            name="location"
                                            fullWidth select
                                            onChange={handleFormText}
                                            value={localFormState.location}
                                        >
                                            {locationList.map((item) => (
                                                <MenuItem value={item} key={item}>{item}</MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell colSpan={2}>
                                        <TextField
                                            variant="standard"
                                            label="Current Location : Text"
                                            name="location"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.location}
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Sales"
                                            name="sales"
                                            fullWidth select
                                            onChange={handleFormText}
                                            value={localFormState.sales !== null && localFormState.sales !== undefined ? localFormState.sales : 0}
                                        >
                                            {['O', '▲', 'X'].map((item) => (
                                                <MenuItem value={item === 'O' ? 1 : item === '▲' ? 2 : 0} key={item}>{item}</MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Sales Country"
                                            name="sales_country"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.sales_country}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Sales Date"
                                            name="sales_date"
                                            fullWidth
                                            onChange={handleDateChange}
                                            value={localFormState.sales_date}
                                            error={Boolean(errors.sales_date)}
                                            helperText={errors.sales_date}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Payment Status"
                                            name="payment_status"
                                            fullWidth select
                                            onChange={handleFormText}
                                            value={localFormState.payment_status !== null && localFormState.payment_status !== undefined ? localFormState.payment_status : '-'}
                                        >
                                            {['One-off', 'Installments', '-'].map((item) => (
                                                <MenuItem value={item} key={item}>{item}</MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell colSpan={2}>
                                        <TextField
                                            variant="standard"
                                            label="Price"
                                            name="price"
                                            InputProps={{
                                                inputComponent: NumericFormatCustom,
                                                endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                            }}
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.price}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {koreanPrice}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Buyer's Name"
                                            name="buyer_name"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.buyer_name}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Buyer's Phone #"
                                            name="buyer_phone"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.buyer_phone}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="시"
                                            name="buyer_city"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.buyer_city}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="구"
                                            name="buyer_district"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.buyer_district}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="동"
                                            name="buyer_neighborhood"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.buyer_neighborhood}
                                        />
                                    </TableCell>
                                    <TableCell colSpan={2}>
                                        <TextField
                                            variant="standard"
                                            label="Seller's Name"
                                            name="seller_name"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.seller_name}
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Holder's Name"
                                            name="holder_name"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.holder_name}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Holder's Phone #"
                                            name="holder_phone"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.holder_phone}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="시"
                                            name="holder_city"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.holder_city}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="구"
                                            name="holder_district"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.holder_district}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="동"
                                            name="holder_neighborhood"
                                            fullWidth
                                            onChange={handleFormText}
                                            value={localFormState.holder_neighborhood}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Borrow Date"
                                            name="borrow_date"
                                            fullWidth
                                            onChange={handleDateChange}
                                            value={localFormState.borrow_date}
                                            error={Boolean(errors.borrow_date)}
                                            helperText={errors.borrow_date}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            label="Return Date"
                                            name="return_date"
                                            fullWidth
                                            onChange={handleDateChange}
                                            value={localFormState.return_date}
                                            error={Boolean(errors.return_date)}
                                            helperText={errors.return_date}
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <TextField
                                            variant="standard"
                                            label="Note"
                                            name="note"
                                            fullWidth
                                            multiline
                                            margin="nomal"
                                            rows={3}
                                            onChange={handleFormText}
                                            value={localFormState.note}
                                            sx={{ backgroundColor: '#fff8db' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose_하부컴포넌트}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    )
})


const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
    props,
    ref,
) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
        // prefix="원" // 이 부분을 필요에 따라 추가하거나 삭제하세요
        />
    );
});