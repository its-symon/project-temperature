import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const providers = [{ id: 'credentials', name: 'Email and Password' }];

export default function CredentialsSignUpPage() {
    const theme = useTheme();
    const navigate = useNavigate(); // ✅ Moved here

    const signUp = async (provider, formData) => {
        try {
            const email = formData.get('email');
            const password = formData.get('password');

            const response = await fetch('http://localhost:8000/api/v1/auth/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                navigate('/signin', { replace: true }); // ✅ Use it here
            } else {
                const errorData = await response.json();
                alert('Signup failed: ' + (errorData.detail || 'Unknown error'));
            }
        } catch (err) {
            alert('An error occurred: ' + err.message);
        }
    };

    return (
        <AppProvider theme={theme}>
            <SignInPage
                signIn={signUp}
                providers={providers}
                slotProps={{
                    emailField: { autoFocus: true },
                    form: { noValidate: true },
                    submitButton: { children: 'Sign Up' }
                }}
            />
        </AppProvider>
    );
}
