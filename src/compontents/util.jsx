import React, { useEffect } from 'react';
import { createTheme, styled } from '@mui/material/styles';
import { Grid, Switch, Typography, IconButton, SvgIcon, Popover } from '@mui/material';
import gridImg from '../assets/gang.jpg'
import { NumericFormat } from 'react-number-format';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, LineShareButton, LineIcon, } from "react-share";
import useMediaQuery from '@mui/material/useMediaQuery';
// import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import ReactPrintStyled from './util.module.css'
import PrintIcon from '../assets/printer_light_icon.png'
import ShareIcon from '@mui/icons-material/Share';
// import { shareOnMobile } from "react-mobile-share";
export const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    transform: 'translateY(-1px)',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

export const generateTheme = (props) => {
    let primaryColor = 'rgb(0, 0, 0)'; // default value

    if (props.someCondition) {
        primaryColor = 'rgb(255, 0, 0)'; // change value based on props
    }

    return createTheme({
        palette: {
            primary: {
                main: primaryColor,
            },
        },
        typography: {
            fontFamily: props.fontFamily ? props.fontFamily : "Helvetica",
            fontSize: props.fontSize ? props.fontSize : 13,
        }
    });
}

export const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

// 유저페이지의 페이지마다 간지
export const MarginPictures = ({ title, subTitle }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <>
            {isMobile ?
                <Grid container>
                    {/* <Grid item xs={12} container direction='column' justifyContent='center' sx={{ height: '264px', backgroundImage: `url(${gridImg})`, backgroundSzie: 'cover', padding: 0, margin: 0 }} > */}
                    <Grid item container direction='column'
                        sx={{ width: '100vw', height: '150px', backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url(${gridImg})`, backgroundSzie: 'cover' }} >
                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '28px', fontWeight: 800, color: 'white', marginTop: '50px', marginBottom: '20px', letterSpacing: '2px' }}>{title}</Typography>
                        {subTitle ?
                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '18px', color: 'white' }}>— {subTitle} —</Typography>
                            :
                            <></>
                        }
                    </Grid>
                </Grid>
                :
                <Grid container style={{ margin: 0, padding: 0 }} >
                    {/* <Grid item xs={12} container direction='column' justifyContent='center' sx={{ height: '264px', backgroundImage: `url(${gridImg})`, backgroundSzie: 'cover', padding: 0, margin: 0 }} > */}
                    <Grid item xs={12} container direction='column'
                        sx={{ height: '264px', backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url(${gridImg})`, backgroundSzie: 'cover', padding: 0, margin: 0 }} >
                        <Typography sx={{ fontFamily: 'Helvetica', fontSize: '30px', fontWeight: 800, color: 'white', marginTop: '105px', marginBottom: '20px', letterSpacing: '2px' }}>{title}</Typography>
                        {subTitle ?
                            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '18px', color: 'white' }}>— {subTitle} —</Typography>
                            :
                            <></>
                        }
                    </Grid>
                </Grid>
            }
        </>
    )
}

export const TimelineDotStyle = { bgcolor: '#a2a8ae', borderWidth: 0, boxShadow: 0 }

// TextFleld : 숫자 3자리수마다 콤마.
export const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
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


export const Share = ({ currentUrl, kakaoTitle, kakaoDescription, kakaoImage, componentRef }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:1200px)');
    const isLgTablet = useMediaQuery('(max-width:1366px)');
    const { Kakao } = window;
    const style = { height: 27.5, width: 27.5 }
    const [anchorEl, setAnchorEl] = React.useState(null);
    // useEffect(())
    const realUrl = "https://hijonam.com/"
    // 로컬 주소 (localhost 3000 같은거)
    const resultUrl = window.location.href;
    // 재랜더링시에 실행되게 해준다.
    useEffect(() => {
        // init 해주기 전에 clean up 을 해준다.
        Kakao.cleanup();
        // 자신의 js 키를 넣어준다.
        Kakao.init('7d104801938fe6ed97ff8d2e0337fd70');
        // 잘 적용되면 true 를 뱉는다.
        // console.log(Kakao.isInitialized());
    }, []);

    const shareKakao = () => {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: kakaoTitle,
                description: kakaoDescription,
                imageUrl: kakaoImage,
                link: {
                    mobileWebUrl: resultUrl,
                    webUrl: resultUrl,
                },
            },
            buttons: [
                {
                    title: '바로가기',
                    link: {
                        mobileWebUrl: resultUrl,
                        webUrl: resultUrl,
                    },
                },
            ],
        });
    }
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const openWidnow = (url) => {
        window.open(url, "_blank");
    };
    const shareToFacebook = (title, url) => {
        const sharedLink = encodeURIComponent(url);
        openWidnow(`http://www.facebook.com/sharer/sharer.php?u=${sharedLink}`);
    };
    const shareToTwitter = (title, url) => {
        const sharedLink =
            "text=" + encodeURIComponent(title + " \n ") + encodeURIComponent(url);
        openWidnow(`https://twitter.com/intent/tweet?${sharedLink}`);
    };
    return (
        <>
            {isMobile ?
                <div className={`${ReactPrintStyled.printShare}`}>
                    <IconButton aria-describedby={id} variant="contained" onClick={handleClick}>
                        <ShareIcon />
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Grid container>
                            <Grid item xs={4}>
                                <IconButton onClick={() => shareToFacebook(kakaoTitle, currentUrl)}>
                                    <FacebookIcon size={27.5} round={true} borderRadius={24} className={`${ReactPrintStyled.PrintIcon}`}></FacebookIcon>
                                </IconButton>
                            </Grid>
                            <Grid item xs={4}>
                                <IconButton onClick={() => shareToTwitter(kakaoTitle, currentUrl)}>
                                    <TwitterIcon size={27.5} round={true} borderRadius={24} className={`${ReactPrintStyled.PrintIcon}`}></TwitterIcon>
                                </IconButton>
                            </Grid>
                            {/* <Grid item xs={3}>
                                <IconButton onClick={() => shareOnMobile({ text: kakaoDescription, url: currentUrl, title: kakaoTitle, })}>
                                    <LineIcon size={27.5} round={true} borderRadius={24} className={`${ReactPrintStyled.PrintIcon}`}></LineIcon>
                                </IconButton>
                            </Grid> */}
                            <Grid item xs={4}>
                                <IconButton onClick={() => shareKakao()}>
                                    <SvgIcon sx={{ color: "#FFCD00", borderRadius: 24, ...style }} className={`${ReactPrintStyled.PrintIcon}`}>
                                        <path d="M22.125 0H1.875C.8394 0 0 .8394 0 1.875v20.25C0 23.1606.8394 24 1.875 24h20.25C23.1606 24 24 23.1606 24 22.125V1.875C24 .8394 23.1606 0 22.125 0zM12 18.75c-.591 0-1.1697-.0413-1.7317-.1209-.5626.3965-3.813 2.6797-4.1198 2.7225 0 0-.1258.0489-.2328-.0141s-.0876-.2282-.0876-.2282c.0322-.2198.8426-3.0183.992-3.5333-2.7452-1.36-4.5701-3.7686-4.5701-6.5135C2.25 6.8168 6.6152 3.375 12 3.375s9.75 3.4418 9.75 7.6875c0 4.2457-4.3652 7.6875-9.75 7.6875zM8.0496 9.8672h-.8777v3.3417c0 .2963-.2523.5372-.5625.5372s-.5625-.2409-.5625-.5372V9.8672h-.8777c-.3044 0-.552-.2471-.552-.5508s.2477-.5508.552-.5508h2.8804c.3044 0 .552.2471.552.5508s-.2477.5508-.552.5508zm10.9879 2.9566a.558.558 0 0 1 .108.4167.5588.5588 0 0 1-.2183.371.5572.5572 0 0 1-.3383.1135.558.558 0 0 1-.4493-.2236l-1.3192-1.7479-.1952.1952v1.2273a.5635.5635 0 0 1-.5627.5628.563.563 0 0 1-.5625-.5625V9.3281c0-.3102.2523-.5625.5625-.5625s.5625.2523.5625.5625v1.209l1.5694-1.5694c.0807-.0807.1916-.1252.312-.1252.1404 0 .2814.0606.3871.1661.0985.0984.1573.2251.1654.3566.0082.1327-.036.2542-.1241.3425l-1.2818 1.2817 1.3845 1.8344zm-8.3502-3.5023c-.095-.2699-.3829-.5475-.7503-.5557-.3663.0083-.6542.2858-.749.5551l-1.3455 3.5415c-.1708.5305-.0217.7272.1333.7988a.8568.8568 0 0 0 .3576.0776c.2346 0 .4139-.0952.4678-.2481l.2787-.7297 1.7152.0001.2785.7292c.0541.1532.2335.2484.4681.2484a.8601.8601 0 0 0 .3576-.0775c.1551-.0713.3041-.2681.1329-.7999l-1.3449-3.5398zm-1.3116 2.4433l.5618-1.5961.5618 1.5961H9.3757zm5.9056 1.3836c0 .2843-.2418.5156-.5391.5156h-1.8047c-.2973 0-.5391-.2314-.5391-.5156V9.3281c0-.3102.2576-.5625.5742-.5625s.5742.2523.5742.5625v3.3047h1.1953c.2974 0 .5392.2314.5392.5156z" />
                                    </SvgIcon>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Popover>
                </div>
                :
                isLgTablet ?
                    <div className={`${ReactPrintStyled.printShare}`}>
                        <IconButton>
                            <FacebookShareButton url={currentUrl}>
                                <FacebookIcon size={27.5} round={true} borderRadius={24} className={`${ReactPrintStyled.PrintIcon}`}></FacebookIcon>
                            </FacebookShareButton>
                        </IconButton>
                        <IconButton>
                            <TwitterShareButton url={currentUrl}>
                                <TwitterIcon size={27.5} round={true} borderRadius={24} className={`${ReactPrintStyled.PrintIcon}`}></TwitterIcon>
                            </TwitterShareButton>
                        </IconButton>
                        <IconButton>
                            <LineShareButton url={currentUrl}>
                                <LineIcon size={27.5} round={true} borderRadius={24} className={`${ReactPrintStyled.PrintIcon}`}></LineIcon>
                            </LineShareButton>
                        </IconButton>
                        <IconButton onClick={() => shareKakao()}>
                            <SvgIcon sx={{ color: "#FFCD00", borderRadius: 24, ...style }} className={`${ReactPrintStyled.PrintIcon}`}>
                                <path d="M22.125 0H1.875C.8394 0 0 .8394 0 1.875v20.25C0 23.1606.8394 24 1.875 24h20.25C23.1606 24 24 23.1606 24 22.125V1.875C24 .8394 23.1606 0 22.125 0zM12 18.75c-.591 0-1.1697-.0413-1.7317-.1209-.5626.3965-3.813 2.6797-4.1198 2.7225 0 0-.1258.0489-.2328-.0141s-.0876-.2282-.0876-.2282c.0322-.2198.8426-3.0183.992-3.5333-2.7452-1.36-4.5701-3.7686-4.5701-6.5135C2.25 6.8168 6.6152 3.375 12 3.375s9.75 3.4418 9.75 7.6875c0 4.2457-4.3652 7.6875-9.75 7.6875zM8.0496 9.8672h-.8777v3.3417c0 .2963-.2523.5372-.5625.5372s-.5625-.2409-.5625-.5372V9.8672h-.8777c-.3044 0-.552-.2471-.552-.5508s.2477-.5508.552-.5508h2.8804c.3044 0 .552.2471.552.5508s-.2477.5508-.552.5508zm10.9879 2.9566a.558.558 0 0 1 .108.4167.5588.5588 0 0 1-.2183.371.5572.5572 0 0 1-.3383.1135.558.558 0 0 1-.4493-.2236l-1.3192-1.7479-.1952.1952v1.2273a.5635.5635 0 0 1-.5627.5628.563.563 0 0 1-.5625-.5625V9.3281c0-.3102.2523-.5625.5625-.5625s.5625.2523.5625.5625v1.209l1.5694-1.5694c.0807-.0807.1916-.1252.312-.1252.1404 0 .2814.0606.3871.1661.0985.0984.1573.2251.1654.3566.0082.1327-.036.2542-.1241.3425l-1.2818 1.2817 1.3845 1.8344zm-8.3502-3.5023c-.095-.2699-.3829-.5475-.7503-.5557-.3663.0083-.6542.2858-.749.5551l-1.3455 3.5415c-.1708.5305-.0217.7272.1333.7988a.8568.8568 0 0 0 .3576.0776c.2346 0 .4139-.0952.4678-.2481l.2787-.7297 1.7152.0001.2785.7292c.0541.1532.2335.2484.4681.2484a.8601.8601 0 0 0 .3576-.0775c.1551-.0713.3041-.2681.1329-.7999l-1.3449-3.5398zm-1.3116 2.4433l.5618-1.5961.5618 1.5961H9.3757zm5.9056 1.3836c0 .2843-.2418.5156-.5391.5156h-1.8047c-.2973 0-.5391-.2314-.5391-.5156V9.3281c0-.3102.2576-.5625.5742-.5625s.5742.2523.5742.5625v3.3047h1.1953c.2974 0 .5392.2314.5392.5156z" />
                            </SvgIcon>
                        </IconButton>
                    </div>
                    :
                    <div className={`${ReactPrintStyled.printShare}`}>
                        <IconButton>
                            <FacebookShareButton url={currentUrl}>
                                <FacebookIcon size={27.5} round={true} borderRadius={24} className={`${ReactPrintStyled.PrintIcon}`}></FacebookIcon>
                            </FacebookShareButton>
                        </IconButton>
                        <IconButton>
                            <TwitterShareButton url={currentUrl}>
                                <TwitterIcon size={27.5} round={true} borderRadius={24} className={`${ReactPrintStyled.PrintIcon}`}></TwitterIcon>
                            </TwitterShareButton>
                        </IconButton>
                        <IconButton>
                            <LineShareButton url={currentUrl}>
                                <LineIcon size={27.5} round={true} borderRadius={24} className={`${ReactPrintStyled.PrintIcon}`}></LineIcon>
                            </LineShareButton>
                        </IconButton>
                        <IconButton onClick={() => shareKakao()}>
                            <SvgIcon sx={{ color: "#FFCD00", borderRadius: 24, ...style }} className={`${ReactPrintStyled.PrintIcon}`}>
                                <path d="M22.125 0H1.875C.8394 0 0 .8394 0 1.875v20.25C0 23.1606.8394 24 1.875 24h20.25C23.1606 24 24 23.1606 24 22.125V1.875C24 .8394 23.1606 0 22.125 0zM12 18.75c-.591 0-1.1697-.0413-1.7317-.1209-.5626.3965-3.813 2.6797-4.1198 2.7225 0 0-.1258.0489-.2328-.0141s-.0876-.2282-.0876-.2282c.0322-.2198.8426-3.0183.992-3.5333-2.7452-1.36-4.5701-3.7686-4.5701-6.5135C2.25 6.8168 6.6152 3.375 12 3.375s9.75 3.4418 9.75 7.6875c0 4.2457-4.3652 7.6875-9.75 7.6875zM8.0496 9.8672h-.8777v3.3417c0 .2963-.2523.5372-.5625.5372s-.5625-.2409-.5625-.5372V9.8672h-.8777c-.3044 0-.552-.2471-.552-.5508s.2477-.5508.552-.5508h2.8804c.3044 0 .552.2471.552.5508s-.2477.5508-.552.5508zm10.9879 2.9566a.558.558 0 0 1 .108.4167.5588.5588 0 0 1-.2183.371.5572.5572 0 0 1-.3383.1135.558.558 0 0 1-.4493-.2236l-1.3192-1.7479-.1952.1952v1.2273a.5635.5635 0 0 1-.5627.5628.563.563 0 0 1-.5625-.5625V9.3281c0-.3102.2523-.5625.5625-.5625s.5625.2523.5625.5625v1.209l1.5694-1.5694c.0807-.0807.1916-.1252.312-.1252.1404 0 .2814.0606.3871.1661.0985.0984.1573.2251.1654.3566.0082.1327-.036.2542-.1241.3425l-1.2818 1.2817 1.3845 1.8344zm-8.3502-3.5023c-.095-.2699-.3829-.5475-.7503-.5557-.3663.0083-.6542.2858-.749.5551l-1.3455 3.5415c-.1708.5305-.0217.7272.1333.7988a.8568.8568 0 0 0 .3576.0776c.2346 0 .4139-.0952.4678-.2481l.2787-.7297 1.7152.0001.2785.7292c.0541.1532.2335.2484.4681.2484a.8601.8601 0 0 0 .3576-.0775c.1551-.0713.3041-.2681.1329-.7999l-1.3449-3.5398zm-1.3116 2.4433l.5618-1.5961.5618 1.5961H9.3757zm5.9056 1.3836c0 .2843-.2418.5156-.5391.5156h-1.8047c-.2973 0-.5391-.2314-.5391-.5156V9.3281c0-.3102.2576-.5625.5742-.5625s.5742.2523.5742.5625v3.3047h1.1953c.2974 0 .5392.2314.5392.5156z" />
                            </SvgIcon>
                        </IconButton>
                        <IconButton onClick={() => handlePrint()}>
                            <img src={PrintIcon} style={style} className={`${ReactPrintStyled.PrintIcon}`} />
                            {/* <img src="https://img.icons8.com/fluency-systems-regular/48/1A1A1A/print.png" style={style} className={`${ReactPrintStyled.PrintIcon}`} /> */}
                            {/* <img src="https://img.icons8.com/small/16/1A1A1A/print.png" style={style} className={`${ReactPrintStyled.PrintIcon}`} /> */}
                            {/* <img src="https://img.icons8.com/ios/50/print--v1.png" style={style} className={`${ReactPrintStyled.PrintIcon}`} /> */}
                            {/* <LocalPrintshopOutlinedIcon sx={}  /> */}

                        </IconButton>
                        {/* <ReactToPrint
                trigger={() =>
                    <button style={{ border: 0, backgroundColor: '#fff' }}>
                        <LocalPrintshopOutlinedIcon />
                    </button>
                }
                content={() => componentRef.current}
            /> */}
                    </div>
            }
        </>
    )
}
// 프린터

// 파일 유형 확인 함수
export const getFileType = (fileName) => {
    if (fileName.endsWith('.pdf')) {
        return 'pdf';
    } else if (fileName.endsWith('.webp')) {
        return 'image';
    }
    return 'unknown';
};