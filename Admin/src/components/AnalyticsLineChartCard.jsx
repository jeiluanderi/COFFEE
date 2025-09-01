import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Line } from 'react-chartjs-2'; // Uncomment and install if needed
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // Uncomment and install if needed
// import '../index.css'; // Removed, relies on global styles via main.jsx and RootLayout

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend); // Uncomment if using Chart.js

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AnalyticsLineChartCard = () => {
    const [timeframe, setTimeframe] = useState('weekly');
    const [chartData, setChartData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Dummy labels
        datasets: [{
            label: 'Sales',
            data: [0, 0, 0, 0, 0, 0, 0], // Dummy data
            borderColor: '#7b61ff',
            backgroundColor: 'rgba(123, 97, 255, 0.1)',
            tension: 0.4,
            fill: true,
        }],
    });
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';


    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // Replace with your actual backend API endpoint
                const response = await axios.get(`${backendUrl}/api/analytics/sales?timeframe=${timeframe}`, { headers: getAuthHeaders() });
                const data = response.data;
                setChartData({
                    labels: data.labels,
                    datasets: [{
                        ...chartData.datasets[0],
                        data: data.data,
                    }],
                });
            } catch (error) {
                console.error("Error fetching line chart data:", error);
                // Fallback dummy data
                setChartData({
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        ...chartData.datasets[0],
                        data: [120, 150, 100, 180, 200, 170, 220],
                    }],
                });
            }
        };

        fetchChartData();
    }, [timeframe, backendUrl]);

    // Chart options - only if react-chartjs-2 is installed
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' },
            },
            y: {
                grid: { display: true, color: '#f0f4f8' },
                ticks: { color: '#94a3b8' },
            },
        },
    };

    return (
        <div className="card analytics-line-chart">
            <div className="analytics-header">
                <h3>Sales Report</h3>
                <div className="timeframe-selector" style={{ display: 'flex', gap: '8px' }}>
                    <button className={`status-badge ${timeframe === 'weekly' ? 'active' : ''}`} onClick={() => setTimeframe('weekly')} style={{ cursor: 'pointer' }}>Weekly</button>
                    <button className={`status-badge ${timeframe === 'monthly' ? 'active' : ''}`} onClick={() => setTimeframe('monthly')} style={{ cursor: 'pointer' }}>Monthly</button>
                    <button className={`status-badge ${timeframe === 'yearly' ? 'active' : ''}`} onClick={() => setTimeframe('yearly')} style={{ cursor: 'pointer' }}>Yearly</button>
                </div>
            </div>
            <div className="chart-container">
                {/* <Line data={chartData} options={chartOptions} /> */}
                <img src="https://placehold.co/400x200/F0F4F8/6F4E37?text=Sales+Chart" alt="Sales Chart" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
        </div>
    );
};

export default AnalyticsLineChartCard;
