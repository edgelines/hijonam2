import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, styled } from '@mui/material/styles';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { Grid, Chip, Divider, Tabs, Tab, Stack, Typography, Paper, Dialog, Button, DialogContent, DialogActions } from '@mui/material';
import {
    Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot,
    TimelineOppositeContent, timelineOppositeContentClasses,
} from '@mui/lab';
import styledComponents from 'styled-components';
import axios from 'axios';
import DoneIcon from '@mui/icons-material/Done';
import { TimelineDotStyle, MarginPictures, generateTheme } from './util.jsx';
import photowall from '../assets/photowall.jpg'
export default function ExhibitionPage({ lang }) {
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:1200px)');
    const navigate = useNavigate();
    const location = useLocation();
    const [subTitle, setSubTitle] = useState('PAST EXHIBITION');
    const someProps = { fontFamily: null, fontSize: isTablet ? '12px' : null }
    const theme = generateTheme(someProps);
    return (
        <>
            <MarginPictures title='EXHIBITION' subTitle={subTitle} />
            {isMobile ? (
                <Grid container sx={{ paddingLeft: 3, paddingRight: 3 }}>
                    <Grid item xs={12} sx={{ mt: '1vh' }}>
                        <ThemeProvider theme={theme}>
                            <Grid container direction="column" alignItems='center' >
                                <Tabs value={location.pathname} onChange={(event, newValue) => navigate(newValue)}
                                    variant="fullWidth"
                                    aria-label="basic tabs example">
                                    <Tab value="/exhibition" label="Past Exhibition"
                                        onClick={() => { setSubTitle('PAST EXHIBITION'); }} />
                                    <Tab value="/exhibition/upcoming/" label="Present & Upcoming Exhibition"
                                        onClick={() => { setSubTitle('PRESENT & UPCOMING EXHIBITION'); }} />
                                </Tabs>
                            </Grid>
                        </ThemeProvider>
                        <Grid container>
                            <Routes>
                                <Route path="/" element={<PastExhibition lang={lang} />} />
                                <Route path="/upcoming" element={<UpcomingExhibition />} />
                            </Routes>
                        </Grid>
                    </Grid>

                </Grid>
            ) : (
                <Grid container>
                    <Grid item xs={0.5}></Grid>
                    <Grid item xs={11} sx={{ mt: '1vh' }}>
                        <ThemeProvider theme={theme}>
                            <Grid container direction="column" alignItems='center' >
                                <Tabs value={location.pathname} onChange={(event, newValue) => navigate(newValue)} aria-label="basic tabs example">
                                    <Tab value="/exhibition" label="Past Exhibition"
                                        onClick={() => { setSubTitle('PAST EXHIBITION'); }} />
                                    <Tab value="/exhibition/upcoming/" label="Present & Upcoming Exhibition"
                                        onClick={() => { setSubTitle('PRESENT & UPCOMING EXHIBITION'); }} />
                                </Tabs>
                            </Grid>

                        </ThemeProvider>
                        <Grid container>
                            <Routes>
                                <Route path="/" element={<PastExhibition lang={lang} />} />
                                <Route path="/upcoming" element={<UpcomingExhibition />} />
                            </Routes>
                        </Grid>
                    </Grid>
                    <Grid item xs={0.5}></Grid>
                </Grid>
            )}
        </>
    );
}

const PastExhibition = ({ lang }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:1200px)');
    const [data, setData] = useState([]);
    const [selectedChip, setSelectedChip] = useState('Solo');

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
    const btnData = async (name) => {
        setSelectedChip(name);
        let url;
        if (name === 'Solo') {
            url = 'soloExhibition'
        } else {
            url = 'groupExhibition'
        }
        await axios.get(`http://hijonam.com/api/${url}`).then((response) => {
            setData(processYear(response.data));

        })
    }
    useEffect(() => { btnData('Solo'); }, []);
    const someProps = { fontFamily: lang === 'Kr' ? 'Bitgoeul_Medium' : 'Helvetica', fontSize: isTablet ? 12 : 13 }
    const theme = generateTheme(someProps);
    return (
        <>
            {isMobile ?
                <Grid container sx={{ marginBottom: '40px' }} >
                    <Grid item container textAlign='start' sx={{ mt: '30px' }}>
                        <Stack direction="row" spacing={5} >
                            <Chip icon={selectedChip === 'Solo' ? <DoneIcon /> : null}
                                label="SOLO"
                                onClick={() => btnData('Solo')} style={{ backgroundColor: selectedChip === 'Solo' ? '#eee' : 'transparent' }}
                                sx={{ '.MuiChip-label': { fontSize: 11, fontFamily: 'Helvetica' } }}  // 폰트 스타일링 적용
                            />
                            <Chip icon={selectedChip === 'Group' ? <DoneIcon /> : null}
                                label="GROUP" onClick={() => btnData('Group')} style={{ backgroundColor: selectedChip === 'Group' ? '#eee' : 'transparent' }}
                                sx={{ '.MuiChip-label': { fontSize: 11, fontFamily: 'Helvetica' } }}  // 폰트 스타일링 적용
                            />
                        </Stack>
                    </Grid>
                    <Grid tiem xs={12} sx={{ mt: '30px' }}>
                        {data.map((item, index) => (
                            <Grid container key={item.id} sx={{ marginBottom: '8px' }}>
                                <Grid item xs={1.7}>
                                    <Typography sx={{ fontFamily: 'Helvetica', fontSize: '12px', textAlign: 'start', lineHeight: '15px' }}>
                                        {item.year}
                                    </Typography>
                                </Grid>
                                <Grid item xs={7}>
                                    <Typography sx={{ fontSize: '12px', textAlign: 'start', lineHeight: '15px' }}>
                                        {lang === 'En' ? item.title : item.title_kr}
                                    </Typography>
                                </Grid>
                                <Grid item xs={0.3}></Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ fontFamily: 'Helvetica', fontSize: '12px', lineHeight: '15px', textAlign: 'start' }}>
                                        {item.location}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>


                </Grid>
                :
                <Grid container>
                    <Grid item xs={12} textAlign='start'>
                        <Grid container>
                            <Grid item xs={3.5} textAlign='start' sx={{ mt: '112px' }}>
                                <StyledTypography>{selectedChip === 'Solo' ? 'SOLO EXHIBITION' : 'SELECTED & INVITATIONAL GROUP EXHIBITION'}</StyledTypography>
                            </Grid>

                            <Grid item xs={8.5} textAlign='start' sx={{ mt: '28px' }}>
                                <Stack direction="row" spacing={5} sx={{ marginLeft: '0.8vw' }}>
                                    <Chip icon={selectedChip === 'Solo' ? <DoneIcon /> : null}
                                        label="SOLO" onClick={() => btnData('Solo')} style={{ backgroundColor: selectedChip === 'Solo' ? '#eee' : 'transparent' }}
                                        sx={{ '.MuiChip-label': { fontSize: isTablet ? 12 : 13, fontFamily: 'Helvetica' } }}
                                    />
                                    <Chip icon={selectedChip === 'Group' ? <DoneIcon /> : null}
                                        label="GROUP" onClick={() => btnData('Group')} style={{ backgroundColor: selectedChip === 'Group' ? '#eee' : 'transparent' }}
                                        sx={{ '.MuiChip-label': { fontSize: isTablet ? 12 : 13, fontFamily: 'Helvetica' } }}
                                    />
                                </Stack>
                                <ThemeProvider theme={theme}>
                                    <Timeline
                                        sx={{
                                            [`& .${timelineOppositeContentClasses.root}`]: {
                                                flex: 0.1,
                                            },
                                            mt: '47px',
                                            ml: '-5vw'
                                        }}>
                                        {data.map((item, index) => (
                                            <TimelineItem key={item.id} sx={{ height: 'auto', minHeight: 'auto' }} >
                                                <TimelineOppositeContent>
                                                    <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                                        {item.year}
                                                    </Typography>
                                                </TimelineOppositeContent>

                                                <TimelineSeparator>
                                                    <TimelineDot sx={TimelineDotStyle} />
                                                    {index < data.length - 1 && <TimelineConnector sx={{ height: 15, ...TimelineDotStyle }} />}
                                                </TimelineSeparator>

                                                <TimelineContent>
                                                    <Grid container>
                                                        <Grid item xs={8}>
                                                            <Typography sx={{ fontSize: '13px' }}>
                                                                {lang === 'En' ? item.title : item.title_kr}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '13px' }}>
                                                                {item.location}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </Timeline>
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
        </>
    )
}

const StyledTypography = styledComponents(Typography)`
    font-family: 'Helvetica' !important;
    font-size: 66px !important;
    font-weight: 600 !important;
    color: rgb(196, 196, 196) !important;
    line-height: calc(var(--base-space) * 6) !important;
    margin-top: calc(var(--base-space) * 1) !important;

    @media (min-width : 960px) and (max-width : 1366px) {
        font-size: 50px !important;
        font-weight: 900 !important;
        color: rgb(196, 196, 196) !important;
        line-height: calc(var(--base-space) * 6) !important;
        margin-top: calc(var(--base-space) * 1) !important;
    }

`;


const UpcomingExhibition = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [present, setPresent] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);  // 모달의 열림/닫힘 상태
    const [currentImage, setCurrentImage] = useState('');
    const handleImageClick = (imageSrc) => {
        setCurrentImage(imageSrc);
        setIsModalOpen(true);
    };
    const formattedMemo = (item) => { return item.memo ? `${item.memo}` : ''; }
    const fetchData = async () => {
        const response = await axios.get(`http://hijonam.com/img/upcomingExhibition`)
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

        setPresent(res.filter(item => item.state == 1))
        // while (res.length < 4) {
        //     res = res.concat(res.slice(0, 4 - res.length));
        // }
        setUpcoming(res.filter(item => item.state == 0))
    }
    useEffect(() => { fetchData(); }, []);
    return (

        <>
            <ImageModal isOpen={isModalOpen} imageSrc={currentImage} onClose={() => setIsModalOpen(false)} />
            {isMobile ?

                <Grid container sx={{ mt: '1vh', padding: 3 }}>
                    <Grid item xs={12} textAlign='center' >
                        <Typography sx={{ mb: '4vh', fontSize: '22.4px' }}>PRESENT EXHIBITION</Typography>
                        {present && present.length > 0 ?
                            <>
                                {
                                    present.map((item) => (
                                        <Grid container key={item.id} sx={{ mt: '3vh' }}>
                                            <Grid item xs={12}>
                                                <img src={`/img/Exhibition/${item.fileName[0] === 'Upcoming Exhibition.png' ? 'Upcoming Exhibition.png' : item.fileName[0]}`} className='mx-auto img-td-edit rounded-3 imgBorder'
                                                    onClick={() => handleImageClick(`/img/Exhibition/${item.fileName[0] === 'Upcoming Exhibition.png' ? 'Upcoming Exhibition.png' : item.fileName[0]}`)}
                                                    style={{
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        border: '1px solid black',
                                                        cursor: 'pointer'
                                                        // aspectRatio: '1 / 1',
                                                    }} />
                                            </Grid>

                                            <Grid item xs={12} >
                                                <Grid container direction="row" justifyContent="center" alignItems="flex-end" style={{ height: '100%' }} >
                                                    <Stack spacing={0} sx={{ marginTop: '5vh' }}>
                                                        <Item elevation={0} sx={{ fontSize: '14px' }} >{item.soloGroup === 0 ? 'Solo' : 'Group'} Exhibition</Item>
                                                        <Item elevation={0} sx={{ fontSize: '14px' }} >{item.title}</Item>
                                                        <Item elevation={0} sx={{ fontSize: '14px' }} >{item.startDate} ~ {item.endDate}</Item>
                                                        <Item elevation={0} sx={{ fontSize: '14px' }} >{item.location}</Item>
                                                        <Item elevation={0} sx={{ fontSize: '14px' }} >{formattedMemo(item)}</Item>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))
                                }
                            </> :
                            <>
                                <Grid container sx={{ height: '40vh' }} justifyContent="center" alignItems="center">
                                    <Typography justifyContent="center" alignItems="center" sx={{ fontSize: '13px' }} >
                                        "No upcoming exhibition plans at the moment"
                                    </Typography>
                                </Grid>
                            </>
                        }
                    </Grid>

                    <Grid item xs={12} textAlign='center' sx={{ marginTop: '10vh' }}>
                        <Typography sx={{ mb: '4vh', fontSize: '22.4px' }}>UPCOMING EXHIBITION</Typography>
                        {upcoming && upcoming.length > 0 ?
                            <>
                                {upcoming.map((item) => (
                                    <Grid container key={item.id} sx={{ padding: 1, mt: '3vh' }} >
                                        <Grid container>

                                            <Grid item xs={4}>
                                                <img src={`/img/Exhibition/${item.fileName[0] === 'Upcoming Exhibition.png' ? 'Upcoming Exhibition.png' : item.fileName[0]}`} className='mx-auto img-td-edit rounded-3 imgBorder'
                                                    onClick={() => handleImageClick(`/img/Exhibition/${item.fileName[0] === 'Upcoming Exhibition.png' ? 'Upcoming Exhibition.png' : item.fileName[0]}`)}
                                                    style={{
                                                        top: 0,
                                                        left: 0,
                                                        width: '25vw',
                                                        objectFit: 'cover',
                                                        border: '1px solid black',
                                                        cursor: 'pointer'
                                                    }} />
                                            </Grid>
                                            <Grid item xs={1}></Grid>
                                            <Grid item xs={7}>
                                                <Grid container direction="row" justifyContent="start" alignItems="flex-end" style={{ height: '100%' }}>
                                                    <Stack spacing={0}>
                                                        <Item elevation={0}>{item.soloGroup === 0 ? 'Solo' : 'Group'} Exhibition</Item>
                                                        <Item elevation={0}>{item.title}</Item>
                                                        <Item elevation={0}>{item.startDate} ~ {item.endDate}</Item>
                                                        <Item elevation={0}>{item.location}</Item>
                                                        <Item elevation={0}>{formattedMemo(item)}</Item>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid container sx={{ marginTop: '2vh' }}>
                                            {/* <Grid item xs={1}></Grid> */}
                                            <Grid item xs={12}>
                                                <Divider sx={{ borderColor: '#000' }} light={false} />
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                ))}
                            </> :
                            <Grid container sx={{ height: '40vh' }} justifyContent="center" alignItems="center">
                                <Typography justifyContent="center" alignItems="center" sx={{ fontSize: '13px' }}>
                                    "No upcoming exhibition plans at the moment"
                                </Typography>
                            </Grid>
                        }
                    </Grid>
                </Grid>
                :

                // NonMobile
                <Grid container sx={{ mt: '10px' }}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={6} textAlign='center' sx={{ height: '100%' }}  >
                        <Typography sx={{ mb: '40px', fontSize: '22.4px' }}>PRESENT EXHIBITION</Typography>
                        {present && present.length > 0 ?
                            <>
                                {
                                    present.map((item) => (
                                        <Grid container key={item.id} sx={{ mt: '30px' }}>
                                            <Grid item xs={7}>
                                                <img src={`/img/Exhibition/${item.fileName[0] === 'Upcoming Exhibition.png' ? 'Upcoming Exhibition.png' : item.fileName[0]}`} className='mx-auto img-td-edit rounded-3 imgBorder'
                                                    onClick={() => handleImageClick(`/img/Exhibition/${item.fileName[0] === 'Upcoming Exhibition.png' ? 'Upcoming Exhibition.png' : item.fileName[0]}`)}
                                                    style={{
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        border: '1px solid black',
                                                        cursor: 'pointer'
                                                        // aspectRatio: '1 / 1',
                                                    }} />
                                            </Grid>

                                            <Grid item xs={5} >
                                                <Grid container direction="row" justifyContent="center" alignItems="flex-end" style={{ height: '100%' }} >
                                                    <Stack spacing={0} sx={{ marginBottom: '-25vh' }}>
                                                        <Item elevation={0} sx={{ fontSize: '15px' }} >{item.soloGroup === 0 ? 'Solo' : 'Group'} Exhibition</Item>
                                                        <Item elevation={0} sx={{ fontSize: '15px' }} >{item.title}</Item>
                                                        <Item elevation={0} sx={{ fontSize: '15px' }} >{item.startDate} ~ {item.endDate}</Item>
                                                        <Item elevation={0} sx={{ fontSize: '15px' }} >{item.location}</Item>
                                                        <Item elevation={0} sx={{ fontSize: '15px' }} >{formattedMemo(item)}</Item>
                                                    </Stack>
                                                    <img src={photowall} style={{
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        objectFit: 'cover',
                                                        cursor: 'pointer'
                                                    }} />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))
                                }
                            </> :
                            <>
                                <Grid container sx={{ height: '50vh' }} justifyContent="center" alignItems="center">
                                    <Typography justifyContent="center" alignItems="center" sx={{ fontSize: '13px' }} >
                                        "No upcoming exhibition plans at the moment"
                                    </Typography>
                                </Grid>
                            </>
                        }
                    </Grid>
                    {/* <Divider orientation="vertical" variant='fullWidth' flexItem sx={{ borderColor: '#000', height: '35vh', position: 'absolute', transform: 'translate(45.6vw, 5vh)', zIndex: 99 }} light={false} /> */}
                    <Grid item xs={5} textAlign='center'>
                        <Typography sx={{ mb: '40px', fontSize: '22.4px' }}>UPCOMING EXHIBITION</Typography>
                        {upcoming && upcoming.length > 0 ?
                            <>
                                {upcoming.map((item) => (
                                    <Grid container key={item.id} sx={{ padding: 1, mt: '30px' }} >
                                        <Grid container>
                                            <Grid item xs={1}></Grid>
                                            <Grid item xs={4}>
                                                <img src={`/img/Exhibition/${item.fileName[0] === 'Upcoming Exhibition.png' ? 'Upcoming Exhibition.png' : item.fileName[0]}`}
                                                    onClick={() => handleImageClick(`/img/Exhibition/${item.fileName[0] === 'Upcoming Exhibition.png' ? 'Upcoming Exhibition.png' : item.fileName[0]}`)}
                                                    className='mx-auto img-td-edit rounded-3 imgBorder'
                                                    style={{
                                                        top: 0,
                                                        left: 0,
                                                        width: '7vw',
                                                        objectFit: 'cover',
                                                        border: '1px solid black'
                                                    }} />
                                            </Grid>
                                            <Grid item xs={7}>
                                                <Grid container direction="row" justifyContent="start" alignItems="flex-end" style={{ height: '100%' }}>
                                                    <Stack spacing={0}>
                                                        <Item elevation={0}>{item.soloGroup === 0 ? 'Solo' : 'Group'} Exhibition</Item>
                                                        <Item elevation={0}>{item.title}</Item>
                                                        <Item elevation={0}>{item.startDate} ~ {item.endDate}</Item>
                                                        <Item elevation={0}>{item.location}</Item>
                                                        <Item elevation={0}>{formattedMemo(item)}</Item>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid container sx={{ marginTop: '2vh' }}>
                                            <Grid item xs={1}></Grid>
                                            <Grid item xs={10}>
                                                <Divider sx={{ borderColor: '#000' }} light={false} />
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                ))}
                            </> :
                            <Grid container sx={{ height: '50vh' }} justifyContent="center" alignItems="center">
                                <Typography justifyContent="center" alignItems="center" sx={{ fontSize: '13px' }}>
                                    "No upcoming exhibition plans at the moment"
                                </Typography>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            }
        </>
    )
}

const Item = styled(Paper)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    // ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'start',
    // color: theme.palette.text.secondary,
}));

const ImageModal = ({ isOpen, imageSrc, onClose }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogContent>
                <img src={imageSrc} alt="Enlarged Image" style={{ width: '100%', height: 'auto' }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};