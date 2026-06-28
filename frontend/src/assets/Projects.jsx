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
            title: "E-Commerce App",
            url: "https://vercel.app",
            techStack: { frontend: ['React', 'Tailwind CSS'], backend: ['Node.js', 'Express'], database: ['MongoDB'] },
            description: "A full-stack e-commerce application built with the MERN stack, featuring user authentication, product listings, and a shopping cart.",
            color: "#335fff"
        },
        {
            id: 2,
            title: "Social Media Platform",
            url: "http://localhost:5173/",
            techStack: { frontend: ['React', 'Tailwind CSS'], backend: ['Node.js', 'Express'], database: ['MongoDB'] },
            description: "A social media platform built with the MERN stack, allowing users to create posts, follow other users, and engage with content.",
            color: "#33ffe7"
        },
    ];

    useLayoutEffect(() => {
        const track = trackRef.current;
        const container = containerRef.current;
        if (!track || !container) return;

        const totalScrollWidth = track.scrollWidth - window.innerWidth;
        const totalCards = myProjects.length;

        const anim = gsap.to(track, {
            x: -totalScrollWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 1,
                start: 'top top',
                // Explicit vertical scroll length matching card bounds perfectly
                end: () => `+=${window.innerHeight * totalCards}`,
                invalidateOnRefresh: true,
                snap: {
                    snapTo: 1 / (totalCards - 1),
                    
                    ease: "power1.inOut",
                    delay: 0.02 // Fast snapping stops jitter instantly
                }
            },
        });

        return () => {
            if (anim.scrollTrigger) anim.scrollTrigger.kill();
        };
    }, [myProjects.length]);

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
