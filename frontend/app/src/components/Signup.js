import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email || !password) {
            setError('Email and password are required');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });

            setLoading(false);

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError('Signup failed: ' + errorData.detail);
            }
        } catch (error) {
            setLoading(false);
            setError('An error occurred: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Signup kor bsdk</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {email}
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {password}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Signup'}
                </button>
            </form>
        </div>
    );
}

export default Signup;
