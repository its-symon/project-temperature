import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import '../components/style.css';

function TemperatureWebSocket() {
    const [messages, setMessages] = useState([]);
    const celsiusChartRef = useRef(null);
    const fahrenheitChartRef = useRef(null);
    const celsiusInstanceRef = useRef(null);
    const fahrenheitInstanceRef = useRef(null);
    const navigate = useNavigate();

    const MAX_POINTS = 20;

    useEffect(() => {
        const fetchTemperatures = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/temperature/?skip=0&limit=${MAX_POINTS}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                });

                if (response.status === 401) {
                    navigate('/signin');
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    const reversed = data.reverse();
                    setMessages(reversed);
                    updateCharts(reversed);
                } else {
                    console.error("Failed to fetch data:", response.status);
                }

            } catch (err) {
                console.error("Error fetching initial temperatures:", err);
            }
        };

        fetchTemperatures();
    }, [navigate]);

    // WebSocket setup
    useEffect(() => {
        const token = localStorage.getItem("token");
        const ws = new WebSocket(`ws://localhost:8000/ws/temperature?token=Bearer ${token}`);

        ws.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                setMessages(prev => {
                    const updated = [...prev.slice(-MAX_POINTS + 1), msg];
                    updateCharts(updated);
                    return updated;
                });
            } catch (err) {
                console.error("Invalid WebSocket message:", e.data);
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        return () => ws.close();
    }, []);

    // Initialize both charts
    useEffect(() => {
        const celsiusCtx = celsiusChartRef.current.getContext("2d");
        const fahrenheitCtx = fahrenheitChartRef.current.getContext("2d");

        celsiusInstanceRef.current = new Chart(celsiusCtx, {
            type: 'line',
            data: { labels: [], datasets: [{ label: 'Celsius (°C)', data: [], borderColor: 'rgb(75, 192, 192)', tension: 0.3 }] },
            options: {
                animation: {
                    duration: 1000,
                    easing: 'easeInQuart'
                },
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Time' }
                    },
                    y: {
                        title: { display: true, text: 'Temperature (°C)' }
                    }
                }
            }
        });

        fahrenheitInstanceRef.current = new Chart(fahrenheitCtx, {
            type: 'line',
            data: { labels: [], datasets: [{ label: 'Fahrenheit (°F)', data: [], borderColor: 'rgb(255, 99, 132)', tension: 0.3 }] },
            options: {
                animation: {
                    duration: 1000,
                    easing: 'easeInQuart'
                },
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Time' }
                    },
                    y: {
                        title: { display: true, text: 'Temperature (°C)' }
                    }
                }
            }

        });

        return () => {
            celsiusInstanceRef.current?.destroy();
            fahrenheitInstanceRef.current?.destroy();
        };
    }, []);

    const updateCharts = (data) => {
        const celsiusChart = celsiusInstanceRef.current;
        const fahrenheitChart = fahrenheitInstanceRef.current;

        const celsiusData = data.filter(d => d.unit === 'celsius');
        const fahrenheitData = data.filter(d => d.unit === 'fahrenheit');

        celsiusChart.data.labels = celsiusData.map(d => new Date(d.timestamp).toLocaleTimeString());
        celsiusChart.data.datasets[0].data = celsiusData.map(d => d.temperature);
        celsiusChart.update();

        fahrenheitChart.data.labels = fahrenheitData.map(d => new Date(d.timestamp).toLocaleTimeString());
        fahrenheitChart.data.datasets[0].data = fahrenheitData.map(d => d.temperature);
        fahrenheitChart.update();
    };

    return (
        <>
            <Navbar />
            <div className="charts-container">
                <div className="chart-wrapper celsius-chart">
                    <h2>Celsius Temperature</h2>
                    <canvas ref={celsiusChartRef} />
                </div>
                <div className="chart-wrapper fahrenheit-chart">
                    <h2>Fahrenheit Temperature</h2>
                    <canvas ref={fahrenheitChartRef} />
                </div>
            </div>
        </>
    );
}

export default TemperatureWebSocket;
