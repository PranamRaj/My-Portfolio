import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Header.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Header() {
    const headerRef = useRef(null);

    // Track targeted nodes directly using a React pointer array
    const revealRefs = useRef([]);
    revealRefs.current = [];

    // Safely appends nodes sequentially into the array
    const addToRefs = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        const targets = revealRefs.current;

        // 1. Force absolute zero states to avoid unstyled element flashes
        gsap.set(targets, { opacity: 0, y: -60 });

        // 2. High-end Staggered Fall Animation sequence
        gsap.to(targets, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power4.out',
            delay: 0.2
        });

        // 3. Scroll Reactivity (Hiding on scroll down, sliding back on up)
        const header = headerRef.current;
        const showHideHeader = gsap.fromTo(header,
            { y: 0 },
            {
                y: -120, // Slides clear out of the viewing field boundaries
                paused: true,
                duration: 0.35,
                ease: 'power2.out'
            }
        );

        ScrollTrigger.create({
            start: "top top+=10",
            end: "max",
            onUpdate: (self) => {
                if (self.direction === 1) {
                    showHideHeader.play(); // Going down
                } else {
                    showHideHeader.reverse(); // Going back up
                }
            }
        });

        // Cleanup triggers on unmount
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    // Handler for layout jumps
    const handleScroll = (id) => {
        const targetElement = document.getElementById(id);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header ref={headerRef} className="main-header">
            <div className="Header-contents">

                {/* Name Brand (Drops 1st) */}
                <div ref={addToRefs} className="Myname" onClick={() => handleScroll('home')}>
                    Pranam Raj
                </div>

                {/* Navigation Elements */}
                <ul>
                    <li ref={addToRefs} onClick={() => handleScroll('home')}>Home</li>
                    <li ref={addToRefs} onClick={() => handleScroll('about')}>About Me</li>
                    <li ref={addToRefs} onClick={() => handleScroll('contact')}>Contact Me</li>
                </ul>

            </div>
        </header>
    );
}

export default Header;
