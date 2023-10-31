import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Container from 'react-bootstrap/Container';
import NavbarComponent from './compontents/nav.jsx';
import HomePage from './compontents/homePage.jsx';
import Bio from './compontents/bioPage.jsx';
import Artworks from './compontents/artworksPage.jsx';
import Exhibition from './compontents/exhibitionPage.jsx';
import Contact from './compontents/contactPage.jsx';
import Sort from './compontents/sortPage.jsx';
import AdminLogin from "./compontents/Admin/login.jsx";
import AdminDashboard from "./compontents/Admin/dashboard.jsx";

import './App.css';

function App() {
    const [lang, setLang] = useState('En')
    // Handler
    const handleSwitchChange = () => {
        if (lang === 'Kr') {
            setLang('En');
        } else {
            setLang('Kr');
        }
    };
    return (
        <Router>
            {/* 이미지 여러개 / 관리자가 사진 Insert 기능 */}
            <div className="App container-fluid gx-0 p-0" style={{ maxWidth: '100vw', width: '100vw' }}>
                <NavbarComponent handleSwitchChange={handleSwitchChange} />
                <main id="wrapper">
                    <div className="container-fluid p-0">
                        <Routes>
                            <Route path="/" element={<HomePage lang={lang} />} />
                            <Route path="/bio/*" element={<Bio lang={lang} />} />
                            <Route path="/artworks" element={<Artworks />} />
                            <Route path="/exhibition/*" element={<Exhibition lang={lang} />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/sort" element={<Sort />} />
                            <Route path="/admin" element={<AdminLogin />} />
                            <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

export default App;
