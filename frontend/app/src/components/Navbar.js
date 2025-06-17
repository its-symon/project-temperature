import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <AppBar position="static" color="transparent">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Temperature Dashboard
                </Typography>
                <Button color="inherit" component={RouterLink} to="/">
                    Dashboard
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
