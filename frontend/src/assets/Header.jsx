import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Header.css';

gsap.registerPlugin(ScrollTrigger);

function Header() {
    const headerRef = useRef(null);
    const revealRefs = useRef([]);
    revealRefs.current = [];

    const addToRefs = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        const targets = revealRefs.current;
        const header = headerRef.current;
        let inactivityTimeout;
        let isHeaderVisible = true; // Tracks state to prevent conflicting GSAP overwrites

        // 1. Initial Stagger Entry Animation
        gsap.set(targets, { opacity: 0, y: -60 });
        gsap.to(targets, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power4.out',
            delay: 0.2
        });

            // 1. Initial Stagger Entry Animation (Header is visible on load)
            gsap.set(targets, { opacity: 0, y: -60 });
            gsap.to(targets, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power4.out',
                delay: 0.2
            });

            // 2. Base Header Animation Object
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
                triggerInstance.kill();
                clearTimeout(inactivityTimeout);
            };
        }, []);

    const handleScroll = (id) => {
        const targetElement = document.getElementById(id);
        if (!targetElement) return;

        // Account for any potential fixed navigation height offset layout buffers
        const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: id === 'home' ? 0 : targetPosition - headerHeight + 20, // Clean offset spacing padding
            behavior: 'smooth'
        });
    };

    return (
        <header ref={headerRef} className="main-header">
            <div className="Header-contents">
                {/* Name Brand */}
                <div ref={addToRefs} className="Myname" onClick={() => handleScroll('home')}>
                    Pranam Raj
                </div>

                {/* Navigation Elements */}
                <ul>
                    <li ref={addToRefs} onClick={() => handleScroll('home')}>Home</li>
                    <li ref={addToRefs} onClick={() => handleScroll('about')}>About</li>
                    <li ref={addToRefs} onClick={() => handleScroll('skills')}>Skills</li>
                    <li ref={addToRefs} onClick={() => handleScroll('projects')}>Projects</li>
                    <li ref={addToRefs} onClick={() => handleScroll('contact')}>Contact</li>
                </ul>
            </div>
        </header>
    );
}

export default Header;
