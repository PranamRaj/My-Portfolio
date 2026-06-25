import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Home.css';

function Home() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        // Ensure the section elements are hidden initially to prevent flashing
        gsap.set([titleRef.current, subtitleRef.current, btnRef.current], {
            opacity: 0,
            y: 40
        });

        // Create a sequential entry timeline that triggers right after the header drops down
        const tl = gsap.timeline({ delay: 0.8 });

        tl.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out'
        })
            .to(subtitleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4') // overlaps slightly with title animation for smoothness
            .to(btnRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.5)'
            }, '-=0.3');
    }, []);

    return (
        <section ref={containerRef} className="home-container" id="home">
            {/* Background ambient radial glow shapes */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>

            <div className="home-content">
                <h5 className="home-tagline">MERN STACK DEVELOPER</h5>

                <h1 ref={titleRef} className="home-title">
                    Crafting Digital Experiences <br />
                    With <span className="gradient-text">Code & Motion</span>
                </h1>

                <p ref={subtitleRef} className="home-subtitle">
                    I build scalable full-stack web applications and interactive interfaces
                    using MongoDB, Express, React, and Node.js.
                </p>

                <div ref={btnRef} className="home-buttons">
                    <button className="btn-primary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                        Let's Talk
                    </button>
                    <button className="btn-secondary" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
                        View My Work
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Home;
