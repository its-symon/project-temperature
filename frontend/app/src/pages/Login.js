import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    TextField,
    Typography,
    Button,
    Box,
    Link,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/api/v1/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.access_token);
                navigate('/');
            } else {
                const err = await res.json();
                alert('Login failed: ' + (err.detail || 'Unknown error'));
            }
        } catch (err) {
            alert('An error occurred: ' + err.message);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
            <Card sx={{ maxWidth: 400, width: '100%', padding: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Sign In
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <FormControlLabel
                            control={<Checkbox name="remember" color="primary" />}
                            label="Remember me"
                            sx={{ mt: 1 }}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Login
                        </Button>
                    </form>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Don't have an account?{' '}
                        <Link href="/signup" underline="hover">
                            Sign up
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
