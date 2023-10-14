import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, useNavigate, Link, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Button, Stack, Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Masonry } from '@mui/lab'
import axios from 'axios';
import { generateTheme, Share } from './util.jsx';
import Parser from 'html-react-parser';
// icon
import logo from '../assets/hijonam_logo.png'
import favicon from '../assets/favicon.ico'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import StyledCSS from "./autobiographyPage.module.css"
import "./Admin/autobiography.css";

// Autobiography Page
export default function AutobiographyPage({ lang }) {
    const componentRef = useRef();
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:1200px)');
    const isLgTablet = useMediaQuery('(max-width:1366px)');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState('Post')
    const [clickData, setClickData] = useState({});
    const [worldTime, setWorldTime] = useState({ seoul: new Date(), newYork: new Date() })
    const navigate = useNavigate();
    const fetchData = async () => {
        await axios.get(`http://hijonam.com/img/autobiography`).then((response) => {
            const dateFields = ['regDate'];
            let res = response.data.map(item => {
                dateFields.forEach(field => {
                    if (item[field]) {
                        const date = new Date(item[field]);
                        const year = date.getFullYear().toString();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        item[field] = `${year.substring(2.4)}.${month}.${day}`;
                    }
                });
                return item;
            });

            // // 데이터를 원하는 횟수만큼 복사합니다.
            // while (res.length < 12) {
            //     res = res.concat(res.slice(0, 12 - res.length));
            // }

            setData(res.sort((a, b) => b.id - a.id));
        }).catch((error) => {
            console.error("Error fetching artworks:", error);
        });
    }
    useEffect(() => {
        fetchData();
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
    }, [])
    // Handler 
    const handleClickDetailPage = (item) => { setCurrentPage('Detail'); setClickData(item); }
    const handleClickBackPage = () => { navigate(-1); setCurrentPage('Post'); }
    const someProps = { fontFamily: null, fontSize: null }
    const theme = generateTheme(someProps);
    return (
        <Grid container>
            {isMobile ?
                <Grid container sx={{ marginBottom: '2vh', padding: 3 }}>
                    <Grid item xs={12} sx={{ paddingLeft: 1, paddingRight: 1 }}>
                        <Grid container ref={componentRef} className={`${StyledCSS.printContent}`}>

                            {/* 하단 Router View */}
                            <Grid item xs={12}>
                                <Grid container direction='column' alignItems="center">
                                    <Routes>
                                        <Route path="/" element={<ContentsRoot lang={lang} data={data} handleClickDetailPage={handleClickDetailPage} />} />
                                        <Route path="/:postId" element={<PostDetailView lang={lang} clickData={clickData} componentRef={componentRef} setCurrentPage={setCurrentPage} />} />
                                    </Routes>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
                :
                // NonMobile
                <Grid container sx={{ marginBottom: '2vh' }}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6} sx={{ backgroundColor: currentPage === 'Post' ? '#f4f4f4' : 'white', paddingLeft: 1, paddingRight: 1 }}>
                        <Grid container ref={componentRef} className={`${StyledCSS.printContent}`}>
                            {/* Logo & Box */}
                            {isLgTablet ?
                                <Grid container>
                                    <Grid item xs={7.5} textAlign='start' container>
                                        <img src={logo} style={{ width: "6.5vw", marginTop: '2vh', marginBottom: '0.5vh' }} className={`${StyledCSS.printLogo}`} />
                                    </Grid>
                                    <Grid item xs={4.5} container direction='column' justifyContent='flex-end' alignContent='center' >
                                        <Grid container sx={{ border: '1px solid grey', borderRadius: '5px', height: isTablet ? '55px' : '65px' }}
                                            className={`${StyledCSS.printLogoRightBox}`}
                                            direction='column' justifyContent='center' alignContent='center' >
                                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '11px' }}>
                                                ALL THE CONTENTS ARE EDITED
                                            </Typography>
                                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '11px' }}>
                                                BY HIJO COMPANY & AOX
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                :
                                <Grid container>
                                    <Grid item xs={8.7} textAlign='start' container>
                                        <img src={logo} style={{ width: "6.5vw", marginTop: '2vh', marginBottom: '0.5vh' }} className={`${StyledCSS.printLogo}`} />
                                    </Grid>
                                    <Grid item xs={3.3} container direction='column' justifyContent='flex-end' alignContent='center' >
                                        <Grid container sx={{ border: '1px solid grey', borderRadius: '5px', height: '70px' }}
                                            className={`${StyledCSS.printLogoRightBox}`}
                                            direction='column' justifyContent='center' alignContent='center' >
                                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '11px' }}>
                                                ALL THE CONTENTS ARE EDITED
                                            </Typography>
                                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '11px' }}>
                                                BY HIJO COMPANY & AOX
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }

                            {/* favicon & Title & 뒤로가기 */}
                            <Grid item xs={12} sx={{ borderBottom: '2px solid grey', padding: '5px' }} textAlign='start'>
                                <Grid container>
                                    <Grid item xs={10}>
                                        <Typography sx={{ fontFamily: 'Crimson Text', fontWeight: 600, fontSize: '15px' }}>
                                            <img src={favicon} style={{ width: '21px', padding: 1, marginTop: '-4px', marginRight: '7px' }} />
                                            AUTOBIOGRAPHY
                                        </Typography>
                                    </Grid>

                                    {/* 뒤로가기 영역 */}
                                    <Grid item xs={2} textAlign='end' sx={{ marginTop: '-2px' }}>
                                        <ThemeProvider theme={theme}>
                                            {currentPage === 'Detail' ?
                                                <Button startIcon={<KeyboardBackspaceIcon />} size="small" onClick={() => handleClickBackPage()}>
                                                    {lang === 'En' ?
                                                        <Typography sx={{ fontFamily: 'Hevetica', fontSize: '12px' }}>
                                                            Back
                                                        </Typography>
                                                        :
                                                        <Typography sx={{ fontFamily: 'Nanum Gothic', fontSize: '12px' }}>
                                                            뒤로가기
                                                        </Typography>
                                                    }
                                                </Button>
                                                : <></>
                                            }
                                        </ThemeProvider>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* NewYork & Seoul Clock */}
                            <Grid item xs={12} sx={{ borderBottom: '2px solid grey', marginBottom: '2vh', padding: '3px' }} container
                            >
                                <Grid item xs={6}>
                                    <Grid container direction='colums' justifyContent='center'>
                                        <Typography variant='span' sx={{ fontFamily: 'Crimson Text', fontSize: '14px', margin: 0 }} className={`${StyledCSS.printClock}`}>
                                            NEW YORK
                                        </Typography>
                                        <Typography variant='span' sx={{ fontFamily: 'Crimson Text', fontSize: '14px', marginLeft: 2, marginRight: 2, marginBottom: '0px' }} className={`${StyledCSS.printClock}`}>
                                            {worldTime.newYork.toLocaleTimeString("en-US")}
                                        </Typography>
                                        <Typography variant='span' sx={{ fontFamily: 'Crimson Text', fontSize: '14px', marginBottom: '0px' }} className={`${StyledCSS.printClock}`}>
                                            {worldTime.newYork.toLocaleDateString("en-US", { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container direction='colums' justifyContent='center'>
                                        <Typography variant='span' sx={{ fontFamily: 'Crimson Text', fontSize: '14px', marginBottom: '0px' }} className={`${StyledCSS.printClock}`}>
                                            SEOUL
                                        </Typography>
                                        <Typography variant='span' sx={{ fontFamily: 'Crimson Text', fontSize: '14px', marginLeft: 2, marginRight: 2, marginBottom: '0px' }} className={`${StyledCSS.printClock}`}>
                                            {worldTime.seoul.toLocaleTimeString("en-US")}
                                        </Typography>
                                        <Typography variant='span' sx={{ fontFamily: 'Crimson Text', fontSize: '14px', marginBottom: '0px' }} className={`${StyledCSS.printClock}`}>
                                            {worldTime.seoul.toLocaleDateString("en-US", { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* 하단 Router View */}
                            <Grid item xs={12}>
                                <Grid container direction='column' alignItems="center">
                                    <Routes>
                                        <Route path="/" element={<ContentsRoot lang={lang} data={data} handleClickDetailPage={handleClickDetailPage} />} />
                                        <Route path="/:postId" element={<PostDetailView lang={lang} clickData={clickData} componentRef={componentRef} setCurrentPage={setCurrentPage} />} />
                                    </Routes>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}></Grid>
                    <Grid container sx={{ mb: '80px' }}></Grid>
                </Grid>
            }
        </Grid>
    )
}

// 
const ContentsRoot = ({ lang, data, handleClickDetailPage }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <>
            {isMobile ?
                <Grid container >
                    {data.map((item, index) => (
                        <PostView key={index} lang={lang} title={lang === 'En' ? item.title : item.title_kr} content={lang === 'En' ? item.content : item.content_kr}
                            views={item.views} postId={item.id}
                            onClick={() => handleClickDetailPage(item)} />
                    ))}
                </Grid>
                :
                <Masonry columns={4} spacing={1.4}>
                    {data.map((item, index) => (
                        <PostView key={index} lang={lang} title={lang === 'En' ? item.title : item.title_kr} content={lang === 'En' ? item.content : item.content_kr}
                            views={item.views} postId={item.id}
                            onClick={() => handleClickDetailPage(item)} />
                    ))}
                </Masonry>
            }
        </>
    );
}

// Masonry 효과 적용된 Post 1개의 View
const PostView = ({ lang, title, content, views, postId, onClick }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const isLgTablet = useMediaQuery('(max-width:1366px)');
    // 1. 이미지 URL 추출하기
    const imageRegex = /<img.*?src="(.*?)".*?>/; // 이미지 태그에서 src 값을 추출하는 정규식
    const imageMatch = content.match(imageRegex);
    const imageUrl = imageMatch ? imageMatch[1] : null; // 첫 번째 이미지 URL

    // // 2. HTML 태그 제거하기 : 전체글자에서 100자 선택
    // const plainText = content.replace(/<\/?[^>]+(>|$)/g, "");
    // // 3. 제목과 텍스트의 일부분 출력하기 (예: 앞의 100자)
    // const snippet = plainText.substr(0, 100);

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
    const snippet = firstPText.substr(0, 86);

    const someProps = {
        fontFamily: lang === 'Kr' ? 'Nanum Gothic' : 'Crimson Text', fontSize: 12,
    }
    const theme = generateTheme(someProps);
    return (
        <Link to={`/bio/autobiography/${postId}`} style={{ color: 'black', textDecoration: 'none' }}>
            <Box sx={{ border: '1px solid grey', padding: 1, cursor: 'pointer', marginBottom: isMobile ? '50px' : '' }} className={isMobile ? "" : `${StyledCSS.listGroupitem}`}
                onClick={onClick}>
                {imageUrl &&
                    <img src={imageUrl} alt="Post Thumbnail"
                        loading="lazy"
                        className='thumbnail thumbnail-img'
                        style={{
                            width: '100%',
                            objectFit: 'cover',
                        }}
                    />}
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{ marginTop: '1.8vh' }}
                >
                    <ThemeProvider theme={theme} >
                        <Grid container sx={{ marginBottom: isMobile && lang === 'Kr' ? '10px' : '5px' }}>
                            <Typography align='justify'
                                sx={{
                                    fontSize: isMobile ? '20px' : isLgTablet && lang === 'En' ? '17px' : isLgTablet && lang === 'Kr' ? '16px' : '18px',
                                    fontWeight: 600, color: '#474747', lineHeight: isLgTablet ? '18px' : '20px'
                                }}>
                                {title}
                            </Typography>
                        </Grid>
                        <Grid container sx={{ marginBottom: isMobile && lang === 'Kr' ? '5px' : '0px' }}>
                            <Typography textAlign='start' sx={{ fontSize: lang === 'En' ? '12px' : '11px', color: '#474747', marginBottom: '15px', lineHeight: lang === 'En' ? '15px' : '17px' }}>
                                {snippet}...
                            </Typography>
                        </Grid>
                        <Typography textAlign='start' sx={{ mt: '5px', fontSize: '10.8px', color: '#474747' }}>
                            {lang === 'En' ? `Views : ${views}` : `조회수 : ${views} `}
                        </Typography>
                    </ThemeProvider>
                </Stack>
            </Box>
        </Link >
    )
}

// Post를 눌렀을때 상세페이지
export const PostDetailView = ({ history, location, match, lang, componentRef, setCurrentPage }) => {
    // export const PostDetailView = ({ history, location, match, clickData, lang, componentRef }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [data, setData] = useState({});
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [shareData, setShareData] = useState({});
    const [view, setView] = useState(null);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://hijonam.com/img/autobiography/post/${postId}`);
            setData(res.data);
            setPost({
                title: lang === 'En' ? res.data.title : res.data.title_kr,
                content: lang === 'En' ? res.data.content : res.data.content_kr
            });

            // 카톡 공유를 위한 전처리
            const imageRegex = /<img.*?src="(.*?)".*?>/; // 이미지 태그에서 src 값을 추출하는 정규식
            const imageMatch = res.data.content.match(imageRegex);
            const imageUrl = imageMatch ? imageMatch[1] : null; // 첫 번째 이미지 URL

            // 모든 <p> 태그의 내용을 추출하는 정규식
            const pTagsRegex = /<p.*?>([\s\S]*?)<\/p>/g;
            const pTagsMatches = [...res.data.content_kr.matchAll(pTagsRegex)];

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
            const snippet = firstPText.substr(0, 86);
            setShareData({ imageUrl: imageUrl, snippet: snippet })
        } catch (error) {
            console.error("Error updating the views:", error);
        }
    }
    const ViewsCount = async () => {
        try {
            const response = await axios.put(`http://hijonam.com/img/autobiography/views/${postId}`); // 조회수 +1 증가
            setView(response.data.views); // 증가된 조회수 반환
        } catch (error) {
            console.error("Error updating the views:", error);
        }
    }
    useEffect(() => { ViewsCount(); fetchData(); setCurrentPage('Detail'); }, [])
    useEffect(() => {
        setPost({
            title: lang === 'En' ? data.title : data.title_kr,
            content: lang === 'En' ? data.content : data.content_kr
        })
    }, [lang])
    const someProps = { fontFamily: lang === 'Kr' ? 'Nanum Gothic' : null, fontSize: null }
    const theme = generateTheme(someProps);

    return (
        <>
            {isMobile ?
                <Grid container sx={{ marginBottom: '30px' }}>
                    <ThemeProvider theme={theme}>
                        <Grid item xs={12} textAlign='start'>
                            <Grid container>
                                <Grid item xs={10}>
                                    <Typography variant='h5' sx={{ fontWeight: 600 }}>{post.title}</Typography>
                                </Grid>
                                <Grid item xs={2} textAlign='end'>
                                    <Share currentUrl={`http://hijonam.com/bio/autobiography/${postId}`}
                                        kakaoTitle={data.title_kr} kakaoDescription={shareData.snippet} kakaoImage={`http://hijonam.com/${shareData.imageUrl}`}
                                        componentRef={componentRef}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} textAlign='start' sx={{ mt: 1 }}>
                            <Typography variant='span' className={`${StyledCSS.printView}`}>{lang === 'En' ? `Views : ${view}` : `조회수 : ${view}`}</Typography>
                        </Grid>
                        <Grid item xs={12} textAlign='justify' sx={{ mt: 2 }}>
                            {Parser(post.content || "")}
                        </Grid>
                    </ThemeProvider>
                </Grid>
                :
                // NonMobile
                <Grid container sx={{ marginBottom: '7vh' }}>
                    <ThemeProvider theme={theme}>
                        <Grid item xs={12} textAlign='start'>
                            <Grid container>
                                <Grid item container direction='column' justifyContent="center" xs={8}>
                                    <Typography variant='h5' sx={{ fontWeight: 600 }}>{post.title}</Typography>
                                </Grid>
                                <Grid item xs={4} textAlign='end'>
                                    <Share currentUrl={`http://hijonam.com/bio/autobiography/${postId}`}
                                        kakaoTitle={data.title_kr} kakaoDescription={shareData.snippet} kakaoImage={`http://hijonam.com/${shareData.imageUrl}`}
                                        componentRef={componentRef}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} textAlign='start' sx={{ mt: 1 }}>
                            <Typography variant='span' className={`${StyledCSS.printView}`}>{lang === 'En' ? `Views : ${view}` : `조회수 : ${view}`}</Typography>
                        </Grid>
                        <Grid item xs={12} textAlign='justify' sx={{ mt: 2 }}>
                            {Parser(post.content || "")}
                        </Grid>
                    </ThemeProvider>
                </Grid>
            }
        </>
    )
}


