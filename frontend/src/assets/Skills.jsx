import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import brainImg from './images/brain.png';
import './Skills.css';

function Skills() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const brainRef = useRef(null);

    const resumeSkills = [
        { category: "Databases", items: ["MySQL", "MongoDB", "PostgreSQL", "Redis"], color: "#00f2fe", side: "left" },
        { category: "Languages", items: ["C/C++", "Python", "JavaScript", "TypeScript", "Java"], color: "#a188f8", side: "left" },
        { category: "Frontend", items: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS"], color: "#ff5e62", side: "right" },
        { category: "Backend & Tools", items: ["Node.js", "Express.js", "Git", "Docker", "REST APIs"], color: "#ffd97d", side: "right" }
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const activePulses = resumeSkills.map(() => ({ progress: 0, active: false }));

        // Refined dynamic positioning function
        const syncCanvasLayout = () => {
            if (!containerRef.current || !canvas) return;
            const rect = containerRef.current.getBoundingClientRect();

            // Set canvas internal coordinate dimensions to match exact layout pixels
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        // Execution safety loop: sync layout immediately, on load, and after layout paints
        syncCanvasLayout();
        window.addEventListener('load', syncCanvasLayout);
        window.addEventListener('resize', syncCanvasLayout);

        // Double-check alignment after a tiny delay to wait out React's DOM paint
        const backupTimeout = setTimeout(syncCanvasLayout, 300);

        const renderLoop = () => {
            if (!containerRef.current || !brainRef.current || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const rect = containerRef.current.getBoundingClientRect();
            const brainRect = brainRef.current.getBoundingClientRect();

            // Calculate absolute center point of the brain
            const brainX = (brainRect.left + brainRect.right) / 2 - rect.left;
            const brainY = (brainRect.top + brainRect.bottom) / 2 - rect.top;

            // Gather all the rendered cards on the DOM
            const cards = containerRef.current.querySelectorAll('.skill-category-card');

            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const isLeft = resumeSkills[index].side === "left";

                // FIXED: Snap line edge directly to the inside face of the card boundary
                const cardX = isLeft ? (cardRect.right - rect.left) : (cardRect.left - rect.left);
                const cardY = (cardRect.top + cardRect.bottom) / 2 - rect.top;

                const skillColor = resumeSkills[index].color;

                // Technical connection line
                ctx.beginPath();
                ctx.moveTo(cardX, cardY);
                ctx.lineTo(brainX, brainY);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw moving data packet particle
                const pulse = activePulses[index];
                if (pulse.active) {
                    const currentX = cardX + (brainX - cardX) * pulse.progress;
                    const currentY = cardY + (brainY - cardY) * pulse.progress;

                    const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 12);
                    gradient.addColorStop(0, '#ffffff');
                    gradient.addColorStop(0.3, skillColor);
                    gradient.addColorStop(1, 'rgba(0,0,0,0)');

                    ctx.beginPath();
                    ctx.arc(currentX, currentY, 12, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            });

            requestAnimationFrame(renderLoop);
        };
        const animFrameId = requestAnimationFrame(renderLoop);

        // GSAP Timeline Sequence (One-by-One Data Stream)
        const tl = gsap.timeline({ repeat: -1 });
        activePulses.forEach((pulse, index) => {
            const targetColor = resumeSkills[index].color;
            tl.to(pulse, {
                progress: 1,
                duration: 1.4,
                ease: "power2.in",
                onStart: () => {
                    pulse.active = true;
                    pulse.progress = 0;
                },
                onComplete: () => {
                    pulse.active = false;

                    // Brain glowing shockwave sequence
                    gsap.timeline()
                        .to(brainRef.current, {
                            filter: `drop-shadow(0 0 50px ${targetColor}) drop-shadow(0 0 20px ${targetColor})`,
                            scale: 1.1,
                            duration: 0.1
                        })
                        .to(brainRef.current, {
                            filter: 'drop-shadow(0 0 15px rgba(0, 242, 254, 0.2))',
                            scale: 1,
                            duration: 0.6,
                            ease: "power1.out"
                        });
                }
            }, "+=0.4");
        });

        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener('load', syncCanvasLayout);
            window.removeEventListener('resize', syncCanvasLayout);
            clearTimeout(backupTimeout);
            tl.kill();
        };
    }, []);

    const leftSkills = resumeSkills.filter(s => s.side === "left");
    const rightSkills = resumeSkills.filter(s => s.side === "right");

    return (
        <section className="skills-section">
            <div className="section-tag">SKILLS</div>
            <h1 className="skills-title">Continuously feeding <span className='accent-text'>frameworks</span> and tools into the <span className="accent-text">central processing core.</span></h1>

            <div className="skills-wrapper" ref={containerRef}>
                {/* Fixed Overlay Canvas Positioning */}
                <canvas ref={canvasRef} id='networkCanvas'></canvas>

                {/* Left Side Column */}
                <div className="skills-column side-left">
                    {leftSkills.map((stack, index) => (
                        <div key={index} className="skill-category-card" style={{ '--accent-color': stack.color }}>
                            <h3 className="category-label">{stack.category}</h3>
                            <div className="bubble-cloud">
                                {stack.items.map((skill, idx) => (
                                    <span key={idx} className="skill-bubble">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center Node Container */}
                <div className="brain-center-node">
                    <div className="brain-image" ref={brainRef}>
                        <img src={brainImg} alt="Neural Node Hub" className="brain-icon" />
                    </div>
                </div>

                {/* Right Side Column */}
                <div className="skills-column side-right">
                    {rightSkills.map((stack, index) => (
                        <div key={index} className="skill-category-card" style={{ '--accent-color': stack.color }}>
                            <h3 className="category-label">{stack.category}</h3>
                            <div className="bubble-cloud">
                                {stack.items.map((skill, idx) => (
                                    <span key={idx} className="skill-bubble">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Skills;
