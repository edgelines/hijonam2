import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import logo from '../assets/hijonam_logo.png'
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

export default function HomePage() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [imgData, setImgData] = useState([]);
    const [exhibition, setExhibition] = useState([])
    const [photos, setPhotos] = useState({ exhibition: {}, studioUS: {}, studioKorea: {}, other: {} })
    const [worldTime, setWorldTime] = useState({ seoul: new Date(), newYork: new Date() })

    const fetchData = async () => {
        await axios.get('http://hijonam.com/img/home').then((response) => {
            var tmp = [];
            response.data.forEach((value) => { tmp.push(value.fileName) });
            setImgData(tmp);
            // tableData.value = tmp;
        }).catch((error) => {
            console.error("Error fetching artworks:", error);
        });
        await axios.get(`http://hijonam.com/img/upcomingExhibition`).then((response) => {
            const dateFields = ['startDate', 'endDate'];
            let res = response.data.map(item => {
                dateFields.forEach(field => {
                    const date = new Date(item[field]);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    item[field] = `${year}-${month}-${day}`;
                });
                return item;
            });

            var present = res.filter(item => item.state == 1)
            var upcoming = res.filter(item => item.state == 0)

            // 마지막값의 id값을 가져옴.
            let lastId = (res.length > 0 && res[res.length - 1].id) ? res[res.length - 1].id : 0;

            const addEmptyItem = () => {
                lastId += 1;
                return { id: lastId, soloGroup: '', title: '' };
            };
            // exhibition 결과 저장.
            const result = [];
            if (present.length === 0) {
                result.push(addEmptyItem())
            } else {
                result.push(present[0])
            }

            if (result.length === 0) {
                if (upcoming.length === 0) {
                    result.push(addEmptyItem());
                    result.push(addEmptyItem());
                } else if (upcoming.length === 1) {
                    result.push(upcoming[0]);
                    result.push(addEmptyItem());
                } else {
                    result.push(upcoming.slice(0, 2));
                }
            }
            if (result.length === 1) {
                if (upcoming.length === 0) {
                    result.push(addEmptyItem());
                } else {
                    result.push(upcoming[0]);
                }
            }
            setExhibition(result);
        }).catch((error) => {
            console.error("Error fetching upcomingExhibition:", error);
        });
        await axios.get(`http://hijonam.com/img/photos`).then((res) => {

            var exhibition = res.data.filter(item => item.subject === 'Exhibition')
            var studioUS = res.data.filter(item => item.subject === 'Studio US')
            var studioKorea = res.data.filter(item => item.subject === 'Studio Korea')
            var other = res.data.filter(item => item.subject === 'Other Moments')

            exhibition = exhibition.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate)).slice(-1)[0]
            studioUS = studioUS.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate)).slice(-1)[0]
            studioKorea = studioKorea.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate)).slice(-1)[0]
            other = other.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate)).slice(-1)[0]
            setPhotos({ exhibition: exhibition, studioUS: studioUS, studioKorea: studioKorea, other: other })
        }).catch((error) => {
            console.error("Error fetching upcomingExhibition:", error);
        });
    }

    useEffect(() => {
        fetchData()
        const updateTime = () => {
            // 현재 로케일의 UTC 시간을 계산합니다.
            const curr = new Date();
            const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);

            // 3. UTC to KST (UTC + 9시간)
            const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
            const kr_curr = new Date(utc + (KR_TIME_DIFF));
            // setSeoulTime(kr_curr);


            // 뉴욕 시간은 UTC -4 (일광 절약 시간을 고려하려면 -5로 설정하세요.)
            const NY_TIME_DIFF = -4 * 60 * 60 * 1000;
            const NY_curr = new Date(utc + (NY_TIME_DIFF));
            // setNewYorkTime(NY_curr);

            setWorldTime({ seoul: kr_curr, newYork: NY_curr })
        };

        updateTime();
        const interval = setInterval(updateTime, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {isMobile ? (
                <Grid container sx={{ padding: 3 }} >
                    <Grid container>
                        <Grid item xs={3} container direction="column" alignItems="center">
                            <Clock
                                value={worldTime.newYork}
                                hourHandLength={53}
                                hourHandOppositeLength={17}
                                hourHandWidth={5.3}
                                hourMarksLength={10}
                                hourMarksWidth={3}
                                minuteHandLength={80}
                                minuteHandOppositeLength={17}
                                minuteHandWidth={3.3}
                                minuteMarksLength={4.7}
                                minuteMarksWidth={2}
                                secondHandLength={75}
                                secondHandOppositeLength={17}
                                secondHandWidth={2}
                                size={80}
                            />
                        </Grid>
                        <Grid item xs={2.8} container direction="column" justifyContent="flex-end" textAlign='end'>
                            NEW YORK
                            <div>{worldTime.newYork.toLocaleTimeString("en-US")}</div>
                            <div>{worldTime.newYork.toLocaleDateString()}</div>
                        </Grid>
                        <Grid item xs={0.4}></Grid>
                        <Grid item xs={2.8} container direction="column" alignItems="center">
                            <Clock value={worldTime.seoul}
                                hourHandLength={53}
                                hourHandOppositeLength={17}
                                hourHandWidth={5.3}
                                hourMarksLength={10}
                                hourMarksWidth={3}
                                minuteHandLength={80}
                                minuteHandOppositeLength={17}
                                minuteHandWidth={3.3}
                                minuteMarksLength={4.7}
                                minuteMarksWidth={2}
                                secondHandLength={75}
                                secondHandOppositeLength={17}
                                secondHandWidth={2}
                                size={80}
                            />
                        </Grid>
                        <Grid item xs={3} container direction="column" justifyContent="flex-end" textAlign='end'>
                            SEOUL
                            <div>{worldTime.seoul.toLocaleTimeString("en-US")}</div>
                            <div>{worldTime.seoul.toLocaleDateString()}</div>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} textAlign='start' sx={{ mt: '1vh' }} >
                            <Grid container>
                                <Grid item xs={10} sx={{ borderBottom: '1px solid black' }}>
                                    Exhibition
                                </Grid>
                                <Grid item xs={2} textAlign='end' sx={{ borderBottom: '1px solid black' }}>
                                    <Link to={`/exhibition/upcoming/`} style={{ color: 'black', textDecoration: 'none' }}>
                                        See All
                                    </Link>
                                </Grid>
                                {
                                    exhibition.map((item, index) => (
                                        <Grid container className="border-bottom" key={item.id} sx={{ height: '7vh' }} >
                                            <Grid item xs={8} sx={{ alignSelf: 'center' }} >
                                                <tr>
                                                    <td>{item.soloGroup === 0 ? 'Solo Exhibition' : item.soloGroup === 1 ?
                                                        'Group Exhibition' : !item.soloGroup ? '' : ''}</td>
                                                </tr>
                                                <tr>
                                                    <td>{item.title ? item.title : ''}</td>
                                                </tr>
                                            </Grid>
                                            <Grid item xs={4} textAlign='end' sx={{ alignSelf: 'center' }} >
                                                <span> {item.startDate ? `${item.startDate} ~ ${item.endDate}` : ''} </span>
                                            </Grid>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Grid>

                        <Grid item xs={12} textAlign='start' sx={{ mt: '1vh' }}>
                            <Grid container>
                                <Grid item xs={10} sx={{ borderBottom: '1px solid black' }}>
                                    Recent Photos Upload
                                </Grid>
                                <Grid item xs={2} textAlign='end' sx={{ borderBottom: '1px solid black' }}>
                                    <Link to={`/bio/photos`} style={{ color: 'black', textDecoration: 'none' }}>
                                        See All
                                    </Link>
                                </Grid>
                                <Grid item xs={12} sx={{ marginTop: '1vh' }} >
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}>
                                            <div style={{ position: 'relative', paddingBottom: '75%' }}>
                                                {photos.exhibition && photos.exhibition.fileName &&
                                                    <img src={`/img/Photos/${photos.exhibition.folderName}/${photos.exhibition.fileName[0]}`}
                                                        // <img src={`/img/Photos/${photos.exhibition.folderName}/${photos.exhibition.fileName[0].split('.').slice(0, -1).join('.')}-thumbnail.webp`}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                }

                                            </div>
                                            <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photos.exhibition.title}</p>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div style={{ position: 'relative', paddingBottom: '75%' }} >
                                                {photos.studioUS && photos.studioUS.fileName &&
                                                    <img src={`/img/Photos/${photos.studioUS.folderName}/${photos.studioUS.fileName[0]}`} style={{
                                                        // <img src={`/img/Photos/${photos.studioUS.folderName}/${photos.studioUS.fileName[0].split('.').slice(0, -1).join('.')}-thumbnail.webp`} style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }} />
                                                }
                                            </div>
                                            <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photos.studioUS.title}</p>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div style={{ position: 'relative', paddingBottom: '75%' }} >
                                                {photos.studioKorea && photos.studioKorea.fileName &&
                                                    <img src={`/img/Photos/${photos.studioKorea.folderName}/${photos.studioKorea.fileName[0]}`} style={{
                                                        // <img src={`/img/Photos/${photos.studioKorea.folderName}/${photos.studioKorea.fileName[0].split('.').slice(0, -1).join('.')}-thumbnail.webp`} style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }} />
                                                }
                                            </div>
                                            <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photos.studioKorea.title}</p>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div style={{ position: 'relative', paddingBottom: '75%' }} >
                                                {photos.other && photos.other.fileName &&
                                                    <img src={`/img/Photos/${photos.other.folderName}/${photos.other.fileName[0]}`} style={{
                                                        // <img src={`/img/Photos/${photos.other.folderName}/${photos.other.fileName[0].split('.').slice(0, -1).join('.')}-thumbnail.webp`} style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }} />
                                                }
                                            </div>
                                            <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photos.other.title}</p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            ) : (
                <Grid container>
                    <Grid item xs={5} sx={{ paddingLeft: 8, paddingRight: 8 }} >
                        <Grid container rowSpacing={3} sx={{ mt: '-3vh' }} >
                            <Grid item xs={12} textAlign='start'>
                                <img src={logo} style={{ width: "25vw" }} />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: '1vh' }} >
                                <Grid container >
                                    <Grid item xs={3} container direction="column" alignItems="center">
                                        <Clock
                                            value={worldTime.newYork}
                                            hourHandLength={53}
                                            hourHandOppositeLength={17}
                                            hourHandWidth={5.3}
                                            hourMarksLength={10}
                                            hourMarksWidth={3}
                                            minuteHandLength={80}
                                            minuteHandOppositeLength={17}
                                            minuteHandWidth={3.3}
                                            minuteMarksLength={4.7}
                                            minuteMarksWidth={2}
                                            secondHandLength={75}
                                            secondHandOppositeLength={17}
                                            secondHandWidth={2}
                                            size={135}
                                        />
                                    </Grid>
                                    <Grid item xs={3} container direction="column" justifyContent="flex-end" textAlign='start'>
                                        NEW YORK
                                        <div>{worldTime.newYork.toLocaleTimeString("en-US")}</div>
                                        <div>{worldTime.newYork.toLocaleDateString()}</div>
                                    </Grid>
                                    <Grid item xs={3} container direction="column" alignItems="center">
                                        <Clock value={worldTime.seoul}
                                            hourHandLength={53}
                                            hourHandOppositeLength={17}
                                            hourHandWidth={5.3}
                                            hourMarksLength={10}
                                            hourMarksWidth={3}
                                            minuteHandLength={80}
                                            minuteHandOppositeLength={17}
                                            minuteHandWidth={3.3}
                                            minuteMarksLength={4.7}
                                            minuteMarksWidth={2}
                                            secondHandLength={75}
                                            secondHandOppositeLength={17}
                                            secondHandWidth={2}
                                            size={135}
                                        />
                                    </Grid>
                                    <Grid item xs={3} container direction="column" justifyContent="flex-end" textAlign='start'>
                                        SEOUL
                                        <div>{worldTime.seoul.toLocaleTimeString("en-US")}</div>
                                        <div>{worldTime.seoul.toLocaleDateString()}</div>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} textAlign='start' sx={{ mt: '1vh' }} >
                                <Grid container>
                                    <Grid item xs={10} sx={{ borderBottom: '1px solid black' }}>
                                        Exhibition
                                    </Grid>
                                    <Grid item xs={2} textAlign='end' sx={{ borderBottom: '1px solid black' }}>
                                        <Link to={`/exhibition/upcoming/`} style={{ color: 'black', textDecoration: 'none' }}>
                                            See All
                                        </Link>
                                    </Grid>
                                    {
                                        exhibition.map((item, index) => (
                                            <Grid container className="border-bottom" key={item.id} sx={{ height: '7vh' }} >
                                                <Grid item xs={8} sx={{ alignSelf: 'center' }} >
                                                    <tr>
                                                        <td>{item.soloGroup === 0 ? 'Solo Exhibition' : item.soloGroup === 1 ?
                                                            'Group Exhibition' : ''}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{item.title ? item.title : ''}</td>
                                                    </tr>
                                                </Grid>
                                                <Grid item xs={4} textAlign='end' sx={{ alignSelf: 'center' }} >
                                                    <span> {item.startDate ? `${item.startDate} ~ ${item.endDate}` : ''} </span>
                                                </Grid>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </Grid>

                            <Grid item xs={12} textAlign='start' sx={{ mt: '1vh' }}>
                                <Grid container>
                                    <Grid item xs={10} sx={{ borderBottom: '1px solid black' }}>
                                        Recent Photos Upload
                                    </Grid>
                                    <Grid item xs={2} textAlign='end' sx={{ borderBottom: '1px solid black' }}>
                                        <Link to={`/bio/photos`} style={{ color: 'black', textDecoration: 'none' }}>
                                            See All
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12} sx={{ marginTop: '1vh' }} >
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <div style={{ position: 'relative', paddingBottom: '75%' }}>
                                                    <img src={`/img/Photos/${photos.exhibition.folderName}/${photos.exhibition.fileName}`}
                                                        // style={{ height: '15vh', objectFit: 'cover' }} 
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />

                                                </div>
                                                <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photos.exhibition.title}</p>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <div style={{ position: 'relative', paddingBottom: '75%' }} >
                                                    <img src={`/img/Photos/${photos.studioUS.folderName}/${photos.studioUS.fileName}`} style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }} />
                                                </div>
                                                <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photos.studioUS.title}</p>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <div style={{ position: 'relative', paddingBottom: '75%' }} >
                                                    <img src={`/img/Photos/${photos.studioKorea.folderName}/${photos.studioKorea.fileName}`} style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }} />
                                                </div>
                                                <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photos.studioKorea.title}</p>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <div style={{ position: 'relative', paddingBottom: '75%' }} >
                                                    <img src={`/img/Photos/${photos.other.folderName}/${photos.other.fileName}`} style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }} />
                                                </div>
                                                <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photos.other.title}</p>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* 오른쪽 큰 사진 */}
                    <Grid item xs={7} sx={{ height: '95vh' }}>
                        <img src={`/img/Main/${imgData[0]}`} style={{
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }} />
                        {imgData[0]}
                    </Grid>
                </Grid>
            )}
        </>

    );
}
