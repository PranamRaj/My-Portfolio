import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {TextPlugin} from 'gsap/TextPlugin';
import './About.css';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

function About() {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const textRef = useRef(null);
    cardsRef.current = [];

    const addToCardsRef = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    useEffect(() => {
        const words = ["Curiosity", "Imagination", "Logic", "Exploration", "Innovation"];
        const masterTl = gsap.timeline({ repeat: -1 });
        words.forEach((word) => {
            // Create a sub-timeline for each word
            const wordTl = gsap.timeline({
                repeatDelay: 0.5, // Holds the word on screen for 1.5 seconds
                repeat: 1,        // Executes twice: types forward, then deletes backward
                yoyo: true        // Makes the timeline reverse after the first playthrough
            });
            
            wordTl.to(textRef.current, {
                duration: word.length * 0.1, // Smooth, dynamic speed based on word length
                text: {
                    value: word,
                },
                ease: "power1.inOut",
            });
            
            masterTl.add(wordTl);
        });
        return () => {
            masterTl.kill();
        };
        
        // Fade up the introductory text block on scroll
        const section = sectionRef.current;
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
                    <h5 className="section-tag animate-about-text">ABOUT ME</h5>
                    <h2 className="section-heading animate-about-text">
                        Driven By <span ref={textRef} className="accent-text"></span>, Engineered For <span className="accent-text">Performance.</span>
                    </h2>
                    <p className="about-description animate-about-text">
                        My journey into software engineering started with a simple question: how do complex systems handle millions of users seamlessly?
                        As a student, I don't just want to build apps that work—I want to understand the underlying data structures,
                        optimize backend logic, and ensure every animation runs at a fluid 60 frames per second.
                    </p>
                    <p className="about-description animate-about-text">
                        I thrive in the space where design meeting engineering. When I am not working on university projects,
                        I am diving deep into open-source tools, studying clean architecture principles, and building side projects
                        that challenge me to write more modular, maintainable code.
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
