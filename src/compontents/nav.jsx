import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Grid, Box, Tab, IconButton, Typography, Stack, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styledComponents from 'styled-components';
import useMediaQuery from '@mui/material/useMediaQuery';
import InstagramIcon from '@mui/icons-material/Instagram';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeImg from '../assets/test.webp'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { AntSwitch } from './util.jsx';
import logo from '../assets/hijonam_logo.png'
export default function NavbarComponent({ handleSwitchChange }) {
    const isMobile = useMediaQuery('(max-width:600px)');
    const isLgTablet = useMediaQuery('(max-width:1366px)');
    const [collapse, setCollapse] = useState(true);
    const [navbarOpen, setNavbarOpen] = useState(false);

    const onClickInstagram = () => {
        window.open("https://www.instagram.com/hijonam.official/", "_blank");
    }

    const handleMenuClick = () => {
        setNavbarOpen(false);
    };
    return (
        <>
            {isMobile ? (
                <>
                    <Collapse in={collapse} timeout={1000} collapsedSize={10} sx={{ width: '100vw' }}>
                        <Box sx={{ width: '100vw' }}>
                            <img src={HomeImg} style={{
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '35vh',
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
                            sx={{ marginTop: '3px', width: '30px', height: '30px', marginLeft: '7vw' }}
                        >
                            {collapse ? <ArrowDropUpIcon sx={{ fontSize: '40px' }} /> :
                                <ArrowDropDownIcon sx={{ fontSize: '40px' }} />
                            }
                        </IconButton>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: '1vh', ml: '-1vw' }}>
                            <Typography sx={{ marginTop: '-1px', fontFamily: 'Helvetica', fontSize: '12px' }}>EN</Typography>
                            <AntSwitch onChange={handleSwitchChange} inputProps={{ 'aria-label': 'ant design' }} />
                            <Typography sx={{ marginTop: '-1px', fontFamily: 'Helvetica', fontSize: '12px' }}>KR</Typography>
                        </Stack>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setNavbarOpen(!navbarOpen)} style={{ marginRight: '3vw' }} />
                        <Navbar.Collapse id="basic-navbar-nav" in={navbarOpen}>
                            <Nav className="mx-auto" onClick={handleMenuClick}>
                                <StyledNavLink as={Link} to="/bio">BIOGRAPHY</StyledNavLink>
                                <StyledNavLink as={Link} to="/artworks">ARTWORKS</StyledNavLink>
                                <StyledNavLink as={Link} to="/exhibition">EXHIBITION</StyledNavLink>
                                <StyledNavLink as={Link} to="/contact">CONTACT</StyledNavLink>
                                <StyledNavLink as={Link} onClick={(() => onClickInstagram())}>
                                    <Typography sx={{ fontFamily: 'Baguet', fontSize: '16px', marginTop: '-3px', marginLeft: '3px' }}>
                                        <InstagramIcon style={{ marginTop: '-4px' }} />
                                        Hijonam.official
                                    </Typography>
                                </StyledNavLink>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </>
            ) : (
                <>
                    <Collapse in={collapse} timeout={1000} collapsedSize={10}>
                        <Box>
                            <img src={HomeImg} style={{
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: isLgTablet ? '75svh' : '780px',
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
                                <StyledNavLink as={Link} onClick={(() => onClickInstagram())}>
                                    <Grid container>
                                        <InstagramIcon style={{ marginTop: '-4px' }} />
                                        <Typography sx={{ fontFamily: 'Baguet', fontSize: '16px', marginTop: '-3px', marginLeft: '3px' }}>
                                            Hijonam.official
                                        </Typography>
                                    </Grid>
                                </StyledNavLink>
                                <IconButton aria-label="collapse" onClick={() => setCollapse(!collapse)}
                                    aria-controls="Home Image Collapse"
                                    aria-expanded={collapse}
                                    sx={{ marginTop: '3px', width: '30px', height: '30px' }}
                                >
                                    {collapse ? <ArrowDropUpIcon sx={{ fontSize: '40px' }} /> :
                                        <ArrowDropDownIcon sx={{ fontSize: '40px' }} />
                                    }
                                </IconButton>
                            </Nav>
                        </Navbar.Collapse>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ marginLeft: '-7vw', marginRight: '3vw' }}>
                            <Typography sx={{ marginTop: '-1px', fontFamily: 'Helvetica', fontSize: '13px' }}>EN</Typography>
                            <AntSwitch onChange={handleSwitchChange} inputProps={{ 'aria-label': 'ant design' }} />
                            <Typography sx={{ marginTop: '-1px', fontFamily: 'Helvetica', fontSize: '13px' }}>KR</Typography>
                        </Stack>
                        <Nav.Link as={Link} to="/admin" style={{ marginRight: '2vw' }}>
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
`;