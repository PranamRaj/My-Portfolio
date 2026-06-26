import React, { useState, useRef } from 'react';
import './BrowserMockup.css'; // We will create this next

const BrowserMockup = ({ projectUrl, projectTitle }) => {
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef(null);

    // Triggers when the iframe finishes downloading the live project
    const handleLoadComplete = () => {
        setIsLoading(false);
    };

    // Allows the user to manually refresh the embedded project
    const handleRefresh = () => {
        setIsLoading(true);
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };

    return (
        <div className="browser-container">
            {/* 1. Browser Window Header (Mac Style) */}
            <div className="browser-header">
                <div className="browser-buttons">
                    <span className="dot close"></span>
                    <span className="dot minimize"></span>
                    <span className="dot expand"></span>
                </div>

                {/* Navigation Action Controls */}
                <div className="browser-actions">
                    <button className="nav-btn" onClick={handleRefresh} title="Reload Project">
                        ↻
                    </button>
                </div>

                {/* Static Address Bar */}
                <div className="browser-address-bar">
                    <span className="lock-icon">🔒</span>
                    <span className="url-text">{projectUrl.replace(/^https?:\/\//, '')}</span>
                </div>
            </div>

            {/* 2. Main Content Window */}
            <div className="browser-body">
                {/* Dynamic Loading Spinner */}
                {isLoading && (
                    <div className="browser-loader-overlay">
                        <div className="spinner"></div>
                        <p>Spinning up your live MERN project deployment...</p>
                    </div>
                )}

                {/* The Live Embedded Web App */}
                <iframe
                    ref={iframeRef}
                    src={projectUrl}
                    title={projectTitle}
                    onLoad={handleLoadComplete}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="browser-iframe"
                />
            </div>
        </div>
    );
};

export default BrowserMockup;
