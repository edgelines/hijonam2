import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppBar, Toolbar, Container, Grid, Box, Tabs, Tab, IconButton, Typography, Stack, Collapse  } from '@mui/material';

import {styled} from '@mui/material/styles'
// import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styledComponents from 'styled-components';
import useMediaQuery from '@mui/material/useMediaQuery';
// import Icon from '@mdi/react';
// import { mdiPresentation } from '@mdi/js';
// import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
// import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import SettingsIcon from '@mui/icons-material/Settings';

// import { AccountCircle, Palette, Slideshow, ContactMail } from '@mui/icons-material';
// import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import HomeImg from '../assets/test.webp'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { AntSwitch } from './util.jsx';
import logo from '../assets/hijonam_logo.png'
export default function NavbarComponent({ handleSwitchChange }) {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [collapse, setCollapse] = useState(true);
    const [navbarOpen, setNavbarOpen] = useState(false);

    // useEffect(() => {
    //     // useDisplay와 유사한 로직을 구현해야 합니다.
    //     // 예를 들어, window의 width를 기반으로 mobileBreakpoint와 name을 설정할 수 있습니다.
    // }, []);
    // const [value, setValue] = useState(0);

    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // };

    const onClickInstagram = () => {
        window.open("https://www.instagram.com/hijonam.official/", "_blank");
    }
// const handleMenuClick = () => {
//     // Navbar의 토글 버튼을 프로그래마틱하게 클릭하여 메뉴를 닫습니다.
//     document.querySelector(".navbar-toggler").click();
// };
const handleMenuClick = () => {
    setNavbarOpen(false);
};
    return (
        <>
            {isMobile ? (
                <>
                <Collapse in={collapse} timeout={1000} collapsedSize={10} sx={{ width : '100vw'}}>
                <Box sx={{ width : '100vw'}}>
                    <img src={HomeImg} style={{
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '75vh',
                        objectFit: 'cover'
                    }} />
                </Box>
            </Collapse>
                    <Navbar expand="lg" className="justify-content-between">
                        <StyledNavbarBrand as={Link} to="/" style={{ marginLeft: '5vw', marginRight: '-5vw', zIndex: 999 }} >
                            <img src={logo} style={{ width: '35vw' }} />
                        </StyledNavbarBrand>

                        <IconButton aria-label="collapse" onClick={() => setCollapse(!collapse)}
                            aria-controls="Home Image Collapse"
                            aria-expanded={collapse}
                            sx={{ marginTop: '3px', width: '30px', height: '30px', marginLeft: '10vw' }}
                        >
                            {collapse ? <ArrowDropUpIcon sx={{ fontSize: '40px' }} /> :
                                <ArrowDropDownIcon sx={{ fontSize: '40px' }} />
                            }
                        </IconButton>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: '1vh' }}>
                            <Typography sx={{ marginTop: '-1px', fontFamily: 'Helvetica', fontSize: '13px' }}>EN</Typography>
                            <AntSwitch onChange={handleSwitchChange} inputProps={{ 'aria-label': 'ant design' }} />
                            <Typography sx={{ marginTop: '-1px', fontFamily: 'Helvetica', fontSize: '13px' }}>KR</Typography>
                        </Stack>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setNavbarOpen(!navbarOpen)}  />
                        <Navbar.Collapse id="basic-navbar-nav" in={navbarOpen}>
                            <Nav className="mx-auto" onClick={handleMenuClick}>
                                <StyledNavLink as={Link} to="/bio">BIOGRAPHY</StyledNavLink>
                                <StyledNavLink as={Link} to="/artworks">ARTWORKS</StyledNavLink>
                                <StyledNavLink as={Link} to="/exhibition">EXHIBITION</StyledNavLink>
                                <StyledNavLink as={Link} to="/contact">CONTACT</StyledNavLink>
                                <StyledNavLink as={Link} onClick={(() => onClickInstagram())}>
                                    <Typography sx={{ fontFamily: 'Baguet', fontSize: '16px', marginTop: '-3px' }}>
                                        <InstagramIcon style={{ marginTop: '-4px' }} />
                                        Hijonam.official
                                    </Typography>
                                </StyledNavLink>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </>
                // <AppBar position="static" style={{ backgroundColor : 'white'}} elevation={0}>
                //     <Toolbar>
                //         <Grid container alignItems="center">
                //             <Grid item xs={12} sx={{ mt:2 }}>
                //                 <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
                //                     HIJO NAM
                //                 </Link>
                //             </Grid>
                            
                //         </Grid>
                //     </Toolbar>
                //                 <Tabs
                //                     value={value}
                //                     onChange={handleChange}
                //                     variant="scrollable"
                //                     scrollButtons={false}
                //                     // allowScrollButtonsMobile
                //                     // selectionFollowsFocus
                //                     aria-label="scrollable force tabs example"
                //                 >
                //                     <Tab label={
                //                         <Box display="flex" alignItems="center">
                //                             <PermIdentityOutlinedIcon fontSize="small" style={{ marginRight: '8px' }} />
                //                             BIOGRAPHY
                //                         </Box>
                //                     } component={Link} to="/bio" />
                //                     <Tab label={
                //                         <Box display="flex" alignItems="center">
                //                             <Palette fontSize="small" style={{ marginRight: '8px' }} />
                //                             ARTWORKS
                //                         </Box>
                //                     } component={Link} to="/artworks" />
                //                     <Tab label={
                //                         <Box display="flex" alignItems="center">
                //                             <Icon path={mdiPresentation} size={0.8} style={{ marginRight: '8px' }} />
                //                             EXHIBITION
                //                         </Box>
                //                     } component={Link} to="/exhibition" />
                //                     <Tab label={
                //                         <Box display="flex" alignItems="center">
                //                             <PortraitOutlinedIcon fontSize="small" style={{ marginRight: '8px' }} />
                //                             CONTACT
                //                         </Box>
                //                     } component={Link} to="/contact" />
                //                 </Tabs>
                // </AppBar>
            ) : (
                <>
                <Collapse in={collapse} timeout={1000} collapsedSize={10}>
                <Box>
                    <img src={HomeImg} style={{
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '780px',
                        objectFit: 'cover'
                    }} />
                </Box>
            </Collapse>
                <Navbar expand="lg" className="justify-content-between">
                    <StyledNavbarBrand as={Link} to="/" style={{ marginLeft: '5vw', marginRight: '-5vw', zIndex: 999 }} >HIJO NAM</StyledNavbarBrand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <StyledNavLink as={Link} to="/bio">BIOGRAPHY</StyledNavLink>
                            <StyledNavLink as={Link} to="/artworks">ARTWORKS</StyledNavLink>
                            <StyledNavLink as={Link} to="/exhibition">EXHIBITION</StyledNavLink>
                            <StyledNavLink as={Link} to="/contact">CONTACT</StyledNavLink>
                            <StyledNavLink as={Link} to="/sort">SORT</StyledNavLink>
                            <StyledNavLink as={Link} onClick={(()=> onClickInstagram())}>
                                <Grid container>
                                    <InstagramIcon style={{ marginTop: '-4px' }} /> 
                                    <Typography sx={{ fontFamily: 'Baguet', fontSize : '16px', marginTop : '-3px' }}>
                                        Hijonam.official
                                    </Typography>
                                </Grid>
                            </StyledNavLink>
                            {/* <StyledNavLink as={Link} onClick={(()=> onClickInstagram())} style={{ fontFamily: 'Baguet', fontSize : '16px' }}>
                                    <InstagramIcon style={{ marginTop: '-6px' }} /> Hijonam.official
                            </StyledNavLink> */}
                            <IconButton aria-label="collapse" onClick={() => setCollapse(!collapse)}
                                aria-controls="Home Image Collapse"
                                aria-expanded={collapse}
                                sx={{ marginTop : '3px', width : '30px', height : '30px' }}
                            >
                                { collapse ? <ArrowDropUpIcon sx={{ fontSize : '40px'}} /> :
                                <ArrowDropDownIcon sx={{ fontSize : '40px'}} />
                                }
                            </IconButton>
                        </Nav>
                    </Navbar.Collapse>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ marginLeft : '-7vw', marginRight : '3vw'}}>
                                <Typography sx={{ marginTop : '-1px', fontFamily: 'Helvetica', fontSize: '13px' }}>EN</Typography>
                                <AntSwitch onChange={handleSwitchChange} inputProps={{ 'aria-label': 'ant design' }} />
                                <Typography sx={{ marginTop : '-1px', fontFamily: 'Helvetica', fontSize: '13px' }}>KR</Typography>
                            </Stack>
                        <Nav.Link as={Link} to="/admin" style={{ marginRight : '2vw'}}>
                            <SettingsIcon style={{ textDecoration: 'none', color: 'black' }} />
                        </Nav.Link>
                </Navbar>
                </>
            )
            }
        </>
    );
}

const StyledNavbarBrand = styledComponents(Navbar.Brand)`
    color: black;
    font-weight: 800;
    // margin-top : -4px;
    margin-top : 2px;
    margin-left: 5vw;
    margin-right: -5vw;
    text-decoration: none !important;
    z-index: 999;
    font-size: 14px;

    // @media (min-width: 601px) and (max-width: 960px) {
    //     font-size: 14px;
    // }
    // @media (min-width : 960px) and (max-width : 1280px) {
    //     font-size: 14px;
    // }
    // @media (min-width : 1281px) {
    //     font-size: 14px;
    // }
`;

const StyledNavLink = styledComponents(Nav.Link)`
    margin-top : 1vh;
    margin-left : 2rem;
    margin-right : 2rem;
    color: black;
    text-decoration: none !important;
    font-size: 13px;
    @media (max-width : 600px) {
        margin-bottom : 1.5vh;
    }
    // @media (min-width: 601px) and (max-width: 960px) {
    //     font-size: 14px;
    // }
    // @media (min-width : 960px) and (max-width : 1280px) {
    //     font-size: 14px;
    // }
    // @media (min-width : 1281px) {
    //     font-size: 14px;
    // }
`;

const StyledTab = styled(Tab)({
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      alignItems: 'center',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
      marginRight: '8px',
    },
  });
  



// @media(min - width: 601px) and(max - width: 960px) {



//     #nav - item - position {
//         margin - left: calc(var(--base - space) * 23);
//     }
// }

// @media(min - width : 960px) and(max - width : 1280px) {
    

//     .nav - font {
//         color: black!important;
//         text - decoration: none!important;
//         font - size: 1.111rem;
//         margin - right: calc(var(--base - space) * 3.2);
//     }

//     #nav - item - position {
//         margin - left: calc(var(--base - space) * 12);
//     }

//     #instagram {
//         font - size: 1.3rem!important;
//         position: relative;
//         top: -2px;
//     }

//     #instagram_text {
//         font - family: 'Baguet';
//         font - size: 0.9rem!important;
//         position: relative;
//         top: -2px;
//         left: 5px;
//     }

//     #setting {
//         font - size: 1.2rem!important;
//         position: relative;
//         top: 2px;
//     }
// }

// @media(min - width : 1281px) {

//     .nav - font {
//         color: black!important;
//         text - decoration: none!important;
//         font - size: 1.111rem;
//         margin - right: calc(var(--base - space) * 5);

//     }

//     #instagram {
//         font - size: 1.15rem!important;
//     }

//     #instagram_text {
//         font - family: 'Baguet';
//         position: relative;
//         left: 5px;
//         font - size: 1.2rem!important;
//     }

//     #nav - item - position {
//         margin - left: calc(var(--base - space) * 23);
//     }
// }



// {/* <Tab label="BIO" icon = {<PermIdentityOutlinedIcon fontSize="small" />} iconPosition="start" component={Link} to="/bio" />
//                                         <Tab label="ARTWORKS" icon = { <Palette fontSize="small" />} iconPosition="start" component={Link} to="/artworks" />
//                                         <Tab label="EXHIBITION" icon = { <Icon path={mdiPresentation} size={0.8} />} iconPosition="start" component={Link} to="/exhibition" />
//                                         <Tab label="PHOTOS" icon = { <PhotoSizeSelectActualOutlinedIcon fontSize="small" /> } iconPosition="start" component={Link} to="/photos" />
//                                         <Tab label="CONTACT" icon = { <PortraitOutlinedIcon fontSize="small" />} iconPosition="start" component={Link} to="/contact"/> */}