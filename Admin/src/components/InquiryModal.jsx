// components/InquiryModal.jsx

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// This is the StatusBadge component, but if it's used elsewhere,
// it should also be in its own file and imported here.
const StatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved': return 'status-resolved';
            case 'new': return 'status-new';
            default: return 'status-default';
        }
    };
    return <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>;
};

const InquiryModal = ({ inquiry, onClose }) => {
    if (!inquiry) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <div className="modal-header">
                        <h2>Inquiry from {inquiry.name}</h2>
                        <button onClick={onClose} className="close-btn">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Email:</strong> {inquiry.email}</p>
                        <p><strong>Phone:</strong> {inquiry.phone || 'N/A'}</p>
                        <p><strong>Service Type:</strong> {inquiry.service_type}</p>
                        <p><strong>Status:</strong> <StatusBadge status={inquiry.status} /></p>
                        <p><strong>Date:</strong> {new Date(inquiry.created_at).toLocaleString()}</p>
                        <div className="modal-message-box">
                            <p><strong>Message:</strong></p>
                            <p>{inquiry.message}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InquiryModal;