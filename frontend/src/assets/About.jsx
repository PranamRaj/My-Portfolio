import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

function About() {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    cardsRef.current = [];

    const addToCardsRef = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    useEffect(() => {
        const section = sectionRef.current;

        // Fade up the introductory text block on scroll
        gsap.fromTo(section.querySelectorAll('.animate-about-text'),
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%', // triggers when the top of the section hits 75% of viewport height
                    toggleActions: 'play none none none'
                }
            }
        );

        // Staggered reveal of tech cards on scroll
        gsap.fromTo(cardsRef.current,
            { opacity: 0, scale: 0.85, y: 30 },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: '.tech-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }, []);

    // Data array for your MERN & foundational tech stack
    const skills = [
        { name: 'MongoDB', category: 'Database', color: '#10b981' },
        { name: 'Express.js', category: 'Backend', color: '#64748b' },
        { name: 'React.js', category: 'Frontend', color: '#06b6d4' },
        { name: 'Node.js', category: 'Backend', color: '#22c55e' },
        { name: 'Python', category: 'Languages', color: '#eab308' },
        { name: 'Java / C++', category: 'Languages', color: '#3b82f6' },
        { name: 'JavaScript', category: 'Languages', color: '#f59e0b' },
        { name: 'GSAP / Motion', category: 'Animation', color: '#a855f7' }
    ];

    return (
        <section ref={sectionRef} className="about-container" id="about">
            <div className="about-wrapper">

                {/* Left Side: Biography */}
                <div className="about-left">
                    <h5 className="section-tag animate-about-text">01 // ABOUT ME</h5>
                    <h2 className="section-heading animate-about-text">
                        Solving Complex Problems Through Clean Architecture.
                    </h2>
                    <p className="about-description animate-about-text">
                        I am a Computer Science & Engineering student specializing in building robust web infrastructures.
                        My passion lies in bridging the gap between heavy, logical backend architectures and highly interactive, fluid user interfaces.
                    </p>
                    <p className="about-description animate-about-text">
                        When I'm not tuning queries or adjusting animation curves, I analyze engineering logic systems and experiment with modular design patterns.
                    </p>
                </div>

                {/* Right Side: Interactive Tech Stack Grid */}
                <div className="about-right">
                    <h4 className="grid-title animate-about-text">MY CORE TOOLKIT</h4>
                    <div className="tech-grid">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                ref={addToCardsRef}
                                className="tech-card"
                                style={{ '--accent-glow': skill.color }}
                            >
                                <div className="card-inner">
                                    <span className="skill-cat">{skill.category}</span>
                                    <h3 className="skill-name">{skill.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

export default About;
