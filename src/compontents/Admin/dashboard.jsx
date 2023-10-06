import React, { useState } from 'react';
import { Grid, FormLabel, FormControlLabel, RadioGroup, Radio, List, ListItem, ListItemText, Badge } from '@mui/material';
import HomeImagePage from './homeImage.jsx';
import BioTablePage from './bioTable.jsx';
import GenresPage from './genres.jsx';
import Artworks from './artworks.jsx';
import Exhibition from './exhibitionTable.jsx';
import Upcoming from './upcomingTable.jsx';
import UserAccount from './userAccount.jsx';
import Contact from './contact.jsx';
import ArtworksHistory from './artworksHistory.jsx';
import PriceList from './priceList.jsx';
import PricePolicyPage from './pricePolicy.jsx';
import ReportPage from './report.jsx';
import ContactBookPage from './contactBook.jsx';
import PhotosPage from './photos.jsx';
import AutobiographyPage from './autobiography.jsx';
export default function AdminDashboardPage() {
    const [currentPage, setCurrentPage] = useState(null);
    const menuStyle = { textAlign: 'start', fontWeight: 600, mt: 1, color: 'black' }

    // handler
    const openGoogleAnalytics = () => {
        window.open('https://analytics.google.com/', '_blank')
    }
    const handlePageChange = (event) => {
        setCurrentPage(event.target.value);
    }
    return (
        <Grid container>
            <Grid container>
                <Grid item xs={1.5} sx={{ paddingLeft: 2 }}>
                    <RadioGroup
                        aria-labelledby="radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={currentPage} // 현재 페이지 값을 RadioGroup의 value로 설정
                        onChange={handlePageChange} // 페이지 변경 핸들러
                    >
                        <FormLabel sx={{ textAlign: 'start', fontWeight: 600, color: 'black' }}>Home</FormLabel>
                        <FormControlLabel value="Home Image" control={<Radio />} label="Home Image" />

                        <FormLabel sx={menuStyle}>Biography</FormLabel>
                        <FormControlLabel value="Awards" control={<Radio />} label="Awards" />
                        <FormControlLabel value="Published Articles" control={<Radio />} label="Published Articles" />
                        <FormControlLabel value="Artistic Engagement" control={<Radio />} label="Artistic Engagement" />
                        <FormControlLabel value="Photos" control={<Radio />} label="Photos" />
                        <FormControlLabel value="Autobiography" control={<Radio />} label="Autobiography" />

                        <FormLabel sx={menuStyle}>Artworks</FormLabel>
                        <FormControlLabel value="Genres Main Image" control={<Radio />} label="Genres Main Image" />
                        <FormControlLabel value="Artworks" control={<Radio />} label="Artworks" />

                        <FormLabel sx={menuStyle}>Exhibition</FormLabel>
                        <FormControlLabel value="Solo" control={<Radio />} label="Solo" />
                        <FormControlLabel value="Group" control={<Radio />} label="Group" />
                        <FormControlLabel value="Upcoming" control={<Radio />} label="Upcoming" />

                        <FormLabel sx={menuStyle}>Admin</FormLabel>
                        <FormControlLabel value="User Account" control={<Radio />} label="User Account" />
                        <FormControlLabel value="Check Contact" control={<Radio />} label="Check Contact" />
                        <FormControlLabel value="Artworks History" control={<Radio />} label="Artworks History" />
                        <FormControlLabel value="Price List" control={<Radio />} label="Price List" />
                        <FormControlLabel value="Report" control={<Radio />} label="Report" />
                        <FormControlLabel value="Price Policy" control={<Radio />} label="Price Policy" />
                        <FormControlLabel value="Contact Book" control={<Radio />} label="Contact Book" />
                        <FormControlLabel value="Analytics" control={<Radio />} label="Analytics" onClick={openGoogleAnalytics} />
                    </RadioGroup>
                </Grid>
                <Grid item xs={10.5}>
                    <ContentsComponent currentPage={currentPage} />
                </Grid>

            </Grid>

        </Grid>
    )
}

const ContentsComponent = ({ currentPage }) => {
    switch (currentPage) {
        case 'Home Image':
            return <HomeImagePage loadDataUrl={'home'} />;
        case 'Awards':
            return <BioTablePage loadDataUrl={'awards'} name={currentPage} />;
        case 'Published Articles':
            return <BioTablePage loadDataUrl={'articles'} name={currentPage} />;
        case 'Artistic Engagement':
            return <BioTablePage loadDataUrl={'experiences'} name={currentPage} />;
        case 'Genres Main Image':
            return <GenresPage loadDataUrl={'genres'} />;
        case 'Artworks':
            return <Artworks loadDataUrl={'artworks'} />;
        case 'Solo':
            return <Exhibition loadDataUrl={'soloExhibition'} name={currentPage} />;
        case 'Group':
            return <Exhibition loadDataUrl={'groupExhibition'} name={currentPage} />;
        case 'Upcoming':
            return <Upcoming loadDataUrl={'upcomingExhibition'} name={currentPage} />;
        case 'User Account':
            return <UserAccount loadDataUrl={'admin_users'} name={currentPage} />;
        case 'Check Contact':
            return <Contact loadDataUrl={'contact'} name={currentPage} />;
        case 'Artworks History':
            return <ArtworksHistory loadDataUrl={'artworks'} name={currentPage} />;
        case 'Price List':
            return <PriceList loadDataUrl={'artworks'} name={currentPage} />;
        case 'Report':
            return <ReportPage loadDataUrl={'artworks'} name={currentPage} />;
        case 'Price Policy':
            return <PricePolicyPage loadDataUrl={'pricePolicy'} name={currentPage} />;
        case 'Contact Book':
            return <ContactBookPage loadDataUrl={'contactBook'} name={currentPage} />;
        case 'Photos':
            return <PhotosPage loadDataUrl={'photos'} name={currentPage} />;
        case 'Autobiography':
            return <AutobiographyPage loadDataUrl={'autobiography'} name={currentPage} />;
        default:
            return <AdminHome />
    }
}

const AdminHome = () => {
    const items = [
        { id: 0, title: 'Home Sliding Image', subtitle: '첫 화면의 이미지를 추가, 변경, 삭제, 순서변경' },
        { id: 1, title: 'Awards', subtitle: 'BIO에서 Awards 추가, 변경, 삭제' },
        { id: 2, title: 'Published Articles', subtitle: 'BIO에서 Published Articles 추가, 변경, 삭제' },
        { id: 3, title: 'Work Experiences', subtitle: 'BIO에서 Work Experiences 추가, 변경, 삭제' },
        { id: 4, title: 'Genres Main Image', subtitle: 'ARTWORKS에서 상단 카테고리 이미지 추가, 변경, 삭제' },
        { id: 5, title: 'Photos', subtitle: 'Biography -> Photos 추가, 변경, 삭제' },
        { id: 6, title: 'Artworks', subtitle: '작품 등록/변경/삭제' },
        { id: 7, title: 'Solo', subtitle: 'EXHIBITION에서 Solo 부분 추가, 변경, 삭제' },
        { id: 8, title: 'Group', subtitle: 'EXHIBITION에서 Group 부분 추가, 변경, 삭제' },
        { id: 9, title: 'Upcoming', subtitle: 'Upcoming EXHIBITION 추가, 변경, 삭제 => 전시회 일정이 시작되면 자동으로 Current, 전시회 일정이 끝나면 자동으로 Past 등록됩니다.' },
        { id: 10, title: 'User Account', subtitle: '관리자 아이디 비밀번호 추가/삭제/수정' },
        { id: 11, title: 'Check Contact', subtitle: 'Contact에 저장된 내용들을 확인합니다' },
        { id: 12, title: 'Artworks History', subtitle: '작품 이력 관리' },
        { id: 13, title: 'Price List', subtitle: 'Artworks 제출용 List ( 가격 입력폼 )' },
        { id: 14, title: 'Report', subtitle: 'Artworks Report' },
        { id: 15, title: 'Contack Book', subtitle: '연락처 관리' },
    ]



    return (
        <Grid container sx={{ mt: '2vh' }}>
            {items.map((item) => (
                <Grid item xs={4} key={item.id} >
                    <List sx={{ width: '100%', paddingLeft: 5, paddingRight: 5 }}>
                        <ListItem
                            divider
                        // disableGutters
                        >
                            <ListItemText
                                primary={`${item.title}`}
                                primaryTypographyProps={{ fontWeight: 600 }}
                                secondary={`${item.subtitle}`} />
                        </ListItem>

                    </List>
                </Grid>
            ))}
        </Grid>
    )
}