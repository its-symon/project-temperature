import React, { useState, useEffect } from 'react';

function DashboardPage() {
    const [temperatures, setTemperatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const limit = 5;
    const skip = (page - 1) * limit;

    useEffect(() => {
        const fetchTemperatures = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/temperature/?skip=${skip}&limit=${limit}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTemperatures(data);  // ✅ store array in state
                    setLoading(false);
                } else {
                    const errorData = await response.json();
                    setError('Error: ' + errorData.detail);
                    setLoading(false);
                }
            } catch (error) {
                setError('An error occurred: ' + error.message);
                setLoading(false);
            }
        };

    fetchTemperatures();
    }, [page]);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome! You are logged in.</p>

            {loading && <p>Loading temperature data...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && temperatures.length > 0 && (
                <table border="1" cellPadding="8" style={{ marginTop: '20px' }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Temperature (°C)</th>
                        <th>Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {temperatures.map((temp) => (
                        <tr key={temp.id}>
                            <td>{temp.id}</td>
                            <td>{temp.temperature}</td>
                            <td>{new Date(temp.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {!loading && temperatures.length === 0 && <p>No temperature data available.</p>}

            {!loading && (
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>

                    <span style={{ margin: '0 10px' }}>Page {page}</span>

                    <button
                        onClick={() => {
                            if (temperatures.length === limit) {
                                setPage((prev) => prev + 1);
                            }
                        }}
                        disabled={temperatures.length < limit}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
