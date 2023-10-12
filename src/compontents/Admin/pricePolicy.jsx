import React, { useState, useEffect, useMemo } from 'react';
import {
    Grid, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment, TextField, MenuItem,
    Box, IconButton, Collapse, Snackbar, Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { NumericFormatCustom } from '../util.jsx';
import styles from './pricePolicy.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Collapse from 'react-bootstrap/Collapse';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function PricePolicyPage({ loadDataUrl }) {
    // Img Data State
    const url = 'http://hijonam.com/api/'
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState(null);
    const vertical = 'bottom';
    const horizontal = 'center';
    const [orignData, setOrignData] = useState([]);
    const [collapse, setCollapse] = useState(false);
    const [form, setForm] = useState([])
    const [cal, setCal] = useState({ ho: '', price: '', gradeText: '', grade: null, exchange: '', fee: '', discountRate: '' })

    const fetchData = async () => {
        try {
            const res = await axios.get(`${url}${loadDataUrl}`)
            var tmp = res.data.sort((a, b) => a.id - b.id);
            setOrignData(tmp);
            setForm({
                Painting: tmp.filter((item) => item.genres === 'Painting')[0].price,
                Fabric: tmp.filter((item) => item.genres === 'Fabric')[0].price,
                Hanji: tmp.filter((item) => item.genres === 'Hanji')[0].price,
                Patina: tmp.filter((item) => item.genres === 'Patina')[0].price
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])


    // Table Const
    const hoList = [
        { ho: 1, P: '22.7 x 14.0', S: '15.8 x 15.8' },
        { ho: 2, P: '25.8 x 16.0', S: '17.9 x 17.9' },
        { ho: 3, P: '27.3 x 19.0', S: '22.0 x 22.0' },
        { ho: 4, P: '33.4 x 21.2', S: '24.2 x 24.2' },
        { ho: 5, P: '34.8 x 24.2', S: '27.3 x 27.3' },
        { ho: 6, P: '40.9 x 27.3', S: '31.8 x 31.8' },
        { ho: 8, P: '45.5 x 33.4', S: '37.9 x 37.9' },
        { ho: 10, P: '53.0 x 40.9', S: '45.0 x 45.0' },
        { ho: 12, P: '60.6 x 45.5', S: '50.0 x 50.0' },
        { ho: 15, P: '65.1 x 45.5', S: '53.0 x 53.0' },
        { ho: 20, P: '72.2 x 53.0', S: '60.6 x 60.6' },
        { ho: 25, P: '80.3 x 60.6', S: '65.1 x 65.1' },
        { ho: 30, P: '90.9 x 65.1', S: '72.7 x 72.7' },
        { ho: 40, P: '100.0 x 72.7', S: '80.3 x 80.3' },
        { ho: 50, P: '116.8 x 80.3', S: '91.0 x 91.0' },
        { ho: 60, P: '130.3 x 89.4', S: '97.0 x 97.0' },
        { ho: 80, P: '145.5 x 97.0', S: '112.1 x 112.1' },
        { ho: 100, P: '162.2 x 112.1', S: '130.3 x 130.3' },
        { ho: 120, P: '193.9 x 112.1', S: ' - ' },
        { ho: 150, P: '227.3 x 162.1', S: '181.8 x 181.8' },
        { ho: 200, P: '259.1 x 181.8', S: '193.9 x 193.9' },
        { ho: 300, P: '290.9 x 197.0', S: '218.2 x 218.2' },
        { ho: 500, P: '333.3 x 218.2', S: '248.5 x 248.5' }]

    const feeList = [10000, 20000, 30000, 40000, 50000, 80000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000]
    const feePer = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3]
    const shouldColorCell = (rowIndex, colIndex) => {
        if (rowIndex < 7) return styles.feeTableColor; // 1번행부터 7번행까지 전열 칠하기
        if (rowIndex === 7 && colIndex >= 4) return styles.feeTableColor; // 8번행은 첫 4칸 빼고 색칠
        if (rowIndex === 8 && colIndex >= 5) return styles.feeTableColor; // 9번행은 첫 5칸 빼고 색칠
        if (rowIndex === 9 && colIndex >= 6) return styles.feeTableColor; // 9번행은 첫 5칸 빼고 색칠
        if (rowIndex === 10 && colIndex >= 7) return styles.feeTableColor; // 9번행은 첫 5칸 빼고 색칠
        if (rowIndex === 11 && colIndex >= 8) return styles.feeTableColor; // 9번행은 첫 5칸 빼고 색칠
        if (rowIndex >= 12 && rowIndex < 16 && colIndex >= 9) return styles.feeTableColor; // 9번행은 첫 5칸 빼고 색칠
        if (rowIndex >= 16 && colIndex >= 10) return styles.feeTableColor; // 9번행은 첫 5칸 빼고 색칠
        // 추가 조건을 여기에 추가
        return '';
    }
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
    const koreanPrice = useMemo(() => {
        return numberToKorean(cal.price);
    }, [cal.price]);

    const totalPrice = useMemo(() => {
        if (cal.ho && cal.price && cal.grade && cal.discountRate) {
            const basePrice = cal.ho * cal.price * cal.grade;
            return basePrice - ((cal.ho * cal.price * cal.grade) * cal.discountRate / 100);
        } else if (cal.ho && cal.price && cal.grade) {
            return cal.ho * cal.price * cal.grade;
        }
    }, [cal.ho, cal.price, cal.grade, cal.discountRate])

    const brokerFee = useMemo(() => {
        if (totalPrice > 0 && totalPrice <= 100000 * 1000) {
            return "최대 20%";
        } else if (totalPrice > 100000 * 1000 && totalPrice < 200000 * 1000) {
            return "최대 16%";
        } else if (totalPrice > 200000 * 1000 && totalPrice < 300000 * 1000) {
            return "최대 15%";
        } else if (totalPrice > 300000 * 1000 && totalPrice < 400000 * 1000) {
            return "최대 14%";
        } else if (totalPrice > 400000 * 1000 && totalPrice < 500000 * 1000) {
            return "최대 13%";
        } else if (totalPrice > 500000 * 1000 && totalPrice < 600000 * 1000) {
            return "최대 12%";
        } else if (totalPrice > 600000 * 1000 && totalPrice < 1500000 * 1000) {
            return "최대 11%";
        } else if (totalPrice > 1500000 * 1000) {
            return "최대 10%";
        }
        return "";
    }, [totalPrice]);

    const discountPrice = useMemo(() => {
        return cal.discountRate ? (cal.ho * cal.price * cal.grade) * cal.discountRate / 100 : '';
    }, [cal.discountRate]);

    const discountPriceKor = useMemo(() => {
        if (discountPrice) {
            return numberToKorean(discountPrice);
        }
    })
    // Handler
    const handleCal = (event) => {
        const { name, value } = event.target;
        setCal((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const handleForm = (event) => {
        const { name, value } = event.target;
        setForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(false);
    };

    // DB Save
    const saveBtn = () => {
        saveToDatabase();
    };
    const saveToDatabase = async () => {
        try {
            // // 데이터 배열을 반복하면서 각 항목을 업데이트합니다.
            const promises = Object.entries(form).map(async ([genre, price]) => {
                // 해당 장르에 해당하는 ID를 찾습니다.
                const item = orignData.find(entry => entry.genres === genre);
                // const item = orignData[genre];
                if (item) {
                    const updatedData = {
                        ...item,
                        price: parseInt(price)
                    };
                    // 서버에 PUT 요청을 보냅니다.
                    await axios.put(`http://hijonam.com/api/pricePolicy/${updatedData.id}`, updatedData);
                }
            })
            // 모든 요청이 완료될 때까지 기다립니다.
            await Promise.all(promises);
            // const response = await axios.post(`${url}${loadDataUrl}`, form);
            // data.unshift(response.data);
            setSnackbar(true);
            setSeverity('success');
            // setDialog(false);
        } catch (error) {
            setSnackbar(true);
            setSeverity('error');
            console.error(error);
        }
        fetchData();
    };

    return (
        <>
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
            {/*  */}
            <Grid container spacing={3}>
                <Grid item xs={10.5}>
                    {/* 호수, 호당가격, 등급, 환율, 브로커수수료 */}
                    <Grid container spacing={5} sx={{ height: '110px' }}>
                        <Grid item xs={2}>
                            <div>M★ : 5</div>
                            <div>M1 : 3</div>
                            <div>M2 : 2</div>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField label="호수" variant="standard" fullWidth name="ho" value={cal.ho} onChange={handleCal} />
                        </Grid>
                        <Grid item xs={2}>
                            <Grid container>
                                <TextField label="호당가격" variant="standard" fullWidth name="price" value={cal.price} onChange={handleCal}
                                    InputProps={{
                                        inputComponent: NumericFormatCustom,
                                        endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid container direction='column' justifyContent='end'>
                                <Typography sx={{ fontSize: '13px' }} align='end'>
                                    {koreanPrice}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField label="Grade" variant="standard" select fullWidth name="grade" defaultValue={1} onChange={handleCal}>
                                {['M★', 'M1', 'M2', '-'].map((item) => (
                                    <MenuItem key={item} value={item === 'M★' ? 5 : item === 'M1' ? 3 : item === 'M2' ? 2 : 1}>{item}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField label="환율" variant="standard" name="exchange" value={cal.exchange} onChange={handleCal}
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Grid container>
                                <TextField label="Brokeage Fee%" variant="standard" fullWidth name="fee" value={cal.fee} onChange={handleCal}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid container direction='column' justifyContent='end'>
                                <Typography sx={{ fontSize: '13px' }} align='end'>
                                    {brokerFee}
                                </Typography>
                            </Grid>

                        </Grid>
                    </Grid>

                    {/* Discount */}
                    <Collapse in={collapse} timeout={300}>
                        <Box>
                            <Grid container spacing={5}>
                                <Grid item xs={8}></Grid>
                                <Grid item xs={4} container spacing={5}>
                                    <Grid item xs={6}>
                                        <TextField label="Discount Rate" variant="standard" fullWidth name="discountRate" value={cal.discountRate} onChange={handleCal}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Grid container>
                                            <TextField label="Discount Price" variant="standard" fullWidth value={discountPrice}
                                                InputProps={{
                                                    inputComponent: NumericFormatCustom,
                                                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                        <Grid container direction='column' justifyContent='end'>
                                            <Typography sx={{ fontSize: '13px' }} align='end'>{discountPriceKor}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                    <IconButton aria-label="collapse" onClick={() => setCollapse(!collapse)}
                        aria-controls="Home Image Collapse"
                        aria-expanded={collapse}
                        sx={{ marginTop: '-6px' }}
                    >
                        {collapse ? <ArrowDropUpIcon sx={{ fontSize: '30px' }} /> :
                            <ArrowDropDownIcon sx={{ fontSize: '30px' }} />
                        }
                    </IconButton>

                    {/* 호당가격 */}
                    <Grid container sx={{ paddingLeft: 10, paddingTop: 2 }}>
                        <TableContainer sx={{ height: '650px', width: '100%' }}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>호수</TableCell>
                                        <TableCell align='center'>풍경 ( P )</TableCell>
                                        <TableCell align='center'>정방형 ( S )</TableCell>
                                        <TableCell align='center' sx={{ backgroundColor: 'ivory' }}>Painting</TableCell>
                                        <TableCell align='center' sx={{ backgroundColor: 'snow' }}>Fabric Collage</TableCell>
                                        <TableCell align='center' sx={{ backgroundColor: 'azure' }}>Hanji</TableCell>
                                        <TableCell align='center' sx={{ backgroundColor: 'aliceblue' }}>Patina</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {hoList.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align='center'>{row.ho}</TableCell>
                                            <TableCell align='center'>{row.P}</TableCell>
                                            <TableCell align='center'>{row.S}</TableCell>
                                            <TableCell align='right' sx={{ backgroundColor: 'ivory' }} >{(row.ho * form.Painting).toLocaleString('KO-KR')}</TableCell>
                                            <TableCell align='right' sx={{ backgroundColor: 'snow' }} >{(row.ho * form.Fabric).toLocaleString('KO-KR')}</TableCell>
                                            <TableCell align='right' sx={{ backgroundColor: 'azure' }} >{(row.ho * form.Hanji).toLocaleString('KO-KR')}</TableCell>
                                            <TableCell align='right' sx={{ backgroundColor: 'aliceblue' }} >{(row.ho * form.Patina).toLocaleString('KO-KR')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

                {/* Result : Price, Brokerage Fee %, Form */}
                <Grid item xs={1.4}>
                    {/* Price */}
                    <TableContainer>
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell align='center' sx={{ fontWeight: 600 }}>Price</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align='right'>
                                        {totalPrice ? totalPrice.toLocaleString('KO-KR') : ''}
                                        원</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align='right'>$ {cal.exchange && totalPrice ? parseInt(totalPrice / cal.exchange).toLocaleString('KO-KR') : ''} </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Brokerage Fee % */}
                    <TableContainer sx={{ mt: '3vh' }}>
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell align='center' sx={{ fontWeight: 600 }}>Brokerage Fee %</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align='right'>{totalPrice ? (cal.fee / 100 * totalPrice).toLocaleString('KO-KR') : ''} 원</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align='right'>$ {cal.fee && cal.exchange ? parseInt(cal.fee / 100 * totalPrice /
                                        cal.exchange).toLocaleString('KO-KR') : ''}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Grid container sx={{ mt: '3vh' }} rowSpacing={3}>
                        <Grid item xs={11}>
                            <TextField label="Painting" variant="standard" name="Painting" value={form.Painting} onChange={handleForm}
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={11}>
                            <TextField label="Fabric Collage" variant="standard" name="Fabric Collage" value={form.Fabric} onChange={handleForm}
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={11}>
                            <TextField label="Hanji" variant="standard" name="Hanji" value={form.Hanji} onChange={handleForm}
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={11}>
                            <TextField label="Patina" variant="standard" name="Patina" value={form.Patina} onChange={handleForm}
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={11} textAlign='end'>
                            <Button onClick={saveBtn}>Save</Button>
                        </Grid>
                    </Grid>

                </Grid>


            </Grid>

            {/* Brokerage Fee Table */}
            <Grid container sx={{ mt: '4vh', mb: '5vh', padding: 3 }}>
                <Grid container>
                    <Typography>Brokerage Fee : min 2% ~ max 20%</Typography>
                </Grid>
                <Grid container>
                    <Typography>단위 (천원)</Typography>
                </Grid>
                <TableContainer sx={{ height: '750px', width: '100%' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Brokerage Fee Table</TableCell>
                                {feePer.map((col) => (
                                    <TableCell key={col} align='center'>{col} %</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {feeList.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell align='right'>{row.toLocaleString('KO-KR')}</TableCell>
                                    {feePer.map((col, cIndex) => (
                                        <TableCell key={col.id} align='right' className={shouldColorCell(index, cIndex)}>{(row * col / 100).toLocaleString('KO-KR')}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

        </>
    );
}
