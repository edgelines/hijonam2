import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Grid, Typography, Box, Stack } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { generateTheme } from './util.jsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import logo from '../assets/hijonam_logo.png'
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

export default function HomePage({ lang }) {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [imgData, setImgData] = useState([]);
    const [exhibition, setExhibition] = useState([]);
    const [autobiographyContent, setAutobiographyContent] = useState([]);
    const [photos, setPhotos] = useState({ exhibition: {}, studioUS: {}, studioKorea: {}, other: {} });
    const [worldTime, setWorldTime] = useState({ seoul: new Date(), newYork: new Date() });

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
        await axios.get(`http://hijonam.com/img/autobiography`).then((response) => {
            const data = response.data[response.data.length - 1]
            setAutobiographyContent(data);
        }).catch((error) => {
            console.error("Error fetching artworks:", error);
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
    // 모바일 스타일링
    const mobileHomeClockStyle = { fontSize: '12px', lineHeight: '14px' }

    return (
        <>
            {isMobile ? (
                <Grid container sx={{ padding: 3, mt: '3px' }} >
                    {/* 시계 */}
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
                                size={75}
                            />
                        </Grid>
                        <Grid item xs={0.3}></Grid>
                        <Grid item xs={2.5} container direction="column" justifyContent="flex-end" textAlign='start'>
                            <Typography sx={mobileHomeClockStyle}>
                                NEW YORK
                            </Typography>
                            <Typography sx={mobileHomeClockStyle}>
                                {worldTime.newYork.toLocaleTimeString("en-US")}
                            </Typography>
                            <Typography sx={mobileHomeClockStyle}>
                                {worldTime.newYork.toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid item xs={0.4}></Grid>
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
                                size={75}
                            />
                        </Grid>
                        <Grid item xs={0.3}></Grid>
                        <Grid item xs={2.5} container direction="column" justifyContent="flex-end" textAlign='start'>
                            <Typography sx={mobileHomeClockStyle}>SEOUL</Typography>
                            <Typography sx={mobileHomeClockStyle}>{worldTime.seoul.toLocaleTimeString("en-US")}</Typography>
                            <Typography sx={mobileHomeClockStyle}>{worldTime.seoul.toLocaleDateString()}</Typography>
                        </Grid>
                    </Grid>

                    {/* Exhibition */}
                    <Grid container textAlign='start' sx={{ mt: '30px' }} >
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
                                    <Grid container className="border-bottom" key={item.id} sx={{ height: '6vh' }} >
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

                    {/* Autobiography */}
                    <Grid container textAlign='start' sx={{ mt: '30px' }}>
                        <Grid item xs={10} sx={{ borderBottom: '1px solid black' }}>
                            Autobiography
                        </Grid>
                        <Grid item xs={2} textAlign='end' sx={{ borderBottom: '1px solid black' }}>
                            <Link to={`/bio/autobiography/`} style={{ color: 'black', textDecoration: 'none' }}>
                                See All
                            </Link>
                        </Grid>
                        <Grid item xs={12}>
                            {autobiographyContent && autobiographyContent.title ?
                                <AutobiographyContentComponent
                                    lang={lang} title={lang === 'En' ? autobiographyContent.title : autobiographyContent.title_kr}
                                    content={lang === 'En' ? autobiographyContent.content : autobiographyContent.content_kr}
                                    postId={autobiographyContent.id} />
                                : <div>Loading...</div>
                            }
                        </Grid>
                    </Grid>

                    {/* Photos */}
                    <Grid container textAlign='start' sx={{ mt: '30px' }}>
                        <Grid item xs={10} sx={{ borderBottom: '1px solid black' }}>
                            Recent Photos Upload
                        </Grid>
                        <Grid item xs={2} textAlign='end' sx={{ borderBottom: '1px solid black' }}>
                            <Link to={`/bio/photos`} style={{ color: 'black', textDecoration: 'none' }}>
                                See All
                            </Link>
                        </Grid>
                        <Grid item xs={12} sx={{ marginTop: '1vh' }}>
                            <Grid container spacing={2}>
                                {Object.entries(photos).map(([key, photo], index) => (
                                    <Grid item xs={3} key={key}>
                                        <div style={{ position: 'relative', paddingBottom: '75%' }}>
                                            <img
                                                src={`/img/Photos/${photo.folderName}/${photo.fileName}`}
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
                                        <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photo.title}</p>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        {/* <Grid item xs={12} sx={{ marginTop: '1vh' }} >
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
                        </Grid> */}
                    </Grid>

                </Grid>
            ) : (
                <Grid container>
                    <Grid item xs={5} sx={{ paddingLeft: 8, paddingRight: 8 }} >
                        <Grid container rowSpacing={3} sx={{ mt: '-3vh' }} >
                            <Grid item xs={12} textAlign='start'>
                                <img src={logo} style={{ width: "25vw" }} />
                            </Grid>
                            {/* Clock */}
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

                            {/* Exhibition */}
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

                            {/* Photos */}
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
                                    <Grid item xs={12} sx={{ marginTop: '1vh' }}>
                                        <Grid container spacing={2}>
                                            {Object.entries(photos).map(([key, photo], index) => (
                                                <Grid item xs={3} key={key}>
                                                    <div style={{ position: 'relative', paddingBottom: '75%' }}>
                                                        <img
                                                            src={`/img/Photos/${photo.folderName}/${photo.fileName}`}
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
                                                    <p style={{ textAlign: 'center', marginTop: '0.3vh' }}>{photo.title}</p>
                                                </Grid>
                                            ))}
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


const AutobiographyContentComponent = ({ lang, title, content, postId, onClick }) => {
    // 1. 이미지 URL 추출하기
    const imageRegex = /<img.*?src="(.*?)".*?>/; // 이미지 태그에서 src 값을 추출하는 정규식
    const imageMatch = content.match(imageRegex);
    const imageUrl = imageMatch ? imageMatch[1] : null; // 첫 번째 이미지 URL

    // 모든 <p> 태그의 내용을 추출하는 정규식
    const pTagsRegex = /<p.*?>([\s\S]*?)<\/p>/g;
    const pTagsMatches = [...content.matchAll(pTagsRegex)];

    let firstPText = "";

    for (let i = 0; i < pTagsMatches.length; i++) {
        const pContent = pTagsMatches[i][1].trim();
        // <img 태그나 <br 태그만을 포함하는 <p> 태그를 건너뜀
        if (!/<img /i.test(pContent) && pContent !== "<br>") {
            firstPText = pContent.replace(/<\/?[^>]+(>|$)/g, "");
            break;
        }
    }
    // 첫 번째 이미지 및 <br> 태그만을 포함하지 않는 <p> 태그의 텍스트에서 100자 추출하기
    const snippet = lang === 'En' ? firstPText.substr(0, 86) : firstPText.substr(0, 60);
    const someProps = { fontFamily: lang === 'Kr' ? 'Nanum Gothic' : 'Crimson Text', fontSize: 12, }
    const theme = generateTheme(someProps);
    const navigate = useNavigate();

    const goToDetailPage = (postId) => {
        navigate(`/bio/autobiography/${postId}`);
    };
    return (
        <Box sx={{ paddingTop: 1 }}
            onClick={() => goToDetailPage(String(postId))}
        >
            <Grid container>
                <Grid item xs={7}>
                    {imageUrl &&
                        <img src={imageUrl} alt="Post Thumbnail"
                            loading="lazy"
                            className='thumbnail thumbnail-img'
                            style={{
                                width: '100%',
                                objectFit: 'cover',
                                border: '1px solid grey'
                            }}
                        />}
                </Grid>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={4.5} >
                    <Grid item container direction="column" justifyContent="flex-end" sx={{ height: '100%' }}>
                        <Stack
                            direction="column"
                            justifyContent="flex-end"
                            alignItems="flex-start"
                        >
                            <ThemeProvider theme={theme} >
                                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#474747' }}>
                                    {title}
                                </Typography>
                                <Typography textAlign='start' sx={{ fontSize: lang === 'En' ? '12px' : '11.3px', color: '#474747', marginBottom: '15px', lineHeight: lang === 'En' ? '15px' : '17px' }}>
                                    {snippet}...
                                </Typography>
                            </ThemeProvider>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
        // <Link to={`/bio/autobiography/${String(postId)}`} style={{ color: 'black', textDecoration: 'none' }}>
        // </Link >
    )
}