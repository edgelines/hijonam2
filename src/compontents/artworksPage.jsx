import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Container, Grid, Chip, Divider, Box, Tab, Switch, Stack, Typography, Paper, Slider, Skeleton } from '@mui/material';
import styledComponents from 'styled-components';
import axios from 'axios';
import DoneIcon from '@mui/icons-material/Done';
import { AntSwitch, generateTheme, MarginPictures } from './util.jsx';

// import SimpleSlider from './slickCarousel';
import styledCSS from './artworksPage.module.css';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';

export default function ArtworksPage() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [originData, setOrignData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [selectedDataFiltered, setSelectedDataFiltered] = useState([]) // 장르선택시 Work Year Filter State
    const [selectedImg, setSelectedImg] = useState([]);
    const [genres, setGenres] = useState([]);

    const [minYear, setMinYear] = useState(null);
    const [maxYear, setMaxYear] = useState(null);
    const [yearValue, setYearValue] = useState([0, 0]);
    const [imgSize, setImgSize] = useState(60);

    const someProps = { fontFamily: null, fontSize: null }
    const theme = generateTheme(someProps);
    const fetchData = async () => {
        try {
            const res1 = await axios.get(`http://hijonam.com/img/genres`)
            setGenres(res1.data);

            const res2 = await axios.get(`http://hijonam.com/img/artworks`);
            setOrignData(res2.data.filter(item => item.showArtworks == 0));

        } catch (error) {
            console.error("Error fetching artworks:", error);
        }
    }

    // Genres Click Img Handler
    const handleSelectedGenres = (item) => {
        const selectedGenre = originData.filter(row => row.genres === item)
        const years = selectedGenre.map(item => item.executed);
        const maxYear = Math.max(...years);
        const minYear = Math.min(...years);
        setYearValue([minYear, maxYear]);
        setMinYear(minYear);
        setMaxYear(maxYear);

        // 장르 선택시 state
        setSelectedData(selectedGenre);
        setSelectedDataFiltered(selectedGenre);
        // 장르변경시 첫번째 이미지 강제 선택
        handleSeletedImg(selectedData[0]);
        // return item; 
    }
    // Work Year Handler
    const handleYearChange = (event, newValue, activeThumb) => {
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
        // 동작시 SelectedImg 
        const filteredData = selectedData.filter(item => item.executed >= newValue[0] && item.executed <= newValue[1]);
        setSelectedDataFiltered(filteredData);
    };
    // SelectedDataFiltered Click Img Handler
    const handleSeletedImg = (item) => { setSelectedImg(item); };
    // Img Size Handler
    const handleImgSize = (event, num) => { setImgSize(num); }
    // Sub Img Click Handler ( 작품에 여러 이미지가 있을 경우 Img 클릭하면 중앙 메인 이미지가 바뀜 )
    const handleImgChange = (item) => {
        const otherImages = selectedImg.fileName.filter((fileName) => fileName !== item);
        setSelectedImg({ ...selectedImg, fileName: [item, ...otherImages] });
    };

    useEffect(() => {
        fetchData();
    }, [])
    useEffect(() => {
        if (originData.length > 0) {
            handleSelectedGenres(genres[1].genres);
            handleSeletedImg(selectedData[0]);
        }
    }, [originData]);
    useEffect(() => {
        if (originData.length > 0) {
            handleSeletedImg(selectedData[0]);
        }
    }, [selectedData])

    // Swiper 스크롤 방지
    const handleSwiperStart = () => {
        document.body.style.overflow = 'hidden';  // 스크롤 방지
    };

    const handleSwiperEnd = () => {
        document.body.style.overflow = 'auto';  // 스크롤 허용
    };
    return (
        <>
            <MarginPictures title='ARTWORKS' />
            {isMobile ? (
                <Grid container sx={{ padding: 3 }}>
                    {/* Genre */}
                    <Grid container sx={{ mt: '4vh' }}>
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={10}
                            loop={true}
                            freeMode={true}
                            allowTouchMove={true}
                            touchEventsTarget="container"
                            preventClicks={true}
                            touchStartPreventDefault={false}
                            touchMoveStopPropagation={true}
                            direction="horizontal"
                            grabCursor={true}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[FreeMode, Pagination]}
                            className={`${styledCSS.mySwiper}`}
                            style={{ height: '160px' }}
                            on={{
                                touchStart: handleSwiperStart,
                                touchEnd: handleSwiperEnd,
                            }}
                        >
                            {genres.map((item) => (
                                <SwiperSlide>
                                    <Grid item container direction="column" alignItems="center" style={{ textAlign: 'center' }} className="mx-auto" key={item.id} onClick={() => handleSelectedGenres(item.genres)}>
                                        <Grid item direction="column" alignItems="center" style={{ width: '100%' }}>
                                            <img src={`/img/artworks/${item.fileName}`} style={{ width: '100%', objectFit: 'cover', aspectRatio: '1/1', }} loading="lazy"
                                                className='rounded-3 mx-auto' />
                                            <div class="swiper-lazy-preloader"></div>
                                        </Grid>
                                        <Grid item direction="column" alignItems="center" style={{ width: '100%' }}>
                                            <Typography align="center" sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                                {item.genres}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </SwiperSlide>

                            ))}
                        </Swiper>
                    </Grid>

                    {/* 선택된 장르의 모든 이미지 */}
                    <Grid container>
                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                            {selectedDataFiltered.length} works
                        </Typography>

                        {selectedDataFiltered.length > 3 ?
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={10}
                                loop={true}
                                freeMode={true}
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
                                className={`${styledCSS.mySwiper}`}
                                // className="mySwiper"
                                style={{ height: '145px' }}
                                on={{
                                    touchStart: handleSwiperStart,
                                    touchEnd: handleSwiperEnd,
                                }}
                            >
                                {selectedDataFiltered ? selectedDataFiltered.map((item) => (
                                    <SwiperSlide>
                                        <Grid item container direction="column" alignItems="center" key={item.id} onClick={() => handleSeletedImg(item)} sx={{ mb: 1 }}>
                                            <Grid item direction="column" alignItems="center" style={{ width: '100%' }}>
                                                <img src={`/img/Artworks/${item.fileName[0].split('.').slice(0, -1).join('.')}-thumbnail.webp`}
                                                    className={`rounded-3 mx-auto`} loading="lazy"
                                                    style={{
                                                        width: '100%',
                                                        aspectRatio: '1 / 1',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <div class="swiper-lazy-preloader"></div>
                                            </Grid>
                                        </Grid>
                                    </SwiperSlide>
                                )) : <Skeleton variant="rectangular" />}
                            </Swiper>
                            :
                            <>
                                {selectedDataFiltered ? selectedDataFiltered.map((item) => (
                                    <Grid item container direction="column" alignItems="center" key={item.id} onClick={() => handleSeletedImg(item)} sx={{ mb: 1 }}>
                                        <Grid item direction="column" alignItems="center" style={{ width: '14vh', height: '14vh' }}>
                                            {/* <img src={`/img/Artworks/${item.fileName[0].split('.').slice(0, -1).join('.')}-thumbnail.webp`} */}
                                            <img src={`/img/Artworks/${item.fileName[0]}`}
                                                className={`rounded-3 mx-auto`}
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: '1 / 1',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                )) : <Skeleton variant="rectangular" />}
                            </>
                        }

                    </Grid>

                    {/* Show */}
                    <Grid container sx={{ mt: '1.5vh' }}>
                        {
                            selectedImg && selectedImg.fileName ?
                                <img src={`/img/Artworks/${selectedImg.fileName[0]}`} loading="lazy" style={{ width: `100%` }} />
                                : <Skeleton variant="rectangular" />
                        }
                    </Grid>

                    {/* 이미지 상세 정보 */}
                    <Grid container sx={{ mt: '1.5vh', mb: '2vh' }}>
                        <Grid item xs={12} container>
                            {selectedImg && selectedImg.title ?
                                <>
                                    <Grid container direction="column" alignItems="start">
                                        <h5 style={{ fontFamily: 'Helvetica', fontWeight: 700 }}>{selectedImg.title}</h5>
                                    </Grid>
                                    <Grid container direction="column" alignItems="start">
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                            {selectedImg.material}
                                        </Typography>
                                    </Grid>
                                    <Grid container direction="column" alignItems="start">
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                            Height : {parseInt(selectedImg.sizeH * 0.393701)} in / {selectedImg.sizeH}cm
                                        </Typography>
                                    </Grid>
                                    <Grid container direction="column" alignItems="start">
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                            Width : {parseInt(selectedImg.sizeW * 0.393701)} in / {selectedImg.sizeW}cm
                                        </Typography>
                                    </Grid>
                                    <Grid container direction="column" alignItems="start">
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                            Executed {selectedImg.executed}
                                        </Typography>
                                    </Grid>
                                </>
                                : <Skeleton variant="rectangular" />
                            }
                            {selectedImg && selectedImg.fileName && selectedImg.fileName.length > 1 ?
                                selectedImg.fileName.map((item) => (
                                    <Grid container direction="column" key={item} sx={{ mb: 1 }} onClick={() => handleImgChange(item)}>
                                        <img src={`/img/Artworks/${item}`} loading="lazy"
                                            className='thumbnail thumbnail-img'
                                            style={{
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Grid>
                                )) : <></>
                            }
                        </Grid>
                    </Grid>

                    <div id="footer" className="border-top p-3 footerfont">
                        <div className="mx-auto text-start">
                            {footerTitle}
                        </div>
                    </div>
                </Grid>
            ) : (
                <>
                    <Grid container sx={{ mt: '4vh' }}>
                        {genres.map((item) => (
                            <Grid item xs={1} container direction="column" alignItems="center" style={{ textAlign: 'center' }} className="mx-auto" key={item.id} onClick={() => handleSelectedGenres(item.genres)}>
                                <Grid item direction="column" alignItems="center" style={{ width: '100%' }}>
                                    <img src={`/img/artworks/${item.fileName}`} style={{ width: '8vw', objectFit: 'cover', aspectRatio: '1/1', }} className='rounded-3 mx-auto' />
                                </Grid>
                                <Grid item direction="column" alignItems="center" style={{ width: '100%' }}>
                                    <Typography align="center" sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                        {item.genres}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>

                    {/* 이미지 크기 & Work Year 조절 */}
                    <Grid container sx={{ mt: '3vh' }}>
                        <Grid item xs={8.8}>
                            <Grid container>
                                <Grid item container xs={8.5} />
                                <Grid item container xs={2} direction="column" justifyContent="center" alignItems='start' sx={{ mt: '4.8vh' }} >
                                    <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>Img Size</Typography>
                                    <ThemeProvider theme={theme}>
                                        <Slider value={imgSize}
                                            onChange={handleImgSize}
                                            valueLabelDisplay="off"
                                            disableSwap
                                            min={50}
                                            max={95} />
                                    </ThemeProvider>
                                </Grid>
                                <Grid item container xs={1.5} />
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Grid container sx={{ mb: '2vh' }}>
                                <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>Work Year</Typography>
                            </Grid>
                            <Grid container>
                                {minYear ? <>
                                    <Grid item xs={2} textAlign='start'>
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>{minYear}</Typography>
                                    </Grid>
                                    <Grid item xs={8}></Grid>
                                    <Grid item xs={2} textAlign='end'>
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>{maxYear}</Typography>
                                    </Grid>
                                </> : <Skeleton variant="rectangular" />}
                            </Grid>
                            <Grid container sx={{ paddingLeft: 2, paddingRight: 2, paddingTop: 0.8, paddingBottom: 2 }}>
                                <ThemeProvider theme={theme}>
                                    <Slider
                                        getAriaLabel={() => 'Minimum distance shift'}
                                        value={yearValue}
                                        onChange={handleYearChange}
                                        valueLabelDisplay="off"
                                        disableSwap
                                        min={minYear}
                                        max={maxYear} />
                                </ThemeProvider>
                            </Grid>
                            <Grid container sx={{ borderBottom: '1px solid grey' }}>
                                {selectedData && selectedData.length > 0 ?
                                    <>
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>{selectedData.length} {selectedData[0].genres} works</Typography>
                                    </> : <Skeleton variant="rectangular" />
                                }
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Show */}
                    <Grid container sx={{ mt: '1.5vh' }}>
                        <Grid item xs={2} sx={{ paddingLeft: 12.2, mt: -0.5 }}>
                            {selectedImg && selectedImg.title ?
                                <>
                                    <Grid container direction="column" alignItems="start">
                                        <h5 style={{ fontFamily: 'Helvetica', fontWeight: 700 }}>{selectedImg.title}</h5>
                                    </Grid>
                                    <Grid container direction="column" alignItems="start">
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                            {selectedImg.material}
                                        </Typography>
                                    </Grid>
                                    <Grid container direction="column" alignItems="start">
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                            Height : {parseInt(selectedImg.sizeH * 0.393701)} in / {selectedImg.sizeH}cm
                                        </Typography>
                                    </Grid>
                                    <Grid container direction="column" alignItems="start">
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                            Width : {parseInt(selectedImg.sizeW * 0.393701)} in / {selectedImg.sizeW}cm
                                        </Typography>
                                    </Grid>
                                    <Grid container direction="column" alignItems="start">
                                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                            Executed {selectedImg.executed}
                                        </Typography>
                                    </Grid>
                                </>
                                : <Skeleton variant="rectangular" />
                            }
                            {selectedImg && selectedImg.fileName && selectedImg.fileName.length > 1 ?
                                selectedImg.fileName.map((item) => (
                                    <Grid container direction="column" key={item} sx={{ mb: 1 }} onClick={() => handleImgChange(item)}>
                                        <img src={`/img/Artworks/${item}`} loading="lazy"
                                            className='thumbnail thumbnail-img'
                                            style={{
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Grid>
                                )) : <></>
                            }

                        </Grid>
                        <Grid item xs={6.8}>
                            {
                                selectedImg && selectedImg.fileName ?
                                    <img src={`/img/Artworks/${selectedImg.fileName[0]}`} loading="lazy" style={{ width: `${imgSize}%` }} />
                                    : <Skeleton variant="rectangular" />
                            }
                        </Grid>
                        <Grid item xs={3}>
                            <Grid container>
                                {selectedDataFiltered ? selectedDataFiltered.map((item) => (
                                    <Grid item xs={2} key={item.id} onClick={() => handleSeletedImg(item)} sx={{ mb: 1 }}>
                                        <img src={`/img/Artworks/${item.fileName[0]}`} loading="lazy"
                                            className={`rounded-3 mx-auto ${styledCSS.listGroupitem}`}
                                            style={{
                                                width: '3.5vw',
                                                aspectRatio: '1 / 1',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Grid>
                                )) : <Skeleton variant="rectangular" />}
                            </Grid>
                        </Grid>
                    </Grid>
                    <div id="footer" className="border-top p-4 footerfont ">
                        <div className="col-9 mx-auto text-start">
                            {footerTitle}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}


const footerTitle = `The content of this site is for personal use only. Neither text nor images may be reproduced in any form without the permission. 
You may download content solely for your personal use for non-commercial purposes. 
You may not modify or further reproduce the content for any purpose whatsoever. 
You must request and obtain express permission from HijoNam Studio for all other uses of content.`