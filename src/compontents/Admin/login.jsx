import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Grid, TextField, Button } from '@mui/material';
import { generateTheme } from '../util.jsx';

function AdminLogin() {
    const isLgTablet = useMediaQuery('(max-width:1366px)');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const usernameRules = (value) => {
        if (value) return true;
        return 'You must enter a username.';
    };

    const passwordRules = (value) => {
        if (value) return true;
        return 'You must enter a password.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameRules(username) || !passwordRules(password)) {
            alert('Please enter valid username and password');
            return;
        }
        try {
            const response = await axios.post('http://hijonam.com/api/admin/login', {
                username,
                password,
            });

            if (response.data.token) {
                localStorage.setItem('admin-token', response.data.token);
                navigate('/admin-dashboard');
            } else {
                alert('잘못된 사용자 이름이나 비밀번호입니다.');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            alert('로그인 중 에러가 발생했습니다.');
        }
    };

    const someProps = { fontFamily: null, fontSize: null }
    const theme = generateTheme(someProps);

    return (
        <div className="admin-login">
            <Grid container sx={{ height: '60vh' }} justifyContent="center" alignItems="center">
                <Grid item xs={isLgTablet ? 4 : 2} container direction="column" justifyContent="center" textAlign='center' sx={{ border: '1px solid #c8ccd0', borderRadius: 3, padding: 3 }}>
                    <h3 className="mb-5" style={{ fontWeight: 600 }}>
                        L O G I N
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="filled"
                                    label="User Name"
                                    fullWidth
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="filled"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ThemeProvider theme={theme}>
                                    <Button type="submit" variant="outlined" fullWidth>
                                        SUBMIT
                                    </Button>
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                    </form>

                </Grid>
            </Grid>
        </div>
    );
}

export default AdminLogin;
