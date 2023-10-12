import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material/styles';
import { Grid, Tab, Skeleton, Slider, Typography, TableContainer } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// import styledComponents from 'styled-components';
import axios from 'axios';
import { generateTheme } from './util.jsx';
import logo from '../assets/hijonam_logo.png'
import favicon from '../assets/favicon.ico'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';

export default function PhotosPage({ lang, setSubTitle }) {
    const [value, setValue] = useState('Exhibition');

    // Mobile State
    const isMobile = useMediaQuery('(max-width:600px)');
    const [photos, setPhotos] = useState({ exhibition: {}, studioUS: {}, studioKorea: {}, other: {} })
    const [selectedPhoto, setSelectedPhoto] = useState('Exhibition');

    const handleChange = (event, newValue) => {
        setValue(newValue);
        let subTitle;
        if (newValue === 'Other Moments') { subTitle = 'Other Moments' }
        else { subTitle = `${newValue} Photos` }
        setSubTitle(subTitle.toUpperCase());
    };
    const someProps = { fontFamily: null, fontSize: null }
    const theme = generateTheme(someProps);
    useEffect(() => {
        const subTitle = `${value} Photos`
        setSubTitle(subTitle.toUpperCase());
    }, [])

    const fetchData = async () => {
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
        if (isMobile) {
            fetchData();
            handlePhotoClick('Exhibition');
        }
    }, [])
    const photoCategories = [
        { key: 'Exhibition', subject: photos.exhibition.subject, folderName: photos.exhibition.folderName, fileName: photos.exhibition.fileName },
        { key: 'Studio US', subject: photos.studioUS.subject, folderName: photos.studioUS.folderName, fileName: photos.studioUS.fileName },
        { key: 'Studio Korea', subject: photos.studioKorea.subject, folderName: photos.studioKorea.folderName, fileName: photos.studioKorea.fileName },
        { key: 'Other Moments', subject: photos.other.subject, folderName: photos.other.folderName, fileName: photos.other.fileName },
    ];

    const handlePhotoClick = (photoKey) => {
        setSelectedPhoto(photoKey);
    }
    return (
        <>
            {isMobile ?
                <Grid container sx={{ marginTop: '-1.4vh', padding: 3 }}>
                    <Grid item container direction="column" alignItems='left'>
                        <Grid item container spacing={2}>
                            {photoCategories.map(photo => (
                                <Grid item xs={3} key={photo.key} onClick={() => handlePhotoClick(photo.key)}>
                                    <div style={{ position: 'relative', paddingBottom: '75%' }}>
                                        <img src={`/img/Photos/${photo.folderName}/${photo.fileName}`} style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }} />
                                    </div>
                                    <Typography align='center' sx={{ fontSize: '12px', fontFamily: 'Helvetica', marginTop: '0.3vh' }}>{photo.subject}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item container direction="column" alignItems='left' sx={{ mt: '4vh' }}>
                        <PhotosDetail value={selectedPhoto} lang={lang} />
                    </Grid>
                </Grid>
                :

                // NonMobile
                <Grid container sx={{ marginTop: '-1.4vh' }}>
                    <Grid item container direction="column" alignItems='left'>
                        <ThemeProvider theme={theme}>
                            <TabContext value={value} >
                                <Grid container direction="column" alignItems='center' >
                                    <TabList onChange={handleChange} aria-label="Tab List" >
                                        <Tab label="Exhibition Photos" value="Exhibition" />
                                        <Tab label="Studio US Photos" value="Studio US" />
                                        <Tab label="Studio KOREA Photos" value="Studio Korea" />
                                        <Tab label="Other Moments" value="Other Moments" />
                                    </TabList>
                                </Grid>
                                <TabPanel value="Exhibition">
                                    <PhotosDetail value={value} lang={lang} />
                                </TabPanel>
                                <TabPanel value="Studio US">
                                    <PhotosDetail value={value} lang={lang} />
                                </TabPanel>
                                <TabPanel value="Studio Korea">
                                    <PhotosDetail value={value} lang={lang} />
                                </TabPanel>
                                <TabPanel value="Other Moments">
                                    <PhotosDetail value={value} lang={lang} />
                                </TabPanel>
                            </TabContext>
                        </ThemeProvider>
                    </Grid>
                </Grid>
            }
        </>
    );
}

const PhotosDetail = ({ lang, value }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const isLgTablet = useMediaQuery('(max-width:1366px)');
    const [originData, setOriginData] = useState([]);
    const [data, setData] = useState([]);
    const [selectedImg, setSelectedImg] = useState([]);
    const [minYear, setMinYear] = useState(null);
    const [maxYear, setMaxYear] = useState(null);
    const [yearValue, setYearValue] = useState([0, 0]);
    const fetchData = async () => {
        const res = await axios.get(`http://hijonam.com/img/photos`)
        let tmp = res.data.filter(item => item.subject === value)
        // 임의의 갯수 추가
        // while (tmp.length < 20) {
        //     tmp = tmp.concat(tmp.slice(0, 20 - tmp.length));
        // }
        const filterData = tmp.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
        const years = filterData.map(item => item.year);
        const maxYear = Math.max(...years);
        const minYear = Math.min(...years);
        setYearValue([minYear, maxYear]);
        setMinYear(minYear);
        setMaxYear(maxYear);
        setOriginData(filterData);

        setData(filterData);
        setSelectedImg(filterData[0])
    }
    const handleSelectedImg = (item) => { setSelectedImg(item); }
    const handleChange2 = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        const minDistance = 0.1;
        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 1 - minDistance);
                setYearValue([clamped, clamped + minDistance]);
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                setYearValue([clamped - minDistance, clamped]);
            }
        } else {
            setYearValue(newValue);
        }
        const filteredData = originData.filter(item => item.year >= newValue[0] && item.year <= newValue[1]);
        setData(filteredData);
    };
    useEffect(() => {
        fetchData();
    }, [value])
    // Swiper 스크롤 방지
    const handleSwiperStart = () => {
        document.body.style.overflow = 'hidden';  // 스크롤 방지
    };

    const handleSwiperEnd = () => {
        document.body.style.overflow = 'auto';  // 스크롤 허용
    };
    return (
        <>
            {isMobile ? (
                <Grid container>
                    {/* Photos */}
                    <Grid container>
                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>{data.length} Photos</Typography>
                    </Grid>
                    {/* 서브메뉴에 선택된 사진 리스트 */}
                    <Grid container sx={{ mt: '1vh' }}>
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={10}
                            // loop={true}
                            freeMode={true}
                            // momentumRatio={50}
                            momentumVelocityRatio={0.03}
                            allowTouchMove={true}
                            touchEventsTarget="container"
                            preventClicks={true}
                            touchStartPreventDefault={false}
                            touchMoveStopPropagation={true}
                            direction="horizontal"
                            grabCursor={true}
                            pagination={{
                                clickable: true,
                                type: 'fraction',
                            }}
                            modules={[FreeMode, Pagination]}
                            // className="mySwiper"
                            style={{ height: '145px' }}
                            on={{
                                touchStart: handleSwiperStart,
                                touchEnd: handleSwiperEnd,
                            }}
                        >
                            {data.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <Grid item container direction="column" alignItems="center" style={{ textAlign: 'center' }} className="mx-auto" onClick={() => handleSelectedImg(item)}>
                                        <Grid item direction="column" alignItems="center" style={{ width: '100%' }}>
                                            {/* <img src={`/img/Photos/${item.folderName}/${item.fileName[0].split('.').slice(0, -1).join('.')}-thumbnail.webp`} */}
                                            <img src={`/img/Photos/${item.folderName}/${item.fileName[0]}`}
                                                className={`rounded-3 mx-auto`}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: '1 / 1',
                                                    // height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div className="swiper-lazy-preloader"></div>
                                        </Grid>
                                    </Grid>
                                </SwiperSlide>

                            ))}
                        </Swiper>

                    </Grid>

                    {/* 선택된 사진 */}
                    <Grid container sx={{ mt: '3vh' }}>
                        <Grid item xs={12}>
                            {selectedImg ?
                                <img src={`/img/Photos/${selectedImg.folderName}/${selectedImg.fileName}`} style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    // height: '70%',
                                    // objectFit: 'cover'
                                }} /> :
                                <Skeleton variant="rectangular" />
                            }
                        </Grid>
                    </Grid>

                    {/* 선택된 사진 정보 */}
                    <Grid container sx={{ mt: '4vh' }}>
                        {selectedImg ?
                            <Grid container rowSpacing={2} >
                                <Grid item xs={12} textAlign='start'>
                                    {selectedImg.memo || selectedImg.memo_kr ?
                                        <>
                                            {lang === 'En' ?
                                                <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                                    {selectedImg.memo}
                                                </Typography>
                                                :
                                                <Typography sx={{ fontFamily: 'Bitgoeul_Medium', fontSize: '13px' }}>
                                                    {selectedImg.memo_kr}
                                                </Typography>
                                            }

                                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px', textAlign: 'start', mt: '12px' }}>
                                                {selectedImg.year ? `${selectedImg.year},` : ''} {selectedImg.month && selectedImg.month > 0 ? `${selectedImg.month},` : ''} {selectedImg.title ? selectedImg.title : ''}
                                            </Typography>
                                        </>
                                        :
                                        <Typography sx={{ fontFamily: 'Helvetica', textAlign: 'start', fontSize: '13px' }}>
                                            {selectedImg.year ? `${selectedImg.year},` : ''} {selectedImg.month && selectedImg.month > 0 ? `${selectedImg.month},` : ''} {selectedImg.title ? selectedImg.title : ''}
                                        </Typography>
                                    }
                                </Grid>
                            </Grid>
                            : <Skeleton variant="rectangular" />
                        }
                    </Grid>
                </Grid>
            ) : (
                // NonMobile
                <Grid container spacing={1} sx={{ width: '100%' }} >
                    <Grid item xs={8.3} sx={{ mt: isLgTablet ? '87px' : '74px' }}>
                        {isLgTablet ?
                            <Grid container spacing={5} sx={{ height: '100%' }}>
                                <Grid item xs={0.61}></Grid>
                                <Grid item xs={3.5} sx={{ paddingLeft: 1 }} >
                                    {/* Logo */}
                                    <Grid container>
                                        <img src={logo} style={{ width: isLgTablet ? "7vw" : "5vw", marginBottom: isLgTablet ? '5px' : '1.5vh', marginLeft: '-0.3vw' }} />
                                    </Grid>

                                    {/* Subtitle */}
                                    <Grid container sx={{ borderBottom: '1px solid gray' }}>
                                        <Grid item xs={12} textAlign='start'>
                                            <Typography sx={{ fontFamily: 'Hevetica', fontWeight: 600, fontSize: '22.4px' }}>
                                                <img src={favicon} style={{ width: '21px', padding: 1, marginTop: '-4px', marginRight: '10px' }} />
                                                {value.toUpperCase()}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {/* Content */}
                                    <Grid container sx={{ marginTop: '1.5vh' }}>
                                        {selectedImg ?
                                            <Grid container rowSpacing={2} >
                                                <Grid item xs={12} textAlign='start'>
                                                    {selectedImg.memo || selectedImg.memo_kr ?
                                                        <>
                                                            {lang === 'En' ?
                                                                <Typography align='justify' sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                                                    {selectedImg.memo}
                                                                </Typography>
                                                                :
                                                                <Typography sx={{ fontFamily: 'Bitgoeul_Medium', fontSize: '13px' }}>
                                                                    {selectedImg.memo_kr}
                                                                </Typography>
                                                            }

                                                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px', textAlign: 'start', mt: '12px' }}>
                                                                {selectedImg.year ? `${selectedImg.year},` : ''} {selectedImg.month ? `${selectedImg.month},` : ''} {selectedImg.title ? selectedImg.title : ''}
                                                            </Typography>
                                                        </>
                                                        :
                                                        <Typography sx={{ fontFamily: 'Helvetica', textAlign: 'start', fontSize: '13px' }}>
                                                            {selectedImg.year ? `${selectedImg.year},` : ''} {selectedImg.month ? `${selectedImg.month},` : ''} {selectedImg.title ? selectedImg.title : ''}
                                                        </Typography>
                                                    }
                                                </Grid>
                                            </Grid>
                                            : <Skeleton variant="rectangular" />
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={7.89}>
                                    {selectedImg ?
                                        <img src={`/img/Photos/${selectedImg.folderName}/${selectedImg.fileName}`} style={{
                                            width: '92%',
                                            maxWidth: '43vw',
                                            textAlign: 'center',
                                            // height: '70%',
                                            // objectFit: 'cover'
                                        }} /> :
                                        <Skeleton variant="rectangular" />
                                    }
                                </Grid>
                            </Grid>
                            :
                            <Grid container spacing={5} sx={{ height: '100%' }}>
                                <Grid item xs={0.61}></Grid>
                                <Grid item xs={3} sx={{ paddingLeft: 1 }} >
                                    {/* Logo */}
                                    <Grid container>
                                        <img src={logo} style={{ width: "5vw", marginBottom: '1.5vh', marginLeft: '-0.3vw' }} />
                                    </Grid>

                                    {/* Subtitle */}
                                    <Grid container sx={{ borderBottom: '1px solid gray' }}>
                                        <Grid item xs={12} textAlign='start'>
                                            <Typography sx={{ fontFamily: 'Hevetica', fontWeight: 600, fontSize: '22.4px' }}>
                                                <img src={favicon} style={{ width: '21px', padding: 1, marginTop: '-4px', marginRight: '10px' }} />
                                                {value.toUpperCase()}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {/* Content */}
                                    <Grid container sx={{ marginTop: '1.5vh' }}>
                                        {selectedImg ?
                                            <Grid container rowSpacing={2} >
                                                <Grid item xs={12} textAlign='start'>
                                                    {selectedImg.memo || selectedImg.memo_kr ?
                                                        <>
                                                            {lang === 'En' ?
                                                                <Typography align='justify' sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                                                    {selectedImg.memo}
                                                                </Typography>
                                                                :
                                                                <Typography sx={{ fontFamily: 'Bitgoeul_Medium', fontSize: '13px' }}>
                                                                    {selectedImg.memo_kr}
                                                                </Typography>
                                                            }

                                                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px', textAlign: 'start', mt: '12px' }}>
                                                                {selectedImg.year ? `${selectedImg.year},` : ''} {selectedImg.month ? `${selectedImg.month},` : ''} {selectedImg.title ? selectedImg.title : ''}
                                                            </Typography>
                                                        </>
                                                        :
                                                        <Typography sx={{ fontFamily: 'Helvetica', textAlign: 'start', fontSize: '13px' }}>
                                                            {selectedImg.year ? `${selectedImg.year},` : ''} {selectedImg.month ? `${selectedImg.month},` : ''} {selectedImg.title ? selectedImg.title : ''}
                                                        </Typography>
                                                    }
                                                </Grid>
                                            </Grid>
                                            : <Skeleton variant="rectangular" />
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={8.39}>
                                    {selectedImg ?
                                        <img src={`/img/Photos/${selectedImg.folderName}/${selectedImg.fileName}`} style={{
                                            width: '92%',
                                            maxWidth: '43vw',
                                            textAlign: 'center',
                                            // height: '70%',
                                            // objectFit: 'cover'
                                        }} /> :
                                        <Skeleton variant="rectangular" />
                                    }
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                    <Grid item xs={3.35}>
                        <Grid container>
                            <Grid item xs={12} container>
                                <Grid item xs={2} textAlign='start'>
                                    <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>{yearValue[0]}</Typography>
                                </Grid>
                                <Grid item xs={8}></Grid>
                                <Grid item xs={2} textAlign='end'>
                                    <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>{yearValue[1]}</Typography>
                                </Grid>
                                {/* <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>{} - {}</Typography> */}
                            </Grid>
                            <Grid item xs={12} sx={{ paddingLeft: 2, paddingRight: 2, paddingTop: 0.8 }}>
                                <Slider
                                    getAriaLabel={() => 'Minimum distance shift'}
                                    value={yearValue}
                                    onChange={handleChange2}
                                    valueLabelDisplay="auto"
                                    disableSwap
                                    min={minYear}
                                    max={maxYear}
                                />
                            </Grid>
                        </Grid>
                        <TableContainer sx={{ height: '50vh' }}>
                            <Grid container sx={{ mt: '10px' }}>
                                {
                                    data.map((item) => (
                                        <Grid item xs={3} onClick={() => handleSelectedImg(item)} key={item.id}>
                                            <img src={`/img/Photos/${item.folderName}/${item.fileName}`}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: '1 / 1',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </TableContainer>
                    </Grid>
                </Grid>
            )}
        </>
    )
}
