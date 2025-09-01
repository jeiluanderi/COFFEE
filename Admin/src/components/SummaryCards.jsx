import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ArrowUp, CheckCircle } from 'lucide-react';
import NewOrderModal from './NewOrderModal';
import '../index.css';

const SummaryCards = () => {
    // State to manage the summary data fetched from the backend
    const [summaryData, setSummaryData] = useState({
        newOrders: 0,
        totalOrders: 0,
        waitingList: 0,
        totalOrdersChange: 0,
        waitingListChange: 0,
    });
    // State to manage the visibility of the new order modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Function to fetch summary data from the backend
        const fetchSummaryData = async () => {
            try {
                // Replace with your actual backend API endpoint
                const response = await axios.get('https://localhost:3001/api/summary');
                setSummaryData(response.data);
            } catch (error) {
                console.error("Error fetching summary data:", error);
            }
        };

        fetchSummaryData();
    }, []);

    // Function to handle a new order being created and refetch the data
    const handleOrderCreated = () => {
        // Here you can either call fetchSummaryData() again to get the updated counts
        // or update the state optimistically if you know the changes
        const fetchSummaryData = async () => {
            try {
                const response = await axios.get('https://localhost:3001/api/summary');
                setSummaryData(response.data);
            } catch (error) {
                console.error("Error fetching summary data:", error);
            }
        };
        fetchSummaryData();
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="summary-grid">
            <div className="summary-card">
                <div className="summary-card-header">
                    <span className="summary-card-title">New Orders</span>
                    <div className="icon-circle yellow"><CheckCircle size={20} color="white" /></div>
                </div>
                <div className="value">{summaryData.newOrders}</div>
                <span className="subtitle">Updated every new order</span>
            </div>
            <div className="summary-card">
                <div className="summary-card-header">
                    <span className="summary-card-title">Total Orders</span>
                    <div className="icon-circle yellow"><ArrowUp size={20} color="white" /></div>
                </div>
                <div className="value">{summaryData.totalOrders}</div>
                <span className="subtitle">
                    <ArrowUp size={16} color="#4a5568" className="icon" />
                    +{summaryData.totalOrdersChange}% than usual
                </span>
            </div>
            <div className="summary-card">
                <div className="summary-card-header">
                    <span className="summary-card-title">Waiting List</span>
                    <div className="icon-circle yellow"><ArrowUp size={20} color="white" /></div>
                </div>
                <div className="value">{summaryData.waitingList}</div>
                <span className="subtitle">
                    <ArrowUp size={16} color="#4a5568" className="icon" />
                    +{summaryData.waitingListChange}% than usual
                </span>
            </div>
            <button className="create-order-btn" onClick={() => setIsModalOpen(true)}>
                <Plus size={24} className="mr-2" />
                CREATE NEW ORDER
            </button>
            {/* Render the modal based on the state */}
            <NewOrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onOrderCreated={handleOrderCreated}
            />
        </div>
    );
};

export default SummaryCards;
