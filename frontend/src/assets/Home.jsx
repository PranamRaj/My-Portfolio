import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Home.css';
import { FiGithub, FiLinkedin, FiInstagram } from "react-icons/fi";
import profileImage from './images/profile.jpg'; 

function Home() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const btnRef = useRef(null);
    const socialIconsRef = useRef(null);
    const imageContainerRef = useRef(null);
    useEffect(() => {
        // Ensure the section elements are hidden initially to prevent flashing
        gsap.set([titleRef.current, subtitleRef.current, btnRef.current, socialIconsRef.current, imageContainerRef.current], {
            opacity: 0,
            y: 40
        });

        // Create a sequential entry timeline that triggers right after the header drops down
        const tl = gsap.timeline({
            delay: 0.8});

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
                duration: 0.3,
                ease: 'back.out(1.5)'
            }, '-=0.3');
    }, []);

    const handleMouseMove = (e) => {
        const container = imageContainerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();

        // Calculate mouse position relative to the center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Calculate rotation angles
        const rotateX = (y / rect.height) * 50;
        const rotateY = (x / rect.height) * 50;

        // Apply inline style transforms
        container.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
        const container = containerRef.current;
        if (!container) return;

        // Reset the position
        container.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    return (
        <section ref={containerRef} className="home-container" id="home">
            {/* Background ambient radial glow shapes */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>

            <div className="home-content">
                <h5 className="home-tagline"> Hi, I'm Pranam Raj — Computer Science Student</h5>

                <h1 ref={titleRef} className="home-title">
                    Bridging Core Computer Science <br />
                    With <span className="gradient-text">Modern Web & Motion</span>
                </h1>

                <p ref={subtitleRef} className="home-subtitle">
                    I am a CSE student focusing on building responsive, data-driven applications.
                    I combine academic programming fundamentals with practical MERN stack architecture
                    (MongoDB, Express, React, Node.js) to build fluid, interactive user experiences.
                </p>
                <div ref={socialIconsRef} className="social-icons">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Profile" >
                        <FiGithub />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn Profile"
                    >
                        <FiLinkedin />
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram Profile"
                    >
                        <FiInstagram />
                    </a>
                </div>

                <div ref={btnRef} className="home-buttons">
                    <button className="btn-primary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                        Let's Talk
                    </button>
                    <button className="btn-secondary" onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>
                        View My Work
                    </button>
                </div>
            </div>
            <div ref={imageContainerRef} className="image-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <img src={profileImage} alt="Profile" />
            </div>
        </section>
    );
}

export default Home;
