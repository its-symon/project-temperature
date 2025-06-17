import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const providers = [{ id: 'credentials', name: 'Email and Password' }];

export default function LoginPage() {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleLogin = async (provider, formData) => {
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                alert('Login failed: ' + (errorData.detail || 'Unknown error'));
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
    };

    return (
        <AppProvider theme={theme}>
            <SignInPage
                signIn={handleLogin}
                providers={providers}
                slotProps={{
                    emailField: { autoFocus: true },
                    form: { noValidate: true },
                    submitButton: { children: 'Login' }
                }}
            />
        </AppProvider>
    );
}
