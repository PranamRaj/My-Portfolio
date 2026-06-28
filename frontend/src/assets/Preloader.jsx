import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Preloader.css';

const Preloader = ({ onComplete }) => {
    const loaderRef = useRef(null);
    const textRef = useRef(null);

    // Generate an array of 20 columns for the background matrix streams
    const matrixStreams = Array.from({ length: 20 });

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Staggered binary column drop-in
        gsap.fromTo(".matrix-column",
            { y: "-100%" },
            {
                y: "100%",
                duration: () => gsap.utils.random(2, 4),
                repeat: -1,
                ease: "none",
                stagger: {
                    each: 0.15,
                    from: "random"
                }
            }
        );

        // 2. Main Text Entrance
        tl.fromTo(textRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
        );

        // 3. Keep running until the site is loaded, then slide the screen away
        tl.to(loaderRef.current, {
            yPercent: -100,
            duration: 0.8,
            delay: 1.8, // Adjust time layout if needed
            ease: "power4.inOut",
            onComplete: onComplete
        });

    }, { scope: loaderRef });

    return (
        <div className="preloader-overlay" ref={loaderRef}>
            {/* Matrix Background Layer */}
            <div className="matrix-bg">
                {matrixStreams.map((_, i) => (
                    <div
                        key={i}
                        className="matrix-column"
                        style={{
                            left: `${i * 5}%`,
                            fontSize: `${gsap.utils.random(10, 16)}px`,
                            opacity: gsap.utils.random(0.03, 0.12)
                        }}
                    >
                        {Array.from({ length: 25 }).map((_, idx) => (
                            <span key={idx}>{gsap.utils.random(0, 1)}</span>
                        ))}
                    </div>
                ))}
            </div>

            {/* Central Terminal Content */}
            <div className="loader-content">
                <h1
                    ref={textRef}
                    className="loader-text"
                    data-text="{ 404 user not found }"
                >
                    <span className="bracket">{"{"}</span>
                    {" 404 user not found "}
                    <span className="bracket">{"}"}</span>
                </h1>

                <div className="loading-bar-wrapper">
                    <div className="loading-bar-progress"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
