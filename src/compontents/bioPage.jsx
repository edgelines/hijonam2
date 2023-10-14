import React, { useState, useEffect } from 'react';
import { Route, Routes, HashRouter, useNavigate, useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Tabs, Tab, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab'
import axios from 'axios';
import { MarginPictures, TimelineDotStyle, generateTheme, Share } from './util.jsx';
// import PropTypes from 'prop-types';
import Photos from './photosPage.jsx';
import AutobiographyPage from './autobiographyPage.jsx';


export default function BioPage({ lang }) {
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:1200px)');
    const navigate = useNavigate();
    const location = useLocation();
    const [gangeTitle, setGangeTitle] = useState('BIOGRAPHY')
    const [subTitle, setSubTitle] = useState(null);
    const someProps = { fontFamily: null, fontSize: isTablet ? '12px' : null }
    const theme = generateTheme(someProps);
    const adjustedPath = location.pathname.split('/')[3] ? "/bio/autobiography/" : location.pathname;
    return (
        <>
            {isMobile ? (
                <Grid container sx={{ maxWidth: '100vw' }}>
                    <MarginPictures title={gangeTitle} subTitle={subTitle} height={'20vh'} />
                    <Grid container sx={{ mt: '0.5vh', maxWidth: '100vw', }} >
                        <Grid item container direction="column" alignItems='center'>
                            <ThemeProvider theme={theme}>
                                <Tabs value={adjustedPath} onChange={(event, newValue) => navigate(newValue)}
                                    variant="fullWidth"
                                    aria-label="basic tabs example">
                                    <Tab value="/bio" label="Biography"
                                        onClick={() => {
                                            setGangeTitle('BIOGRAPHY'); setSubTitle(null);
                                        }} />
                                    <Tab value="/bio/autobiography/" label="Autobiography"
                                        onClick={() => {
                                            setGangeTitle('AUTOBIOGRAPHY'); setSubTitle(null);
                                        }} />
                                    <Tab value="/bio/photos/" label="Photos"
                                        onClick={() => {
                                            setGangeTitle('PHOTOS');
                                        }} />
                                </Tabs>
                            </ThemeProvider>
                        </Grid>

                        <Grid item container direction="column" sx={{ mt: '2vh' }} >
                            <Routes>
                                <Route path="/" element={<Biography lang={lang} setSubTitle={setSubTitle} />} />
                                <Route path="/autobiography/*" element={<AutobiographyPage lang={lang} />} />
                                <Route path="/photos" element={<Photos lang={lang} setSubTitle={setSubTitle} />} />
                            </Routes>
                        </Grid>
                    </Grid>
                </Grid>
            ) : (
                <>
                    <MarginPictures title={gangeTitle} subTitle={subTitle} />
                    <Grid container sx={{ mt: '0.5vh' }} >
                        <Grid item container direction="column" alignItems='center'>
                            <ThemeProvider theme={theme}>
                                <Tabs value={adjustedPath} onChange={(event, newValue) => navigate(newValue)} aria-label="basic tabs example">
                                    <Tab value="/bio" label="Biography"
                                        onClick={() => {
                                            setGangeTitle('BIOGRAPHY'); setSubTitle(null);
                                        }} />
                                    <Tab value="/bio/autobiography/" label="Autobiography"
                                        onClick={() => {
                                            setGangeTitle('AUTOBIOGRAPHY'); setSubTitle(null);
                                        }} />
                                    <Tab value="/bio/catalogue/" label="Catalogue" onClick={() => {
                                        setGangeTitle('CATALOGUE');
                                    }} />
                                    <Tab value="/bio/photos/" label="Photos"
                                        onClick={() => {
                                            setGangeTitle('PHOTOS');
                                        }} />
                                </Tabs>
                            </ThemeProvider>
                        </Grid>

                        <Grid item container direction="column" sx={{ mt: '2vh' }} >
                            <Routes>
                                <Route path="/" element={<Biography lang={lang} setSubTitle={setSubTitle} />} />
                                <Route path="/autobiography/*" element={<AutobiographyPage lang={lang} />} />
                                <Route path="/photos" element={<Photos lang={lang} setSubTitle={setSubTitle} />} />
                                <Route path="/catalogue" element={<CataloguePage lang={lang} setSubTitle={setSubTitle} />} />
                            </Routes>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}

const Biography = ({ lang }) => {
    const [awards, setAwards] = useState([]);
    const [artistic, setArtistic] = useState([]);
    const education = [{ "id": 1, "year": "2007", "title": "M. F. A, Pratt Institute, Brooklyn, NY", "title_kr": '미국 프랫예술대학교 순수미술 석사' },
    { "id": 0, "year": "2004", "title": "B. F. A, Pratt Institute, Brooklyn, NY", "title_kr": '미국 프랫예술대학교 순수미술 학사' }]
    function processYear(data) {
        let processedData = [];
        let prevYear = null;

        data.forEach((item) => {
            if (item.year === prevYear) {
                item.year = null;
            } else {
                prevYear = item.year;
            }
            processedData.push(item);
        });
        return processedData;
    }
    const fetchData = async () => {
        await axios.get(`http://hijonam.com/api/awards`).then((response) => {
            setAwards(processYear(response.data));
        })
        await axios.get(`http://hijonam.com/api/experiences`).then((response) => {
            setArtistic(processYear(response.data));
        })
    }
    useEffect(() => { fetchData(); }, [])
    return (
        <Grid container>
            <Grid item container direction="column" alignItems='left'>
                <TimeLineTable title={'education'} data={education} lang={lang} />
                <TimeLineTable title={'awards'} data={awards} lang={lang} style={{ marginTop: '30px', }} />
                <TimeLineTable title={'Artistic Engagement'} data={artistic} lang={lang} style={{ marginTop: '30px', }} />
            </Grid>
        </Grid>
    )
}

const TimeLineTable = ({ title, lang, data }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:1200px)');
    const someProps = { fontFamily: lang === 'Kr' ? 'Bitgoeul_Medium' : 'Helvetica', fontSize: lang === 'Kr' ? 12 : 12 }
    const theme = generateTheme(someProps);
    return (
        <>
            {isMobile ?
                <Grid container sx={{ padding: 3 }}>
                    <Grid container textAlign='start'>
                        <Typography sx={{ fontSize: '20px' }}>
                            {title.toUpperCase()}
                        </Typography>
                    </Grid>
                    <Grid container sx={{ marginTop: '10px' }}>
                        {data.map((item, index) => (
                            <Grid container key={item.id} sx={{ marginBottom: '8px' }}>
                                <Grid item xs={1.7}>
                                    <Typography sx={{ fontFamily: 'Helvetica', fontSize: '12px', textAlign: 'start', lineHeight: '15px' }}>
                                        {item.year}
                                    </Typography>
                                </Grid>
                                <Grid item xs={10.3}>
                                    <Typography sx={{ fontSize: '12px', textAlign: 'start', lineHeight: '15px' }}>
                                        {lang === 'En' ? item.title : item.title_kr}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid >
                :
                // Non Mobile
                <Grid container sx={{ marginTop: '50px' }} >
                    <Grid item xs={2}></Grid>
                    <Grid item xs={9}>
                        <Grid container>
                            <Grid item xs={12} textAlign='start' >
                                <Grid container>
                                    <Grid item xs={0.3}></Grid>
                                    <Grid item xs={6} sx={{ fontSize: '22.4px' }}>
                                        {title.toUpperCase()}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <ThemeProvider theme={theme}>
                                <Timeline
                                    sx={{
                                        [`& .${timelineOppositeContentClasses.root}`]: {
                                            flex: 0.06,
                                        },
                                        mt: '28px'
                                    }}
                                >
                                    {data.map((item, index) => (
                                        <TimelineItem key={item.id} sx={{ height: 'auto', minHeight: 'auto' }} >
                                            <TimelineOppositeContent>
                                                <Typography sx={{ fontFamily: 'Helvetica', fontSize: isTablet ? '12px' : '13px' }}>
                                                    {item.year}
                                                </Typography>
                                            </TimelineOppositeContent>

                                            <TimelineSeparator>
                                                <TimelineDot sx={TimelineDotStyle} />
                                                {index < data.length - 1 && <TimelineConnector sx={{ height: 15, ...TimelineDotStyle }} />}
                                            </TimelineSeparator>

                                            <TimelineContent>
                                                <Typography sx={{ fontSize: isTablet ? '12px' : '13px' }}>
                                                    {lang === 'En' ? item.title : item.title_kr}
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            </ThemeProvider>
                        </Grid>
                    </Grid>
                </Grid>
            }
        </>
    )
}

const CataloguePage = ({ lang }) => {
    const title = "EXPLORE AND DOWNLOAD HIJONAM's CATALOGUE ON THIS PAGE"
    return (
        <>
            <Grid container sx={{ mt: '80px' }}>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                    <Grid container>
                        <Typography align='start' sx={{ fontFamily: 'Helvetica', fontSize: '28px', paddingTop: 1.5, color: 'rgb(196, 196, 196)', fontWeight: 600 }}>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid container sx={{ mt: '30px' }} >
                        <Typography align='center' sx={{ color: 'dodgerblue' }} >CURRENTY CATALOGUE PAGE IS WORKING ON PROCESS</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid container sx={{ mb: '500px' }}></Grid>
            </Grid>
        </>
    )
}