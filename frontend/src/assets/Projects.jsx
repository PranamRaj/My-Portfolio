import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BrowserMockup from './BrowserMockup';
import './Projects.css'; // We will create this next

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    useLayoutEffect(() => {
        const track = trackRef.current;
        const container = containerRef.current;

        // Calculate total horizontal distance to slide
        // Total width of all items minus the visible screen width
        const totalScrollWidth = track.scrollWidth - window.innerWidth;

        // Create the GSAP animation timeline
        const ctx = gsap.context(() => {
            gsap.to(track, {
                x: -totalScrollWidth,
                ease: 'none', // Smooth continuous movement matching the trackpad/wheel
                scrollTrigger: {
                    trigger: container,
                    pin: true,        // Lock the section vertically in place
                    scrub: 1,         // Smooth link between scroll distance and animation (1 second lag)
                    start: 'top top', // Start animation exactly when the section hits top of window
                    end: () => `+=${track.scrollWidth}`, // Scroll duration based on real length
                    invalidateOnRefresh: true, // Recalculate dimensions cleanly if browser window resizes
                },
            });
        }, containerRef);

        // Clean up GSAP instances when component unmounts to prevent memory leaks
        return () => ctx.revert();
    }, []);

    // Mock list of your MERN projects
    const myProjects = [
        { id: 1, title: "E-Commerce App", url: "https://vercel.app" },
        { id: 2, title: "Social Media Platform", url: "https://vercel.app" },
    ];

    return (
        <div ref={containerRef} className="horizontal-scroll-container">
            {/* Dynamic Title Stays Fixed on Top Layout */}
            <div className="section-tag">
                Projects
            </div>

            {/* This track houses all items and gets shifted left by GSAP */}
            <div ref={trackRef} className="projects-horizontal-track">
                {myProjects.map((project) => (
                    <div key={project.id} className="project-slide-card">
                        <div className="project-meta-info">
                            <h3>{project.title}</h3>
                        </div>
                        {/* Using the component we built earlier */}
                        <BrowserMockup projectUrl={project.url} projectTitle={project.title} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
