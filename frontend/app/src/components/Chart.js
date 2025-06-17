import React, { useState, useEffect } from 'react';

function TemperatureWebSocket() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const ws = new WebSocket(`ws://localhost:8000/ws/temperature?token=Bearer ${token}`);

        ws.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                setMessages(prev => [...prev.slice(-19), msg]);
            } catch (err) {
                console.error("Invalid WebSocket message format:", e.data);
            }
        };

        return () => ws.close();
    }, []);

    return (
        <div>
            <h2>🌡️ Live Temperature Readings</h2>

            <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
                {messages.map((msg, index) => (
                    <li
                        key={index}
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <div>
                            <strong>Temperature:</strong> {msg.temperature}°
                            {msg.unit === 'celsius' ? 'C' : 'F'}
                        </div>
                        <div><strong>Timestamp:</strong> {new Date(msg.timestamp).toLocaleString()}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TemperatureWebSocket;
