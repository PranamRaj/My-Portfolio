import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BrowserMockup from './BrowserMockup';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    const trackRef = useRef(null);
    const containerRef = useRef(null);

    const myProjects = [
        {
            id: 1,
            title: "Football Connect",
            url: "https://foot-connect-eta.vercel.app/",
            techStack: { frontend: ['React', 'CSS'], backend: ['Node.js', 'Express'], database: ['MongoDB'] },
            description: "A full-stack football community platform built with the MERN stack, enabling users to connect with fellow football enthusiasts and join matches.",
            color: "#335fff"
        },
        {
            id: 2,
            title: "Portfolio Website",
            url: "https://myportfolio-cbcd1.web.app",
            techStack: { frontend: ['React', 'CSS'], backend: ['Node.js', 'Express'], database: ['MongoDB'] },
            description: "A personal portfolio website showcasing my projects and skills.",
            color: "#33ffe7"
        },
    ];

    useLayoutEffect(() => {
        const track = trackRef.current;
        const container = containerRef.current;
        if (!track || !container) return;

        // 1. Core Horizontal Scroll and Page Pinning
        const totalCards = myProjects.length;

        const getScrollWidth = () => track.scrollWidth - window.innerWidth;

        const mainAnim = gsap.to(track, {
            x: () => -getScrollWidth(),
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 1,
                start: 'top top',
                // Uses a functional end value to re-evaluate accurately on window resize
                end: () => `+=${window.innerHeight * totalCards}`,
                invalidateOnRefresh: true,
                snap: {
                    snapTo: 1 / (totalCards - 1),
                    duration: { min: 0.2, max: 0.5 },
                    ease: "power1.inOut",
                    delay: 0.05
                }
            },
        });

        // 2. Individual Card Info Reveal Animations
        // Triggers individual staggered fade-ins for titles and badges as each card scrolls past
        const projectCards = gsap.utils.toArray('.project-slide-card');
        const childAnimations = [];

        projectCards.forEach((card, index) => {
            // Target the textual details inside the card
            const projectInfoElements = card.querySelectorAll('.project-name, .project-description, .project-techstack p, .browser-mockup-container');

            if (projectInfoElements.length === 0) return;

            const cardAnim = gsap.fromTo(projectInfoElements,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.98
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.08,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: mainAnim, // Crucial: links animation to the horizontal track instead of window scroll
                        start: "left 70%",
                        end: "right 30%",
                        toggleActions: "play reverse play reverse" // Repeats whenever scrolling back and forth
                    }
                }
            );
            childAnimations.push(cardAnim);
        });
        // Project Title Scroll Animation (Runs forward on down-scroll, reverses on up-scroll)
        const titleAnim = gsap.fromTo(".project-title",
            {
                opacity: 0,
                y: 40,
                clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" // Simulates a text mask reveal
            },
            {
                opacity: 1,
                y: 0,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".projects-top-header", // Triggers when the top header area enters
                    start: "top 85%",               // Starts when header top is 85% down the viewport
                    end: "bottom 15%",              // Ends near the top of the screen
                    toggleActions: "play reverse play reverse" // Repeats whenever scrolling back and forth
                }
            }
        );

        // Also remember to animate the "PROJECTS" tag right above it!
        const tagAnim = gsap.fromTo(".projects-top-header .section-tag",
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".projects-top-header",
                    start: "top 85%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );

        // Clean up all running triggers and structural caches properly
        return () => {
            if (mainAnim.scrollTrigger) mainAnim.scrollTrigger.kill();
            titleAnim.kill();
            tagAnim.kill();
            childAnimations.forEach(anim => {
                if (anim.scrollTrigger) anim.scrollTrigger.kill();
            });
            ScrollTrigger.refresh();
        };

    }, []); // Empty dependency array keeps the instantiation single-run and stable


    return (
        <section className="projects-section" id="projects">
            {/* Isolated Title Block Area (Safe from Pinning math) */}
            <div className="projects-top-header">
                <div className="section-tag" style={{ textAlign: 'center' }}>
                    PROJECTS
                </div>
                <p className='project-title'>
                    An interactive <span className='accent-text'>digital ecosystem</span> engineered to show how modern tech stacks <span className="accent-text">train the mind</span> and <span className="accent-text">shape creative developer logic</span>.
                </p>
            </div>

            {/* Locked Pinning Track */}
            <div ref={containerRef} className="horizontal-scroll-container">
                <div ref={trackRef} className="projects-horizontal-track">
                    {myProjects.map((project) => (
                        <div key={project.id} className="project-slide-card">
                            <div className="browser-mockup-container">
                                <span className="project-info">
                                    <h3 className="project-name">{project.title}</h3>
                                    <p className="project-description">{project.description}</p>
                                    <div className="ambient-glow glow-1" style={{ background: project.color }}></div>
                                    <div className="project-techstack">
                                        <p>
                                            <span className="tech-label-prefix">Client-Side:</span> {project.techStack.frontend.map((skill, idx) => (
                                                <span key={idx} className="project-bubble">{skill}</span>
                                            ))}
                                        </p>
                                        <p>
                                            <span className="tech-label-prefix">Server-Side:</span> {project.techStack.backend.map((skill, idx) => (
                                                <span key={idx} className="project-bubble">{skill}</span>
                                            ))}
                                        </p>
                                        <p>
                                            <span className="tech-label-prefix">Database:</span> {project.techStack.database.map((skill, idx) => (
                                                <span key={idx} className="project-bubble">{skill}</span>
                                            ))}
                                        </p>
                                    </div>
                                </span>
                                <BrowserMockup projectUrl={project.url} projectTitle={project.title} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
