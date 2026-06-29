import React from 'react';
import './CustomAlert.css';

function CustomAlert({ isOpen, message, type, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="alert-overlay" onClick={onClose}>
            <div className="alert-box" onClick={(e) => e.stopPropagation()}>
                <div className="alert-header">
                    <span className={`alert-status-dot ${type}`}></span>
                    <h4 className="alert-title">{type === 'success' ? 'Success Notice' : 'System Notice'}</h4>
                </div>
                <p className="alert-message">{message}</p>
                <button className="alert-btn" onClick={onClose}>
                    Acknowledge
                </button>
            </div>
        </div>
    );
}

export default CustomAlert;
