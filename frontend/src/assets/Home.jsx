import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Home.css';
import { FiGithub, FiLinkedin, FiInstagram } from "react-icons/fi";
import profileImage from './images/profile.jpg';

// 🚀 Accept the state trigger prop from your App.jsx component
function Home({ readyToAnimate }) {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const btnRef = useRef(null);
    const socialIconsRef = useRef(null);
    const imageContainerRef = useRef(null);

    useEffect(() => {
        // 1. Immediately hide elements on load so they NEVER flash prematurely
        gsap.set([titleRef.current, subtitleRef.current, btnRef.current, socialIconsRef.current, imageContainerRef.current], {
            opacity: 0,
            y: 40
        });

        // 2. Halt execution completely if the preloader hasn't finished sliding away yet
        if (!readyToAnimate) return;

        // 3. Kick off the timeline exactly at the frame the preloader vanishes
        const tl = gsap.timeline({ delay: 0.1 });

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
            }, '-=0.4')
            .to(btnRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.5)'
            }, '-=0.3')
            .to(socialIconsRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.5)'
            }, '-=0.3')
            .to(imageContainerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'back.out(1.5)'
            }, '-=0.3');

    }, [readyToAnimate]); // 🛠️ Re-run the hook the exact second readyToAnimate switches to true

    const handleMouseMove = (e) => {
        const container = imageContainerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (y / rect.height) * 50;
        const rotateY = (x / rect.height) * 50;

        container.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
        const container = imageContainerRef.current; // Fixed: target imageContainerRef, not containerRef
        if (!container) return;
        container.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    return (
        <section ref={containerRef} className="home-container" id="home">
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>

            <div className="home-content">
                <h5 className="home-tagline"> Hi, I'm Pranam Raj — Computer Science Student</h5>

                <h1 ref={titleRef} className="home-title" style={{ opacity: 0 }}>
                    Bridging Core Computer Science <br />
                    With <span className="gradient-text">Modern Web & Motion</span>
                </h1>

                <p ref={subtitleRef} className="home-subtitle" style={{ opacity: 0 }}>
                    I am a CSE student focusing on building responsive, data-driven applications.
                    I combine academic programming fundamentals with practical MERN stack architecture
                    (MongoDB, Express, React, Node.js) to build fluid, interactive user experiences.
                </p>
                <div ref={socialIconsRef} className="social-icons" style={{ opacity: 0 }}>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                        <FiGithub />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                        <FiLinkedin />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile">
                        <FiInstagram />
                    </a>
                </div>

                <div ref={btnRef} className="home-buttons" style={{ opacity: 0 }}>
                    <button className="btn-primary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                        Let's Talk
                    </button>
                    <button className="btn-secondary">
                        <a href="/Pranam_Raj_Resume.pdf" download="Pranam_Raj_Resume.pdf" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Resume
                        </a>
                    </button>
                </div>
            </div>
            <div ref={imageContainerRef} className="image-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ opacity: 0 }}>
                <img src={profileImage} alt="Profile" />
            </div>
        </section>
    );
}

export default Home;
