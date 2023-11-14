import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { API } from '../util.jsx';

export default function ArtworksGradePage({ loadDataUrl }) {
    // Img Data State
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');
    const vertical = 'bottom';
    const horizontal = 'center';
    const [orignData, setOrignData] = useState([]);
    const [form, setForm] = useState({ M: 0, M1: 0, M2: 0 })

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API}/${loadDataUrl}`)
            var tmp = res.data.sort((a, b) => a.id - b.id);
            setOrignData(tmp);
            setForm({
                M: tmp.filter((item) => item.grade === 'M')[0].point,
                M1: tmp.filter((item) => item.grade === 'M1')[0].point,
                M2: tmp.filter((item) => item.grade === 'M2')[0].point,
                M3: tmp.filter((item) => item.grade === 'M3')[0].point,
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    useEffect(() => { fetchData(); }, [])

    const handleForm = (event) => {
        const { name, value } = event.target;
        setForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setSnackbar(false);
    };

    // DB Save
    const saveBtn = () => {
        saveToDatabase();
    };
    const saveToDatabase = async () => {
        try {
            const promises = Object.entries(form).map(async ([grade, point]) => {
                const item = orignData.find(entry => entry.grade === grade);
                if (item) {
                    const updatedData = {
                        ...item,
                        point: parseInt(point)
                    };
                    // 서버에 PUT 요청을 보냅니다.
                    await axios.put(`${API}/${loadDataUrl}/${updatedData.id}`, updatedData);
                    // console.log(updatedData);
                }
            })
            // 모든 요청이 완료될 때까지 기다립니다.
            await Promise.all(promises);
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
            <Grid container sx={{ padding: 4 }}>
                <Grid container>
                    <Typography>
                        작품 등급 설정합니다.
                    </Typography>
                </Grid>
                <Grid container sx={{ mt: '3vh' }} >
                    <Grid item xs={2} container rowSpacing={2} >
                        <Grid item xs={11}>
                            <TextField label="M★" variant="standard" name="M" value={form.M} onChange={handleForm} />
                        </Grid>
                        <Grid item xs={11}>
                            <TextField label="M1" variant="standard" name="M1" value={form.M1} onChange={handleForm} />
                        </Grid>
                        <Grid item xs={11}>
                            <TextField label="M2" variant="standard" name="M2" value={form.M2} onChange={handleForm} />
                        </Grid>
                        <Grid item xs={11}>
                            <TextField label="M3" variant="standard" name="M3" value={form.M3} onChange={handleForm} />
                        </Grid>
                        <Grid item xs={11} textAlign='end'>
                            <Button onClick={saveBtn}>Save</Button>
                        </Grid>

                    </Grid>
                </Grid>


            </Grid>



        </>
    );
}
