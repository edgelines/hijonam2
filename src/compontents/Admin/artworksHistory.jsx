import React, { FC, useState, forwardRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Grid, Button, Snackbar, Alert, Dialog, DialogContent, DialogContentText, TextField, DialogActions, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableRow, FormControlLabel, InputAdornment,
    RadioGroup, Radio, FormLabel,
    Badge,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';

// import { VisuallyHiddenInput, AntSwitch } from '../util.jsx';

import { TableVirtuoso } from 'react-virtuoso';

export default function ArtworksHistoryPage({ loadDataUrl }) {

    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');

    const [data, setData] = useState([]); // 오리진데이터
    const [genresList, setGenresList] = useState([]); // 장르 리스트
    const [genre, setGenre] = useState('All'); // Selected Genres
    const [sales, setSales] = useState('All');
    const [selectedData, setSelectedData] = useState([]); // Table Data
    const [locationList, setLocationList] = useState([]);
    const vertical = 'bottom';
    const horizontal = 'center';
    const url = 'http://hijonam.com/img/'

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
            fileName: content.fileName,
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
        try {
            const response = await axios.put(`${url}${loadDataUrl}/${newFormData.id}`, newFormData);
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
    const [filterByArtGenre, setFilterByArtGenre] = useState(null);
    const handleFilterByArtGenre = (event) => {
        setFilterByArtGenre(event.target.value);
        setGenre(event.target.value)
    }
    // 장르리스트에서 장르 선택
    const handleFilterByArtworkStatus = (event) => {
        setSales(event.target.value);
    }
    const handleDialogClose = () => { resetForm(); setDialog(false); }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(false);
    };


    // FetchData
    const fetchData = async () => {
        await axios.get(`${url}${loadDataUrl}`).then((response) => {
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

            setData(res);
            setSelectedData(res);
            var tmp = ['All'], location = [];
            res.forEach((value) => { tmp.push(value.genres); location.push(value.location); });
            var set = new Set(tmp);
            var newArr = [...set];
            setGenresList(newArr);
            // setGenre(newArr[1]);

            // 작품 보관 위치 
            var set = new Set(location);
            var newArr = [...set];
            setLocationList(newArr);
        }).catch((error) => {
            setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        let filtered = [...data];
        if (genre !== 'All') {
            filtered = filtered.filter(item => item.genres === genre);
        }
        if (genre && sales !== 'All') {
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
    }, [genre, sales])

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
            <DialogComponent dialog={dialog} data={data} form={form} handleDialogClose={handleDialogClose} saveBtn={saveBtn} locationList={locationList} />

            {/* Content */}
            <Grid container>
                {/* RadioGroup */}
                <Grid item xs={2}>
                    <RadioGroup
                        aria-labelledby="radio-buttons-group-label"
                        name="radio-buttons-group"
                        defaultValue="All"
                        // value={filterByArtGenre} // 현재 페이지 값을 RadioGroup의 value로 설정
                        onChange={handleFilterByArtGenre} // 페이지 변경 핸들러
                    >
                        <FormLabel sx={{ textAlign: 'start', fontWeight: 660, color: 'black' }}>Filter by Art Genre</FormLabel>
                        {genresList.map((item) => (
                            <FormControlLabel value={item} control={<Radio />} label={item} key={item} />
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
                            <FormControlLabel value={item} control={<Radio />} label={item} key={item} />
                        ))}
                    </RadioGroup>
                </Grid>

                {/* History Table */}
                <Grid item xs={10}>
                    <MemoizedTable selectedData={selectedData} editBtn={editBtn} />
                </Grid>
            </Grid>
        </Grid>
    )
}

const MemoizedTable = React.memo(function TableComponent({ selectedData, editBtn }) {
    return (
        <TableContainer sx={{ height: '75vh', width: '100%', fontSize: '12px' }}>
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

    useEffect(() => {
        setLocalFormState(form);
    }, [form]);

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

    const handleSave = () => { saveBtn(localFormState); };

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
                                            name="executed"
                                            fullWidth
                                            multiline
                                            margin="nomal"
                                            rows={3}
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