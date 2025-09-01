import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Bar } from 'react-chartjs-2'; // Uncomment and install if needed
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Uncomment and install if needed
// import '../index.css'; // Removed, relies on global styles via main.jsx and RootLayout

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // Uncomment if using Chart.js

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AnalyticsBarCharts = () => {
    const [timeframe, setTimeframe] = useState('weekly');
    const [chartData, setChartData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Dummy labels
        datasets: [{
            data: [0, 0, 0, 0, 0, 0, 0], // Dummy data
            backgroundColor: 'rgba(123, 97, 255, 0.5)',
            borderRadius: 5,
        }],
    });
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';


    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // Replace with your actual backend API endpoint
                const response = await axios.get(`${backendUrl}/api/analytics/bar-data?timeframe=${timeframe}`, { headers: getAuthHeaders() });
                const data = response.data;
                setChartData({
                    labels: data.labels,
                    datasets: [{
                        ...chartData.datasets[0],
                        data: data.data,
                    }],
                });
            } catch (error) {
                console.error("Error fetching bar chart data:", error);
                // Fallback dummy data
                setChartData({
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        ...chartData.datasets[0],
                        data: [65, 59, 80, 81, 56, 75],
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
                ticks: { display: false },
            },
            y: {
                grid: { display: false },
                ticks: { display: false },
            },
        },
    };

    return (
        <div className="card analytics-bar-charts">
            <div className="analytics-header">
                <h3>Order Analytics</h3>
                <div className="timeframe-selector" style={{ display: 'flex', gap: '8px' }}>
                    <button className={`status-badge ${timeframe === 'weekly' ? 'active' : ''}`} onClick={() => setTimeframe('weekly')} style={{ cursor: 'pointer' }}>Weekly</button>
                    <button className={`status-badge ${timeframe === 'monthly' ? 'active' : ''}`} onClick={() => setTimeframe('monthly')} style={{ cursor: 'pointer' }}>Monthly</button>
                    <button className={`status-badge ${timeframe === 'yearly' ? 'active' : ''}`} onClick={() => setTimeframe('yearly')} style={{ cursor: 'pointer' }}>Yearly</button>
                </div>
            </div>
            <div className="chart-container">
                {/* <Bar data={chartData} options={chartOptions} /> */}
                <img src="https://placehold.co/400x200/F0F4F8/8B4513?text=Order+Chart" alt="Order Chart" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
        </div>
    );
};

export default AnalyticsBarCharts;
