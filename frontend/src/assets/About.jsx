import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import './About.css';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function About() {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const textRef = useRef(null);
    const containerRef = useRef(null);
    const ballRef = useRef(null);
    cardsRef.current = [];

    const addToCardsRef = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    useEffect(() => {
        // 1. Text Typing Loop Animation
        const words = ["Curiosity", "Imagination", "Logic", "Exploration", "Innovation"];
        const masterTl = gsap.timeline({ repeat: -1 });

        words.forEach((word) => {
            const wordTl = gsap.timeline({
                repeatDelay: 0.5,
                repeat: 1,
                yoyo: true
            });

            wordTl.to(textRef.current, {
                duration: word.length * 0.1,
                text: { value: word },
                ease: "power1.inOut",
            });

            masterTl.add(wordTl);
        });

        // 2. Fetch DOM nodes safely
        const section = sectionRef.current;
        const container = containerRef.current;
        const ball = ballRef.current;

        // Intro text block reveal animation on initial scroll
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
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // Tech cards staggered entrance animation
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
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // 3. Ball Tracking Scroll Animation
        const scrollAnim = gsap.fromTo(ball,
            { y: 0 },
            {
                y: () => container.offsetHeight - ball.offsetHeight,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 0.5,
                }
            }
        );

        // 4. Synchronized Education Card Glow Triggers
        cardsRef.current.forEach((card, index) => {
            const cardAccentColor = card.style.getPropertyValue('--accent-glow');

            ScrollTrigger.create({
                trigger: container,
                start: () => `top+=${(container.offsetHeight / cardsRef.current.length) * index} center`,
                end: () => `top+=${(container.offsetHeight / cardsRef.current.length) * (index + 1)} center`,
                onEnter: () => {
                    gsap.to(card, {
                        boxShadow: `0 0 25px ${cardAccentColor}`,
                        borderColor: cardAccentColor,
                        scale: 1.03,
                        duration: 0.3
                    });
                },
                onLeave: () => {
                    gsap.to(card, { boxShadow: 'none', borderColor: 'rgba(255,255,255,0.05)', scale: 1, duration: 0.3 });
                },
                onEnterBack: () => {
                    gsap.to(card, {
                        boxShadow: `0 0 25px ${cardAccentColor}`,
                        borderColor: cardAccentColor,
                        scale: 1.03,
                        duration: 0.3
                    });
                },
                onLeaveBack: () => {
                    gsap.to(card, { boxShadow: 'none', borderColor: 'rgba(255,255,255,0.05)', scale: 1, duration: 0.3 });
                },
            });
        });

        // Global animation cleanup layer on component destruction
        return () => {
            masterTl.kill();
            scrollAnim.scrollTrigger.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const educationQualifications = [
        { name: 'NMAM Institute of Technology', Place: 'Nitte, Karkal', Course: 'B.tech in CSE', color: '#10b981' },
        { name: 'Shyamili PU College', Place: 'Kidiyoor, Udupi', Course: 'PUC Science', color: '#64748b' },
        { name: 'Govt High School', Place: 'Volakadu, Udupi', Course: 'SSLC', color: '#06b6d4' },
    ];

    return (
        <section ref={sectionRef} className="about-container" id="about">
            <div className="about-wrapper">

                {/* Column 1: Biography */}
                <div className="about-left">
                    <h5 className="section-tag animate-about-text">ABOUT ME</h5>
                    <h2 className="section-heading animate-about-text">
                        Driven By <span ref={textRef} className="accent-text"></span>,<br/>Engineered For <span className="accent-text">Performance.</span>
                    </h2>
                    <p className="about-description animate-about-text">
                        My journey into software engineering started with a simple question: how do complex systems handle millions of users seamlessly?
                        As a student, I don't just want to build apps that work—I want to understand the underlying data structures,
                        optimize backend logic, and ensure every animation runs at a fluid 60 frames per second.
                    </p>
                    <p className="about-description animate-about-text">
                        I thrive in the space where design meets engineering. When I am not working on university projects,
                        I am diving deep into open-source tools, studying clean architecture principles, and building side projects
                        that challenge me to write more modular, maintainable code.
                    </p>
                </div>

                {/* Column 2: Isolated Center Scroll Track Grid Cell */}
                <div className="track-cell-wrapper" ref={containerRef}>
                    <div className="scroll-track-container">
                        <div ref={ballRef} className="following-ball"></div>
                    </div>
                </div>

                {/* Column 3: Education Panels */}
                <div className="about-right">
                    <h4 className="grid-title animate-about-text">My Education</h4>
                    <div className="tech-grid">
                        {educationQualifications.map((qualification, index) => (
                            <div
                                key={index}
                                ref={addToCardsRef}
                                className="tech-card"
                                style={{ '--accent-glow': qualification.color }}
                            >
                                <div className="card-inner">
                                    <h3 className="skill-name">
                                        {qualification.name}<br />
                                        <span className="skill-cat">{qualification.Place}</span><br />
                                        <span className="skill-cat">{qualification.Course}</span>
                                    </h3>
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
