import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Header.css';

gsap.registerPlugin(ScrollTrigger);

// 🚀 FIX 1: Destructured { readyToAnimate } as an object property
function Header({ readyToAnimate }) {
    const headerRef = useRef(null);
    const revealRefs = useRef([]);
    revealRefs.current = [];

    const addToRefs = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        // 🛑 Stop everything if the preloader hasn't finished sliding away
        if (!readyToAnimate) return;

        const targets = revealRefs.current;
        const header = headerRef.current;
        let inactivityTimeout;
        let isHeaderVisible = true; // Tracks state to prevent conflicting GSAP overwrites

        // 1. Initial Stagger Entry Animation (Triggers immediately after preloader clears)
        gsap.set(targets, { opacity: 0, y: -60 });
        gsap.to(targets, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power4.out',
            delay: 0.1
        });

        // 2. Base Header Animation Object Setup
        gsap.set(header, { y: 0 });
        const slideHeaderAnimation = gsap.to(header, {
            y: -120,
            paused: true,
            duration: 0.35,
            ease: 'power2.out'
        });

        const showHeader = () => {
            if (!isHeaderVisible) {
                slideHeaderAnimation.reverse();
                isHeaderVisible = true;
            }
        };

        const hideHeader = () => {
            if (isHeaderVisible) {
                slideHeaderAnimation.play();
                isHeaderVisible = false;
            }
        };

        // 3. Optimized Scroll-Only Tracking Engine
        const triggerInstance = ScrollTrigger.create({
            start: "top top",
            end: "max",
            onUpdate: (self) => {
                const currentScrollY = window.scrollY;
                clearTimeout(inactivityTimeout);

                // CONDITION A: If at the absolute top, keep it visible
                if (currentScrollY <= 5) {
                    showHeader();
                    return;
                }

                // CONDITION B: Scrolling down -> Hide immediately
                if (self.direction === 1) {
                    hideHeader();
                }
                // CONDITION C: Scrolling up -> Reveal, then start 2-second hide countdown
                else {
                    showHeader();

                    inactivityTimeout = setTimeout(() => {
                        hideHeader();
                    }, 2000); // Strict 2-second hiding window
                }
            }
        });

        // Cleanup resources cleanly on component unmount
        return () => {
            if (triggerInstance) triggerInstance.kill();
            clearTimeout(inactivityTimeout);
        };
    }, [readyToAnimate]); // 🚀 FIX 2: Added dependency to listen to status changes from preloader

    const handleScroll = (id) => {
        const targetElement = document.getElementById(id);
        if (!targetElement) return;

        const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: id === 'home' ? 0 : targetPosition - headerHeight + 20,
            behavior: 'smooth'
        });
    };

    return (
        <header ref={headerRef} className="main-header">
            <div className="Header-contents">
                {/* Name Brand */}
                {/* 🚀 FIX 3: Set default opacity: 0 via inline style to prevent flashing before mount */}
                <div ref={addToRefs} className="Myname" onClick={() => handleScroll('home')} style={{ opacity: 0 }}>
                    Pranam Raj
                </div>

                {/* Navigation Elements */}
                <ul>
                    <li ref={addToRefs} onClick={() => handleScroll('home')} style={{ opacity: 0 }}>Home</li>
                    <li ref={addToRefs} onClick={() => handleScroll('about')} style={{ opacity: 0 }}>About</li>
                    <li ref={addToRefs} onClick={() => handleScroll('skills')} style={{ opacity: 0 }}>Skills</li>
                    <li ref={addToRefs} onClick={() => handleScroll('projects')} style={{ opacity: 0 }}>Projects</li>
                    <li ref={addToRefs} onClick={() => handleScroll('contact')} style={{ opacity: 0 }}>Contact</li>
                </ul>
            </div>
        </header>
    );
}

export default Header;
