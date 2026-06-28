import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

function Contact() {
    const sectionRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        const section = sectionRef.current;

        // Slide-in left panel content
        gsap.fromTo(section.querySelector('.contact-left'),
            { opacity: 0, x: -60 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // Slide-in right form panel
        gsap.fromTo(section.querySelector('.contact-right'),
            { opacity: 0, x: 60 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Success! Message transmitted securely.');
                setFormData({ name: '', email: '', message: '' }); // Wipes fields clean
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            console.error('API Context error:', err);
            alert('Server is currently dormant or sleeping. Please check your console runtime log parameters.');
        }
    };

    return (
        <section ref={sectionRef} className="contact-container" id="contact">
            <div className="contact-wrapper">

                {/* Left Side: Contact Information */}
                <div className="contact-left">
                    <h5 className="section-tag">CONTACT ME</h5>
                    <h2 className="section-heading">Let's Build Something Exceptional Together.</h2>
                    <p className="contact-text">
                        I am always looking to team up on interesting projects, solve coding puzzles, or learn something new. 
                        Feel free to reach out and drop a message!
                    </p>

                    <div className="contact-info-list">
                        <div className="info-item">
                            <span className="info-label">EMAIL</span>
                            <a href="mailto:pranamraj234@gmail.com" className="info-link">pranamraj234@gmail.com</a>
                        </div>
                        <div className="info-item">
                            <span className="info-label">LOCATION</span>
                            <span className="info-val">Karnataka, India</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: High-End Interactive Form */}
                <div className="contact-right">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder=" " /* Empty placeholder trick for modern CSS floating labels */
                            />
                            <label>Your Name</label>
                            <div className="input-line"></div>
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder=" "
                            />
                            <label>Email Address</label>
                            <div className="input-line"></div>
                        </div>

                        <div className="input-group">
                            <textarea
                                name="message"
                                rows="5"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                placeholder=" "
                            ></textarea>
                            <label>Your Message</label>
                            <div className="input-line"></div>
                        </div>

                        <button type="submit" className="submit-btn">
                            <span>Send Message</span>
                            <svg viewBox="0 0 24 24" fill="none" className="arrow-icon">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>

            </div>
        </section>
    );
}

export default Contact;
